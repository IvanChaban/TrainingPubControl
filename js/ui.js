// UI helpers & bindings
export const getEl = (id) => document.getElementById(id);

export function print(obj) {
  const container = document.getElementById('result');  // відповідає верстці
  if (!container) return console.log(obj);

  const pre = document.createElement('pre');
  pre.style.whiteSpace = 'pre-wrap';
  pre.style.fontFamily = 'monospace';
  pre.style.background = '#111';
  pre.style.color = '#0f0';
  pre.style.padding = '10px';
  pre.style.borderRadius = '8px';
  pre.style.marginBottom = '8px';

  // 🟢 Якщо це результат keyValues
  if (obj?.result?.result?.data?.entries) {
    const entries = obj.result.result.data.entries;
    const lines = Object.entries(entries)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join('\n');
    pre.textContent = lines;
  }
  // 🟢 Якщо це звичайний keys (старий варіант)
  else if (obj?.result?.result?.data?.keys) {
    const keys = obj.result.result.data.keys;
    pre.textContent = keys.join('\n');
  }
  // 🟡 Інакше просто відображаємо JSON у стандартному вигляді
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
  console.clear(); // необов'язково, якщо хочеш очистити ще й консоль
}