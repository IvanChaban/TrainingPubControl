// UI helpers & bindings
export const getEl = (id) => document.getElementById(id);

export function logResult(obj) {
  const container = document.getElementById('result');
  if (!container) return console.log(obj);

  const pre = document.createElement('pre');
  pre.style.whiteSpace = 'pre-wrap';
  pre.style.fontFamily = 'monospace';
  pre.style.background = '#111';
  pre.style.color = '#0f0';
  pre.style.padding = '10px';
  pre.style.borderRadius = '8px';
  pre.style.marginBottom = '8px';

  // 🟢 1) keyValues snapshot
  if (obj?.result?.result?.data?.entries) {
    const entries = obj.result.result.data.entries;
    const lines = Object.entries(entries)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join('\n');
    pre.textContent = lines;
  }
  // 🟢 2) старий keys
  else if (obj?.result?.result?.data?.keys) {
    const keys = obj.result.result.data.keys;
    pre.textContent = keys.join('\n');
  }
  // 🟢 3) removeItem — короткий, читабельний рядок
  else if (obj?.result?.result?.data && obj?.command?.type === 'removeItem') {
    const d = obj.result.result.data;
    const text = `removeItem → key: ${d.key ?? '—'}, deleted: ${d.deleted ?? 0}, ok: ${d.ok ?? false}`;
    pre.textContent = text;
  }
  else if (obj?.result?.result?.data && obj?.command?.type === 'setItem') {
    const d = obj.result.result.data;
    const text = `setItem → key: ${d.key ?? '—'}\nvalue: ${d.value ?? '—'}\ncreated: ${d.created ?? false}\nprevious: ${d.previous ?? '—'}`;
    pre.textContent = text;
  }
  else if (obj?.result?.result?.data && obj?.command?.type === 'migrateFromLocalStorage') {
    const d = obj.result.result.data;
    const n = d.count ?? 0;
    const keys = Array.isArray(d.keys) ? d.keys.join(', ') : '—';

    pre.textContent = `migrateFromLocalStorage\napplied: ${n}\nkeys: ${keys}`;
  }
  else if (obj?.result?.result?.data && obj?.command?.type === 'migrateToLocalStorage') {

    const d = obj.result.result.data;
    const n = d.count ?? 0;
    const keys = Array.isArray(d.keys) ? d.keys.join(', ') : '—';

    pre.textContent = `migrateToLocalStorage\napplied: ${n}\nkeys: ${keys}`;
  } 
  else if (obj?.result?.result?.data && obj?.command?.type === 'clear') {
    const d = obj.result.result.data || {};
    const items = (typeof d.deletedItems === 'number') ? d.deletedItems : '—';
    pre.textContent = `clear\nwebAppName: ${d.webAppName ?? '—'}\ndeletedStorage: ${d.deletedStorage ?? false}\ndeletedItems: ${items}`;
}
  // 🟡 4) дефолт — показати JSON як є
  else {
    pre.textContent = JSON.stringify(obj, null, 2);
  }

  container.appendChild(pre);
  container.scrollTop = container.scrollHeight;
}

export const getSelectedContext = () => {
   const pub = getEl('pubSelect').value;
   const deviceId = getEl('deviceSelect').value;
   const userId = window.__APP_USER_ID__ || '';
   return { webAppName: pub, userId, deviceId };
};

export const refreshContextBadges = () => {
   const { webAppName } = getSelectedContext();
   const userId = window.__APP_USER_ID__ || '';
   getEl('currentWebAppName').textContent = webAppName || '—';
   getEl('currentUserId').textContent     = userId || '—';
};

export function clearLogs() {
  const container = document.getElementById('result');
  if (container) container.innerHTML = '';
  console.clear();
}

export function setBackendStatus(state, detail) {
  // state: 'connected' | 'disconnected' | 'error' | 'pending'
  const el = document.getElementById('backendStatus');
  if (!el) return;

  const clsOff = ['badge', 'muted', 'ok', 'warn', 'err', 'pending'];
  el.className = 'badge'; // reset
  switch (state) {
    case 'connected':
      el.classList.add('ok');
      el.textContent = 'Connected';
      break;
    case 'pending':
      el.classList.add('pending');
      el.textContent = 'Connecting…';
      break;
    case 'error':
      el.classList.add('err');
      el.textContent = detail ? `Error: ${detail}` : 'Error';
      break;
    default:
      el.classList.add('muted');
      el.textContent = 'Not connected';
  }
}

export function setCommandsEnabled(enabled) {
  const ids = ['btn-get','btn-set','btn-remove','btn-clear','btn-keys','btn-mig-from','btn-mig-to'];
  ids.forEach(id => {
    const b = getEl(id);
    if (b) { b.disabled = !enabled; b.style.opacity = enabled ? 1 : .5; b.style.pointerEvents = enabled ? 'auto' : 'none'; }
  });
}