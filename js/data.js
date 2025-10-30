// data.js
import { sb } from './supabaseClient.js';
import { getEl, print } from './ui.js';        // ⬅️ прибрали import refreshContextBadges
import { TABLES } from './config.js';

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

  // Повертаємо булеве значення — чи є хоч один паб
  const hasAny = pubSel.options.length > 0;

  if (hasAny) {
    pubSel.selectedIndex = 0;
    await loadUsersForSelectedPub(); // лише наповнюємо userSelect, без UI-ефектів
  }

  print({ ok:true, pubs:[...pubMap.keys()] });
  return hasAny;
}

export async function loadUsersForSelectedPub(){
  const pub = getEl('pubSelect').value; 
  const userSel = getEl('userSelect');
  userSel.innerHTML = '';

  const map = window.__PUB_USER_MAP__ || new Map();
  const users = map.get(pub) ? [...map.get(pub)] : [];
  users.sort();
  users.forEach(u=>{
    const o=document.createElement('option'); 
    o.value=u; o.textContent=u; 
    userSel.appendChild(o); 
  });
  if (userSel.options.length > 0) userSel.selectedIndex = 0;

  // Повертаємо обраного юзера (або null)
  return userSel.value || null;
}

export async function loadDevicesForContext(webAppName, userId) {
  const deviceSel = getEl('deviceSelect');
  deviceSel.innerHTML = '';
  const { data, error } = await sb
    .from(TABLES.COMMANDS)
    .select('device_id')
    .eq('web_app_name', webAppName)
    .eq('user_id', userId)
    .order('device_id', { ascending: true });

  if (error) { print({ step:'loadDevices', error: error.message }); return false; }

  const uniq = [...new Set((data||[]).map(r => r.device_id).filter(Boolean))];
  uniq.forEach(d => {
    const o = document.createElement('option'); 
    o.value = d; o.textContent = d;
    deviceSel.appendChild(o);
  });

  return deviceSel.options.length > 0;
}