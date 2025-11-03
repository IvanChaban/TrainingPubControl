// main.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { getEl, refreshContextBadges, logResult, clearLogs, setBackendStatus, setCommandsEnabled } from './ui.js';
import { ensureAnonSession, getAuthUid, linkCurrentUser } from './auth.js';
import { loadPubs, loadDevicesForContext } from './data.js'; // ← прибрав loadUsersForSelectedPub
import { onGet, onSet, onRemove, onClear, onKeys, onMigrateFrom, onMigrateTo } from './actions.js';
import { subscribeResults } from './realtime.js';

window.addEventListener('DOMContentLoaded', async () => {
  // Buttons
  getEl('btn-get').addEventListener('click', onGet);
  getEl('btn-set').addEventListener('click', onSet);
  getEl('btn-remove').addEventListener('click', onRemove);
  getEl('btn-clear').addEventListener('click', onClear);
  getEl('btn-keys').addEventListener('click', onKeys);
  getEl('btn-mig-from').addEventListener('click', onMigrateFrom);
  getEl('btn-mig-to').addEventListener('click', onMigrateTo);
  getEl('btn-clear-logs').addEventListener('click', clearLogs);

  // Dropdowns
  getEl('pubSelect').addEventListener('change', async () => {
    refreshContextBadges();
    const pub  = getEl('pubSelect').value;
    const user = window.__APP_USER_ID__ || localStorage.getItem('app_user_id');
    if (pub && user) {
      await loadDevicesForContext(pub, user);
    }
    setCommandsEnabled(!!(pub && getEl('deviceSelect').value && user));
  });

  // Initial UI
  refreshContextBadges();
  logResult('Initializing...');

  // Config guard
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    logResult({ ok:false, error:'Please configure SUPABASE_URL and SUPABASE_ANON_KEY.' });
    return;
  }

  // Anonymous sign-in
  setBackendStatus('pending');
  const session = await ensureAnonSession();
  if (!session) { setBackendStatus('error', 'Auth failed'); return; }
  const uid = await getAuthUid();
  setBackendStatus(uid ? 'connected' : 'error');

  // Link button
  getEl('btn-link').addEventListener('click', async () => {
    const appUserId = getEl('linkUserInput').value.trim();
    if (!appUserId) return logResult({ ok:false, error:'Enter app_user_id first' });

    const res = await linkCurrentUser(appUserId);
    logResult({ step:'linkUser', ...res });

    if (res.ok) {
      window.__APP_USER_ID__ = appUserId;
      localStorage.setItem('app_user_id', appUserId);
      refreshContextBadges();

      const hasPubs = await loadPubs(); // наповнили pubSelect
      refreshContextBadges();

      if (hasPubs) {
        const pub = getEl('pubSelect').value;
        if (pub) {
          await loadDevicesForContext(pub, appUserId); // ← замість userSelect
        }
      }

      // ввімкнути кнопки якщо є контекст
      setCommandsEnabled(!!(getEl('pubSelect').value && getEl('deviceSelect').value && window.__APP_USER_ID__));

      subscribeResults();
    }
  });

  // тримай стан доступності команд у синхроні
  setCommandsEnabled(!!(getEl('pubSelect').value && getEl('deviceSelect').value && (window.__APP_USER_ID__ || localStorage.getItem('app_user_id'))));
  getEl('deviceSelect').addEventListener('change', () =>
    setCommandsEnabled(!!(getEl('pubSelect').value && getEl('deviceSelect').value && (window.__APP_USER_ID__ || localStorage.getItem('app_user_id'))))
  );
});