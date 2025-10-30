import { sb } from './supabaseClient.js';
import { TABLES } from './config.js';
import { getEl, refreshContextBadges, print } from './ui.js';

export async function loadPubs(){
  print('Loading pubs...');
  const q = sb
    .from(TABLES.COMMANDS)
    .select('web_app_name,user_id')
    .order('web_app_name', { ascending: true });

  const { data, error, status } = await q;
  console.log('loadPubs response:', { status, error, rows: data?.length, sample: data?.slice?.(0,5) });
  if (error) { print({ step:'loadPubs', status, error: error.message }); return; }

  // map pub -> set(userIds)
  const pubMap = new Map();
  (data||[]).forEach(r=>{
    const pub = r.web_app_name; const uid = r.user_id;
    if(!pub) return;
    if(!pubMap.has(pub)) pubMap.set(pub, new Set());
    if(uid) pubMap.get(pub).add(uid);
  });

  const pubSel = getEl('pubSelect');
  const userSel = getEl('userSelect');
  pubSel.innerHTML = ''; userSel.innerHTML = '';

  [...pubMap.keys()].forEach(pub=>{
    const o=document.createElement('option'); o.value=pub; o.textContent=pub; pubSel.appendChild(o);
  });

  window.__PUB_USER_MAP__ = pubMap;
  if(pubSel.options.length>0){ pubSel.selectedIndex = 0; await loadUsersForSelectedPub(); }
  refreshContextBadges();
  print({ ok:true, pubs:[...pubMap.keys()] });
}

export async function loadUsersForSelectedPub(){
  const pub = getEl('pubSelect').value; const userSel = getEl('userSelect');
  userSel.innerHTML = '';
  const map = window.__PUB_USER_MAP__ || new Map();
  const users = map.get(pub) ? [...map.get(pub)] : [];
  users.sort();
  users.forEach(u=>{ const o=document.createElement('option'); o.value=u; o.textContent=u; userSel.appendChild(o); });
  if(userSel.options.length>0) userSel.selectedIndex = 0;
  refreshContextBadges();
}