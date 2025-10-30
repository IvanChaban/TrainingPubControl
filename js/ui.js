// UI helpers & bindings
export const getEl = (id) => document.getElementById(id);

export const print = (obj, as='json') => {
  const out = getEl('result'); const time = new Date().toLocaleTimeString();
  out.textContent = as==='json' ? `[${time}]\n`+JSON.stringify(obj,null,2) : `[${time}]\n`+String(obj);
};

export const getSelectedContext = () => {
  const pub = getEl('pubSelect').value; const userId = getEl('userSelect').value;
  return { webAppName: pub, userId };
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