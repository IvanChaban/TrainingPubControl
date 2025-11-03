// data.js
import { sb } from './supabaseClient.js';
import { getEl, logResult } from './ui.js';        // ⬅️ прибрали import refreshContextBadges
import { TABLES } from './config.js';

export async function loadPubs(){
  logResult('Loading pubs...');
  const q = sb
    .from(TABLES.COMMANDS)
    .select('web_app_name,user_id')
    .order('web_app_name', { ascending: true });

  const { data, error, status } = await q;
  console.log('loadPubs response:', { status, error, rows: data?.length, sample: data?.slice?.(0,5) });
  if (error) { logResult({ step:'loadPubs', status, error: error.message }); return; }

  // map pub -> set(userIds)
  const pubMap = new Map();
  (data||[]).forEach(r=>{
    const pub = r.web_app_name; const uid = r.user_id;
    if(!pub) return;
    if(!pubMap.has(pub)) pubMap.set(pub, new Set());
    if(uid) pubMap.get(pub).add(uid);
  });

  const pubSel = getEl('pubSelect');
  pubSel.innerHTML = '';

  [...pubMap.keys()].forEach(pub=>{
    const o=document.createElement('option'); o.value=pub; o.textContent=pub; pubSel.appendChild(o);
  });

  window.__PUB_USER_MAP__ = pubMap;

  // Повертаємо булеве значення — чи є хоч один паб
  const hasAny = pubSel.options.length > 0;

  if (hasAny) pubSel.selectedIndex = 0;

  logResult({ ok:true, pubs:[...pubMap.keys()] });
  return hasAny;
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

  if (error) { logResult({ step:'loadDevices', error: error.message }); return false; }

  const uniq = [...new Set((data||[]).map(r => r.device_id).filter(Boolean))];
  uniq.forEach(d => {
    const o = document.createElement('option'); 
    o.value = d; o.textContent = d;
    deviceSel.appendChild(o);
  });

  return deviceSel.options.length > 0;
}