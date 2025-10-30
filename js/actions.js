import { sb } from './supabaseClient.js';
import { TABLES } from './config.js';
import { getSelectedContext, print, getEl } from './ui.js';

export async function enqueue(type, payload){
  const { webAppName, userId, deviceId } = getSelectedContext();
  if(!webAppName) return { ok:false, error:'Please select WebAppName' };
  if(!userId)     return { ok:false, error:'Please select UserID' };
  if(!deviceId)   return { ok:false, error:'Please select Target device' };

  const { data, error } = await sb.rpc('enqueue_command', {
    p_user_id: userId,
    p_device_id: deviceId,          // 👈 тепер цільовий iOS device_id
    p_web_app_name: webAppName,
    p_type: type,
    p_payload: (payload || {})
  });
  if (error) return { ok:false, error: error.message };
  return { ok:true, command: data };
}

export async function fetchResultOnce(commandId){
  const { data, error } = await sb
    .from(TABLES.RESULTS)
    .select('*')
    .eq('command_id', commandId)
    .order('created_at', { ascending:false })
    .limit(1)
    .maybeSingle();
  if(error) return { ok:false, error:error.message };
  if(!data) return { ok:true, pending:true };
  return { ok:true, pending:false, result:data };
}

// Button handlers (thin)
export async function onGet(){
  const key = getEl('keyInput').value.trim(); 
  if(!key) return print({ok:false,error:'key is required for getItem'});
  const ins = await enqueue('getItem', { key }); print(ins);
  if(ins.ok){ const r = await fetchResultOnce(ins.command.id); print({ command: ins.command, result: r }); }
}

export async function onSet(){
  const key = getEl('keyInput').value.trim(); const val = getEl('valueInput').value.trim();
  if(!key) return print({ok:false,error:'key is required for setItem'});
  if(!val) return print({ok:false,error:'value is required for setItem'});
  const ins = await enqueue('setItem', { key, value: val }); print(ins);
}

export async function onRemove(){
  const key = getEl('keyInput').value.trim(); if(!key) return print({ok:false,error:'key is required for removeItem'});
  const ins = await enqueue('removeItem', { key }); print(ins);
}

export async function onClear(){ const ins = await enqueue('clear', {}); print(ins); }

export async function onKeys(){
  const ins = await enqueue('keyValues', {}); print(ins);
  if(ins.ok){ const r = await fetchResultOnce(ins.command.id); print({ command: ins.command, result: r }); }
}

export async function onMigrateFrom(){ const ins = await enqueue('migrateFromLocalStorage', {}); print(ins); }
export async function onMigrateTo(){ const ins = await enqueue('migrateToLocalStorage', {}); print(ins); }

