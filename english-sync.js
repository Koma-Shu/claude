/* english-sync.js — per-user cloud sync for the ENGLISH app
   ----------------------------------------------------------------------------
   Mirrors the app's localStorage blob to Supabase (table `english_progress`,
   ONE jsonb row per user — see supabase_migrate_v6.sql) so a user's learning
   state follows their account across devices and browsers.

   Design (matches srs.js): local-first + optimistic. Sync runs only when
   logged in (`arcade_user`); guests stay device-local. Pulls + merges
   field-by-field (the page supplies the merge fn) so two devices never clobber
   each other, then pushes the merged result back.

   Usage:
     const sync = ENGSYNC.init({
       column : 'data',            // jsonb column on english_progress
       key    : ()=> 'eng_v1_'+id, // localStorage key holding the blob
       merge  : (local, remote)=> merged,
       onMerged: ()=>{ reloadAndRender(); }   // called when a pull changed local
     });
     sync.ready.then(...);   // first pull+merge+push done (false if offline/guest)
     sync.flush();           // debounced pull-merge-push after a local change
   ------------------------------------------------------------------------- */
(function (w) {
  'use strict';
  const SB_URL = 'https://qveznkwqfjjtjxqxdyls.supabase.co';
  const SB_KEY = 'sb_publishable_Eu8ppaJ-BxQvwGyj1UlNjw_vyywq8ge';
  const TABLE  = 'english_progress';

  function getUser(){ try{ return JSON.parse(localStorage.getItem('arcade_user') || 'null'); }catch(_){ return null; } }
  function hdrs(extra){ return Object.assign({ apikey:SB_KEY, Authorization:'Bearer '+SB_KEY, 'Content-Type':'application/json' }, extra||{}); }

  const NOOP = { ready:Promise.resolve(false), flush:function(){}, enabled:false, isOnline:()=>false, attempted:()=>true };

  function init(opts){
    const user = getUser();
    if (!user || typeof fetch === 'undefined') return NOOP;   // guest / no-fetch env → device-local only

    const col = opts.column;
    const lsGet = ()=>{ try{ return JSON.parse(localStorage.getItem(opts.key()) || '{}'); }catch(_){ return {}; } };
    const lsSet = (o)=>{ try{ localStorage.setItem(opts.key(), JSON.stringify(o)); }catch(_){ } };
    let timer=null, busy=false, online=false, attempted=false;

    async function fetchRemote(){
      const r = await fetch(SB_URL+'/rest/v1/'+TABLE+'?user_id=eq.'+encodeURIComponent(user.id)+'&select='+col, { headers:hdrs() });
      if (!r.ok) throw new Error('http '+r.status);
      const rows = await r.json();
      return (rows && rows[0]) ? (rows[0][col] || null) : null;
    }
    async function upsert(obj){
      const body = { user_id:user.id, updated_at:new Date().toISOString() }; body[col] = obj;
      const r = await fetch(SB_URL+'/rest/v1/'+TABLE+'?on_conflict=user_id', {
        method:'POST', headers:hdrs({ Prefer:'resolution=merge-duplicates,return=minimal' }),
        body:JSON.stringify(body), keepalive:true
      });
      if (!r.ok) throw new Error('http '+r.status);
    }
    // Race-safe: read local AFTER the network await; merge→write is synchronous.
    async function doSync(){
      if (busy) return false; busy = true;
      try{
        const remote = await fetchRemote();
        const local  = lsGet();
        const merged = remote ? opts.merge(local, remote) : local;
        const changed = JSON.stringify(merged) !== JSON.stringify(local);
        if (changed){ lsSet(merged); if (opts.onMerged) opts.onMerged(); }
        await upsert(merged);
        online = true; return changed;
      }catch(_){ online = false; return false; }
      finally{ busy = false; attempted = true; }
    }

    const ready = doSync();
    function flush(){ clearTimeout(timer); timer = setTimeout(doSync, 1800); }
    try{
      document.addEventListener('visibilitychange', ()=>{ if (!document.hidden) flush(); });
      w.addEventListener('focus', flush);
    }catch(_){}

    return { ready, flush, enabled:true, isOnline:()=>online, attempted:()=>attempted };
  }

  w.ENGSYNC = { init };
})(window);
