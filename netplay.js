/* netplay.js — shared online/local-2P utilities for arcade games
   Depends on: Supabase REST API (rooms table)
   Exports: window.NETPLAY
*/
(function(w){'use strict';

const SB_URL='https://qveznkwqfjjtjxqxdyls.supabase.co';
const SB_KEY='sb_publishable_Eu8ppaJ-BxQvwGyj1UlNjw_vyywq8ge';

async function sb(path,opts={}){
  let r;
  try{
    r=await fetch(SB_URL+path,{
      headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,
        'Content-Type':'application/json','Prefer':'return=representation',...opts.headers},
      ...opts});
  }catch(netErr){ throw new Error('NETWORK'); }   // DNS/CORS/offline
  if(!r.ok&&r.status!==201){
    let body=''; try{ body=await r.text(); }catch(_){}
    if(r.status===404 || /relation [^ ]*rooms[^ ]* does not exist|42P01|Could not find the table|PGRST205/i.test(body)) throw new Error('NO_TABLE');
    if(r.status===401 || r.status===403) throw new Error('FORBIDDEN');
    throw new Error('HTTP '+r.status+(body?(': '+body.slice(0,160)):''));
  }
  const txt=await r.text();return txt?JSON.parse(txt):null;
}

// Map a low-level error to a clear, user-facing message.
function npErr(e,T){
  switch(e&&e.message){
    case 'NO_TABLE':  return T('オンライン対戦用テーブル(rooms)が未作成です。Supabaseで supabase_migrate_v4.sql を実行してください。',
                              'The online "rooms" table is missing — run supabase_migrate_v4.sql in Supabase.');
    case 'NETWORK':   return T('サーバーに接続できません。通信環境をご確認ください。',
                              'Cannot reach the server. Check your connection.');
    case 'FORBIDDEN': return T('アクセスが拒否されました（RLS設定をご確認ください）。',
                              'Access denied (check the table RLS policy).');
    case 'ROOM_NOT_FOUND': return T('ルームが見つかりません','Room not found');
    case 'ROOM_STARTED':   return T('ルームは満員です','Room is full');
    default: return (e&&e.message)||T('エラーが発生しました','An error occurred');
  }
}

function genCode(){
  const ch='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:6},()=>ch[Math.floor(Math.random()*ch.length)]).join('');
}
function genTok(){return Math.random().toString(36).slice(2)+Date.now().toString(36);}

async function createRoom(game,state){
  const id=genCode(),tok=genTok();
  await sb('/rest/v1/rooms',{method:'POST',
    body:JSON.stringify({id,game,state,player1_token:tok,status:'waiting',updated_at:new Date().toISOString()})});
  return{id,tok};
}
async function joinRoom(code,game){
  const rows=await sb(`/rest/v1/rooms?id=eq.${code.toUpperCase()}&game=eq.${game}`);
  if(!rows||!rows.length)throw new Error('ROOM_NOT_FOUND');
  const room=rows[0];
  if(room.status!=='waiting')throw new Error('ROOM_STARTED');
  const tok=genTok();
  await sb(`/rest/v1/rooms?id=eq.${room.id}`,{method:'PATCH',
    body:JSON.stringify({player2_token:tok,status:'playing',updated_at:new Date().toISOString()})});
  return{room,tok};
}
async function pushState(roomId,state){
  await sb(`/rest/v1/rooms?id=eq.${roomId}`,{method:'PATCH',
    body:JSON.stringify({state,updated_at:new Date().toISOString()})});
}
async function getRoom(roomId){
  const rows=await sb(`/rest/v1/rooms?id=eq.${roomId}`);
  return(rows&&rows[0])||null;
}

let _pollTid=null;
function startPoll(roomId,ms,cb){
  stopPoll();
  _pollTid=setInterval(async()=>{
    try{const r=await getRoom(roomId);if(r)cb(r);}catch(e){console.error('np-poll',e);}
  },ms||1500);
}
function stopPoll(){if(_pollTid){clearInterval(_pollTid);_pollTid=null;}}

// ── Shared styles ──────────────────────────────────────────────────────────
function injectStyles(){
  if(document.getElementById('np-css'))return;
  const s=document.createElement('style');s.id='np-css';
  s.textContent=`
  .np-ov{position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;flex-direction:column;
    align-items:center;justify-content:center;z-index:400;gap:14px;padding:24px;
    font-family:'Hiragino Sans','Meiryo','Segoe UI',sans-serif;color:#eee;}
  .np-title{font-size:1.2rem;font-weight:bold;letter-spacing:3px;color:#ffe27a;}
  .np-btn{border:none;border-radius:10px;padding:12px 28px;font-size:.95rem;font-weight:bold;cursor:pointer;letter-spacing:1px;}
  .np-btn:disabled{opacity:.4;cursor:default;}
  .np-btn-green{background:#10b981;color:#fff;}
  .np-btn-blue{background:#3b82f6;color:#fff;}
  .np-btn-purple{background:#7c3aed;color:#fff;}
  .np-btn-gray{background:#374151;color:#aaa;}
  .np-input{background:#1e1e2e;border:1px solid #444;border-radius:8px;color:#fff;font-size:1.1rem;
    padding:10px 14px;width:150px;letter-spacing:4px;text-transform:uppercase;text-align:center;
    font-family:monospace;}
  .np-code{font-size:2.2rem;font-weight:bold;letter-spacing:8px;color:#ffe27a;
    background:rgba(0,0,0,.4);padding:14px 28px;border-radius:12px;cursor:pointer;
    border:2px dashed rgba(255,226,122,.4);}
  .np-code:hover{background:rgba(255,226,122,.07);}
  .np-row{display:flex;gap:10px;align-items:center;}
  .np-status{color:#aaa;font-size:.88rem;min-height:22px;text-align:center;max-width:280px;}
  .np-hint{color:#666;font-size:.72rem;text-align:center;}
  .np-sep{color:#444;font-size:.8rem;letter-spacing:2px;}
  .np-handoff-name{font-size:1.4rem;font-weight:bold;color:#ffe27a;letter-spacing:2px;}
  .np-handoff-hint{color:#888;font-size:.82rem;}
  .np-players-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
  .np-pcount{border:1px solid #444;border-radius:8px;background:#1e1e2e;color:#888;
    padding:8px 16px;font-size:.9rem;cursor:pointer;font-weight:bold;}
  .np-pcount.sel{border-color:#ffe27a;color:#ffe27a;background:rgba(255,226,122,.08);}
  .np-badge{display:inline-block;background:#374151;color:#aaa;border-radius:6px;
    padding:2px 8px;font-size:.7rem;margin-left:4px;}
  `;
  document.head.appendChild(s);
}

// ── Lobby overlay ───────────────────────────────────────────────────────────
// opts: { game, lang, initState:fn, onHost(id,tok,room), onJoin(room,tok), onCancel }
function showLobby(opts){
  injectStyles();
  const L=opts.lang==='en';
  const T=(ja,en)=>L?en:ja;
  const ov=document.createElement('div');ov.className='np-ov';ov.id='np-lobby';

  const title=el('div','np-title',T('オンライン対戦','Online Play'));
  const createBtn=el('button','np-btn np-btn-green',T('ルームを作る','Create Room'));
  const sep=el('div','np-sep',T('または','or'));
  const joinRow=document.createElement('div');joinRow.className='np-row';
  const codeInput=document.createElement('input');
  codeInput.className='np-input';codeInput.placeholder=T('ルームコード','Room code');codeInput.maxLength=6;
  const joinBtn=el('button','np-btn np-btn-blue',T('参加','Join'));
  joinRow.appendChild(codeInput);joinRow.appendChild(joinBtn);
  const status=el('div','np-status','');
  const codeRow=el('div','');codeRow.style.display='none';
  const codeDisp=el('div','np-code','');
  const copyHint=el('div','np-hint',T('コードをタップしてコピー・相手に伝えてください','Tap code to copy & share with opponent'));
  codeRow.appendChild(codeDisp);codeRow.appendChild(copyHint);
  const cancelBtn=el('button','np-btn np-btn-gray',T('キャンセル','Cancel'));

  [title,createBtn,sep,joinRow,codeRow,status,cancelBtn].forEach(e=>ov.appendChild(e));
  document.body.appendChild(ov);

  let waitTid=null;
  codeDisp.onclick=()=>{ try{navigator.clipboard.writeText(codeDisp.textContent);}catch(_){} };

  createBtn.onclick=async()=>{
    createBtn.disabled=true;status.textContent=T('作成中…','Creating…');
    try{
      const initSt=typeof opts.initState==='function'?opts.initState():opts.initState||{};
      const{id}=await createRoom(opts.game,initSt);
      codeDisp.textContent=id;
      codeRow.style.display='flex';codeRow.style.flexDirection='column';codeRow.style.gap='6px';codeRow.style.alignItems='center';
      createBtn.style.display='none';sep.style.display='none';joinRow.style.display='none';
      status.textContent=T('相手の接続を待っています…','Waiting for opponent…');
      waitTid=setInterval(async()=>{
        try{const room=await getRoom(id);
          if(room&&room.status==='playing'){clearInterval(waitTid);closeLobby();opts.onHost&&opts.onHost(id,room);}
        }catch(_){}
      },1500);
    }catch(e){createBtn.disabled=false;status.textContent=npErr(e,T);}
  };

  joinBtn.onclick=async()=>{
    const code=codeInput.value.trim().toUpperCase();
    if(code.length!==6){status.textContent=T('6文字のコードを入力','Enter a 6-char code');return;}
    joinBtn.disabled=true;status.textContent=T('参加中…','Joining…');
    try{
      const{room,tok}=await joinRoom(code,opts.game);
      closeLobby();opts.onJoin&&opts.onJoin(room,tok);
    }catch(e){
      joinBtn.disabled=false;
      status.textContent=npErr(e,T);
    }
  };

  cancelBtn.onclick=()=>{if(waitTid)clearInterval(waitTid);closeLobby();opts.onCancel&&opts.onCancel();};
  function closeLobby(){if(ov.parentNode)document.body.removeChild(ov);}
}

// ── Handoff overlay (local 2P pass-and-play) ───────────────────────────────
// name: player name string; lang; onReady: callback
function showHandoff(name,lang,onReady){
  injectStyles();
  const L=lang==='en';const T=(ja,en)=>L?en:ja;
  const ov=document.createElement('div');ov.className='np-ov';
  ov.style.cursor='pointer';
  const ic=el('div','',T('📱','📱'));ic.style.cssText='font-size:3rem;';
  const nm=el('div','np-handoff-name',name+T(' の番です','\'s turn'));
  const hint=el('div','np-handoff-hint',T('タップして手札を見る','Tap to see your hand'));
  [ic,nm,hint].forEach(e=>ov.appendChild(e));
  document.body.appendChild(ov);
  ov.onclick=()=>{if(ov.parentNode)document.body.removeChild(ov);if(onReady)onReady();};
}

// ── Player count picker ────────────────────────────────────────────────────
// opts: { min, max, current, lang, onChange(n) }
// Returns a DOM element
function playerCountPicker(opts){
  injectStyles();
  const L=opts.lang==='en';const T=(ja,en)=>L?en:ja;
  const wrap=document.createElement('div');wrap.className='np-players-row';
  for(let n=opts.min;n<=opts.max;n++){
    const b=el('button','np-pcount'+(n===opts.current?' sel':''),n+'P');
    b.onclick=()=>{
      wrap.querySelectorAll('.np-pcount').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel');opts.onChange(n);
    };
    wrap.appendChild(b);
  }
  return wrap;
}

// ── Online status bar ──────────────────────────────────────────────────────
function statusBar(lang){
  injectStyles();
  const L=lang==='en';const T=(ja,en)=>L?en:ja;
  const bar=document.createElement('div');
  bar.style.cssText='position:fixed;top:44px;left:0;right:0;text-align:center;font-size:.75rem;color:#7dffb0;letter-spacing:1px;z-index:50;pointer-events:none;';
  document.body.appendChild(bar);
  return{
    set(msg){bar.textContent=msg;},
    online(role){bar.textContent=role==='host'?T('🌐 ホスト','🌐 Host'):T('🌐 ゲスト','🌐 Guest');},
    remove(){if(bar.parentNode)document.body.removeChild(bar);}
  };
}

function el(tag,cls,txt){
  const e=document.createElement(tag||'div');if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;
}

w.NETPLAY={createRoom,joinRoom,pushState,getRoom,startPoll,stopPoll,
           showLobby,showHandoff,playerCountPicker,statusBar,genCode,genTok,npErr};
})(window);
