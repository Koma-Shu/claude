/* srs.js — Spaced-Repetition Scheduler for the STUDY app
   ----------------------------------------------------------------------------
   Implements the SM-2 algorithm (SuperMemo / Anki family), which is the
   practical realisation of Ebbinghaus's *forgetting curve*: memory retention
   decays roughly exponentially as R = e^(-t/S), and each successful, well-timed
   review increases the memory's stability S, stretching the next interval.
   Reviews are therefore scheduled just before the predicted moment of
   forgetting — maximising long-term retention per unit of study time.

   Persistence: Supabase (table `study_progress`, see supabase_migrate_v3.sql)
   when logged in, mirrored to localStorage; localStorage-only when logged out
   or offline. All writes are optimistic (local first, network in background).

   Exports: window.SRS = {
     ready, review(id, quality), grade(id, label), getState(id), isDue(id),
     retention(id), nextIntervalPreview(id, quality), dueList(ids), newList(ids),
     learningList(ids), stats(problems), activity(), streak(), qualityFromMC(...)
   }
   ------------------------------------------------------------------------- */
(function (w) {
  'use strict';

  const SB_URL = 'https://qveznkwqfjjtjxqxdyls.supabase.co';
  const SB_KEY = 'sb_publishable_Eu8ppaJ-BxQvwGyj1UlNjw_vyywq8ge';

  const DAY = 86400000;
  const MIN = 60000;
  const RELEARN_MS = 10 * MIN;       // a lapsed card reappears after ~10 min
  const TARGET_RETENTION = 0.9;      // we aim to review when recall ≈ 90%
  const now = () => Date.now();

  function getUser() {
    try { return JSON.parse(localStorage.getItem('arcade_user') || 'null'); }
    catch (_) { return null; }
  }
  let user = getUser();

  // ── local storage ─────────────────────────────────────────────────────────
  // Keyed per user so multiple accounts on one device stay separate.
  function lsKey() { return 'study_srs_v1_' + (user ? user.id : 'guest'); }
  function actKey() { return 'study_act_v1_' + (user ? user.id : 'guest'); }

  function loadLocal() {
    try { return JSON.parse(localStorage.getItem(lsKey()) || '{}'); }
    catch (_) { return {}; }
  }
  function saveLocal() {
    try { localStorage.setItem(lsKey(), JSON.stringify(cache)); } catch (_) {}
  }

  // activity map: { 'YYYY-MM-DD': reviewCount } — powers streaks & heatmap
  function loadAct() {
    try { return JSON.parse(localStorage.getItem(actKey()) || '{}'); }
    catch (_) { return {}; }
  }
  function saveAct() {
    try { localStorage.setItem(actKey(), JSON.stringify(act)); } catch (_) {}
  }

  let cache = loadLocal();   // itemId -> state
  let act = loadAct();

  function defaultState(id) {
    return { id, ef: 2.5, reps: 0, interval: 0, due: 0,
             lapses: 0, attempts: 0, correct: 0, last: 0, added: now() };
  }

  // ── Supabase helpers ──────────────────────────────────────────────────────
  function hdrs(extra) {
    return Object.assign({
      apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY,
      'Content-Type': 'application/json'
    }, extra || {});
  }

  // Pull every saved row for this user and merge into the cache. Remote wins
  // when it is newer (by last review time), so progress follows the account
  // across devices.
  async function pullRemote() {
    if (!user) return;
    try {
      const r = await fetch(
        SB_URL + '/rest/v1/study_progress?user_id=eq.' + user.id +
        '&select=item_id,ef,reps,interval_days,due,lapses,attempts,correct,last_reviewed,added_at',
        { headers: hdrs() });
      if (!r.ok) return;
      const rows = await r.json();
      (rows || []).forEach(row => {
        const remote = {
          id: row.item_id,
          ef: row.ef ?? 2.5,
          reps: row.reps ?? 0,
          interval: row.interval_days ?? 0,
          due: row.due ? Date.parse(row.due) : 0,
          lapses: row.lapses ?? 0,
          attempts: row.attempts ?? 0,
          correct: row.correct ?? 0,
          last: row.last_reviewed ? Date.parse(row.last_reviewed) : 0,
          added: row.added_at ? Date.parse(row.added_at) : now()
        };
        const local = cache[row.item_id];
        if (!local || (remote.last || 0) >= (local.last || 0)) cache[row.item_id] = remote;
      });
      saveLocal();
    } catch (_) { /* offline — keep local */ }
  }

  function pushRemote(s) {
    if (!user) return;
    const body = {
      user_id: user.id, item_id: s.id, ef: s.ef, reps: s.reps,
      interval_days: s.interval, due: s.due ? new Date(s.due).toISOString() : null,
      lapses: s.lapses, attempts: s.attempts, correct: s.correct,
      last_reviewed: s.last ? new Date(s.last).toISOString() : null,
      updated_at: new Date().toISOString()
    };
    try {
      fetch(SB_URL + '/rest/v1/study_progress?on_conflict=user_id,item_id', {
        method: 'POST',
        headers: hdrs({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify(body), keepalive: true
      }).catch(() => {});
    } catch (_) {}
  }

  // ── SM-2 core ─────────────────────────────────────────────────────────────
  // quality: 0..5 (>=3 is a pass). Returns the next interval in days for the
  // given current state without mutating it — used for the UI preview.
  function simulate(s, quality) {
    const n = { ...s };
    if (quality < 3) {
      n.reps = 0; n.interval = 0;
      n.due = now() + RELEARN_MS;
    } else {
      if (n.reps === 0) n.interval = 1;
      else if (n.reps === 1) n.interval = 6;
      else n.interval = Math.round(n.interval * n.ef);
      n.reps += 1;
      n.ef = Math.max(1.3, n.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      n.due = now() + n.interval * DAY;
    }
    return n;
  }

  function review(id, quality) {
    const cur = cache[id] || defaultState(id);
    const n = simulate(cur, quality);
    n.attempts = (cur.attempts || 0) + 1;
    n.correct = (cur.correct || 0) + (quality >= 3 ? 1 : 0);
    if (quality < 3) n.lapses = (cur.lapses || 0) + 1;
    n.last = now();
    if (!n.added) n.added = cur.added || now();
    cache[id] = n;
    saveLocal();
    pushRemote(n);
    logActivity();
    return n;
  }

  // Map the 4 review buttons to SM-2 quality scores.
  const LABEL_Q = { again: 1, hard: 3, good: 4, easy: 5 };
  function grade(id, label) { return review(id, LABEL_Q[label] ?? 4); }

  function nextIntervalPreview(id, label) {
    const q = LABEL_Q[label] ?? 4;
    const n = simulate(cache[id] || defaultState(id), q);
    if (q < 3) return { ms: RELEARN_MS, label: '10分' };
    return { ms: n.interval * DAY, label: humanInterval(n.interval) };
  }

  function humanInterval(days) {
    if (days < 1) return '10分';
    if (days < 30) return Math.round(days) + '日';
    if (days < 365) return Math.round(days / 30) + 'か月';
    return (days / 365).toFixed(1) + '年';
  }

  // ── retention model (Ebbinghaus) ──────────────────────────────────────────
  // At the scheduled interval recall is designed to be TARGET_RETENTION, so the
  // memory's stability S satisfies TARGET = e^(-interval/S) → S = interval/ln(1/TARGET).
  // Current predicted recall is then e^(-elapsed/S).
  function retention(id) {
    const s = cache[id];
    if (!s || !s.reps) return null;
    const stability = Math.max(s.interval, 0.04) / Math.log(1 / TARGET_RETENTION);
    const elapsed = (now() - (s.last || now())) / DAY;
    return Math.max(0, Math.min(1, Math.exp(-elapsed / stability)));
  }

  // ── queues ────────────────────────────────────────────────────────────────
  function getState(id) { return cache[id] || null; }
  function isDue(id) { const s = cache[id]; return !!s && s.reps > 0 && s.due <= now(); }
  function isLearning(id) { const s = cache[id]; return !!s && s.due <= now() && (s.reps === 0); }
  function isNew(id) { return !cache[id]; }

  function dueList(ids) { return ids.filter(id => { const s = cache[id]; return s && s.due <= now(); }); }
  function newList(ids) { return ids.filter(isNew); }
  function learningList(ids) { return ids.filter(id => { const s = cache[id]; return s && s.reps === 0 && s.attempts > 0; }); }

  // "Mastered": survived to a comfortably long interval (≥ 21 days) — the memory
  // is well consolidated on the forgetting curve.
  function isMastered(id) { const s = cache[id]; return !!s && s.interval >= 21; }

  // ── activity / streak ─────────────────────────────────────────────────────
  function dayStr(ts) {
    const d = new Date(ts);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
           '-' + String(d.getDate()).padStart(2, '0');
  }
  function logActivity() {
    const k = dayStr(now());
    act[k] = (act[k] || 0) + 1;
    saveAct();
  }
  function activity() { return act; }

  function streak() {
    let n = 0;
    const d = new Date();
    // Allow today to be empty (streak continues until a missed day before today).
    if (!act[dayStr(d.getTime())]) d.setDate(d.getDate() - 1);
    while (act[dayStr(d.getTime())]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // ── aggregate stats over a problem list ───────────────────────────────────
  function stats(problems) {
    const byCat = {};
    let studied = 0, mastered = 0, due = 0, attempts = 0, correct = 0;
    problems.forEach(p => {
      const c = p.cat;
      byCat[c] = byCat[c] || { total: 0, studied: 0, mastered: 0, due: 0, newCount: 0 };
      byCat[c].total++;
      const s = cache[p.id];
      if (s) {
        byCat[c].studied++; studied++;
        attempts += s.attempts || 0; correct += s.correct || 0;
        if (isMastered(p.id)) { byCat[c].mastered++; mastered++; }
        if (s.due <= now()) { byCat[c].due++; due++; }
      } else {
        byCat[c].newCount++;
      }
    });
    return {
      byCat, total: problems.length, studied, mastered, due,
      accuracy: attempts ? correct / attempts : null,
      streak: streak()
    };
  }

  // ── init ──────────────────────────────────────────────────────────────────
  // Re-read user in case login happened after this script first ran.
  user = getUser();
  cache = loadLocal();
  act = loadAct();
  const ready = pullRemote();

  w.SRS = {
    ready, review, grade, getState, isDue, isLearning, isNew, isMastered,
    retention, nextIntervalPreview, humanInterval,
    dueList, newList, learningList, stats, activity, streak,
    TARGET_RETENTION
  };
})(window);
