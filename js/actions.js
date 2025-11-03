// actions.js
import { sb } from './supabaseClient.js';
import { TABLES } from './config.js';
import { getSelectedContext, logResult, getEl, clearLogs } from './ui.js';

export async function enqueue(type, payload){
  const { webAppName, userId, deviceId } = getSelectedContext();
  if(!webAppName) return { ok:false, error:'Please select WebAppName' };
  if(!userId)     return { ok:false, error:'Please select UserID' };
  if(!deviceId)   return { ok:false, error:'Please select Target device' };

  const { data, error } = await sb.rpc('enqueue_command', {
    p_user_id: userId,
    p_device_id: deviceId,
    p_web_app_name: webAppName,
    p_type: type,
    p_payload: (payload || {})
  });
  if (error) return { ok:false, error: error.message };
  return { ok:true, command: data };
}

export async function fetchResultOnce(command){
  const { data, error } = await sb
    .from(TABLES.RESULTS)
    .select('*')
    .eq('command_id', command.id)
    .gte('created_at', command.created_at)
    .order('created_at', { ascending:false })
    .limit(1)
    .maybeSingle();

  if (error) return { ok:false, error:error.message };
  if (!data) return { ok:true, pending:true };
  return { ok:true, pending:false, result:data };
}

// ---------- Button handlers (uniform style) ----------

export async function onGet(){
  clearLogs();

  const key = getEl('keyInput').value.trim();
  if(!key) { logResult({ ok:false, error:'key is required for getItem' }); return; }

  const ins = await enqueue('getItem', { key });
  if (ins.ok) {
    window.__LAST_CMD__ = ins.command;
    const r = await fetchResultOnce(ins.command);
    logResult({ command: ins.command, result: r });
  } else {
    logResult(ins);
  }
}

export async function onSet(){
  clearLogs();

  const key = getEl('keyInput').value.trim();
  const val = getEl('valueInput').value.trim();
  if(!key) { logResult({ ok:false, error:'key is required for setItem' }); return; }
  if(!val) { logResult({ ok:false, error:'value is required for setItem' }); return; }

  const ins = await enqueue('setItem', { key, value: val });
  if (ins.ok) {
    window.__LAST_CMD__ = ins.command;
    const r = await fetchResultOnce(ins.command);
    logResult({ command: ins.command, result: r });
  } else {
    logResult(ins);
  }
}

export async function onRemove(){
  clearLogs();

  const key = getEl('keyInput').value.trim();
  if(!key) { logResult({ ok:false, error:'key is required for removeItem' }); return; }

  const ins = await enqueue('removeItem', { key });
  if (ins.ok) {
    window.__LAST_CMD__ = ins.command;
    const r = await fetchResultOnce(ins.command);
    logResult({ command: ins.command, result: r });
  } else {
    logResult(ins);
  }
}

export async function onClear(){
  clearLogs();

  const ins = await enqueue('clear', {});
  if (ins.ok) {
    window.__LAST_CMD__ = ins.command;
    const r = await fetchResultOnce(ins.command);
    logResult({ command: ins.command, result: r });
  } else {
    logResult(ins);
  }
}

export async function onKeys(){
  clearLogs();

  const ins = await enqueue('keyValues', {});
  if (ins.ok) {
    window.__LAST_CMD__ = ins.command;
    const r = await fetchResultOnce(ins.command);
    logResult({ command: ins.command, result: r });
  } else {
    logResult(ins);
  }
}

export async function onMigrateFrom(){
  clearLogs();

  const ins = await enqueue('migrateFromLocalStorage', {});
  if (ins.ok) {
    window.__LAST_CMD__ = ins.command;
    const r = await fetchResultOnce(ins.command);
    logResult({ command: ins.command, result: r });
  } else {
    logResult(ins);
  }
}

export async function onMigrateTo(){
  clearLogs();

  const ins = await enqueue('migrateToLocalStorage', {});
  if (ins.ok) {
    window.__LAST_CMD__ = ins.command;
    const r = await fetchResultOnce(ins.command);
    logResult({ command: ins.command, result: r });
  } else {
    logResult(ins);
  }
}