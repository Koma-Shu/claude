/* track.js — play-session tracking for arcade games
   Records: which game, who (if logged in), and seconds played.
   Data feeds the admin dashboard (admin.html). Fails silently offline.
   Requires the play_sessions table (see supabase_migrate_v2.sql).
   Exports: window.TRACK = { game, result(res) }
*/
(function(w){'use strict';

const SB_URL='https://qveznkwqfjjtjxqxdyls.supabase.co';
const SB_KEY='sb_publishable_Eu8ppaJ-BxQvwGyj1UlNjw_vyywq8ge';

const game=(location.pathname.split('/').pop()||'').replace(/\.html$/,'');
const SKIP=['','index','login','register','profile','admin','chat','friends'];
if(SKIP.includes(game)){w.TRACK={game:null,result:()=>{}};return;}

let user=null;
try{user=JSON.parse(localStorage.getItem('arcade_user')||'null');}catch(_){}

function hdrs(extra){
  return Object.assign({'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,
    'Content-Type':'application/json'},extra||{});
}

// ── Session time ────────────────────────────────────────────────
// Counts only while the tab is visible. A session row is created after
// 5 seconds of real play (skips accidental opens), then synced every 30s
// and on page hide via keepalive fetch.
let sessionId=null,seconds=0,creating=false,lastSynced=0;

setInterval(()=>{if(!document.hidden)seconds++;},1000);

async function createRow(){
  if(sessionId||creating)return;
  creating=true;
  try{
    const r=await fetch(SB_URL+'/rest/v1/play_sessions',{
      method:'POST',
      headers:hdrs({'Prefer':'return=representation'}),
      body:JSON.stringify({game,user_id:user?user.id:null,
        username:user?user.username:null,seconds})});
    if(r.ok){
      const rows=await r.json();
      if(rows&&rows[0])sessionId=rows[0].id;
      lastSynced=seconds;
    }
  }catch(_){}
  creating=false;
}

function sync(keepalive){
  if(!sessionId||seconds===lastSynced)return;
  lastSynced=seconds;
  try{
    fetch(SB_URL+'/rest/v1/play_sessions?id=eq.'+sessionId,{
      method:'PATCH',headers:hdrs(),keepalive:!!keepalive,
      body:JSON.stringify({seconds,updated_at:new Date().toISOString()})});
  }catch(_){}
}

const bootTid=setInterval(()=>{
  if(seconds>=5){clearInterval(bootTid);createRow();}
},1000);
setInterval(()=>sync(false),30000);
w.addEventListener('pagehide',()=>sync(true));
document.addEventListener('visibilitychange',()=>{if(document.hidden)sync(true);});

// ── Win/loss recording ──────────────────────────────────────────
// Call TRACK.result('win'|'loss'|'draw') at game end. No-op when logged out.
async function result(res){
  if(!user)return;
  const col=res==='win'?'wins':res==='loss'?'losses':res==='draw'?'draws':null;
  if(!col)return;
  try{
    const q=`/rest/v1/user_ratings?user_id=eq.${user.id}&game=eq.${game}`;
    const r=await fetch(SB_URL+q,{headers:hdrs()});
    const rows=r.ok?await r.json():[];
    if(rows&&rows.length){
      await fetch(SB_URL+q,{method:'PATCH',headers:hdrs(),
        body:JSON.stringify({[col]:(rows[0][col]||0)+1})});
    }else{
      await fetch(SB_URL+'/rest/v1/user_ratings',{method:'POST',headers:hdrs(),
        body:JSON.stringify({user_id:user.id,game,[col]:1})});
    }
  }catch(_){}
}

w.TRACK={game,result};
})(window);
