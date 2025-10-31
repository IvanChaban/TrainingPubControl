// UI helpers & bindings
export const getEl = (id) => document.getElementById(id);

export function print(obj) {
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
  // 🟡 4) дефолт — показати JSON як є
  else {
    pre.textContent = JSON.stringify(obj, null, 2);
  }

  container.appendChild(pre);
  container.scrollTop = container.scrollHeight;
}

export const getSelectedContext = () => {
  const pub = getEl('pubSelect').value;
  const userId = getEl('userSelect').value;
  const deviceId = getEl('deviceSelect').value;
  return { webAppName: pub, userId, deviceId };
};

export const refreshContextBadges = () => {
  const {webAppName,userId} = getSelectedContext();
  getEl('currentWebAppName').textContent = webAppName || '—';
  getEl('currentUserId').textContent     = userId || '—';
};

export const resetForm = () => {
  getEl('keyInput').value=''; getEl('valueInput').value=''; getEl('extraInput').value='';
  print('Ready. Select a command.');
};

export function clearLogs() {
  const container = document.getElementById('result');
  if (container) container.innerHTML = '';
  console.clear(); // опціонально, очищає консоль браузера
}