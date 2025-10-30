import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { getEl, refreshContextBadges, resetForm, print } from './ui.js';
import { ensureAnonSession, getAuthUid, linkCurrentUser } from './auth.js';
import { loadPubs, loadUsersForSelectedPub } from './data.js';
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

  getEl('btn-reset').addEventListener('click', resetForm);
  getEl('pubSelect').addEventListener('change', async ()=>{ await loadUsersForSelectedPub(); });
  getEl('userSelect').addEventListener('change', refreshContextBadges);

  // Initial UI
  refreshContextBadges();
  print('Initializing...');

  // Config guard
  if(!SUPABASE_URL || !SUPABASE_ANON_KEY){
    print({ ok:false, error:'Please configure SUPABASE_URL and SUPABASE_ANON_KEY.' });
    return;
  }

  // Anonymous sign-in
  const session = await ensureAnonSession();
  if(!session){ return; }
  const uid = await getAuthUid();
  getEl('authUidLbl').textContent = uid || '—';

  // Link button
  getEl('btn-link').addEventListener('click', async () => {
    const appUserId = getEl('linkUserInput').value.trim();
    if (!appUserId) return print({ ok:false, error:'Enter app_user_id first' });
    const res = await linkCurrentUser(appUserId);
    print({ step:'linkUser', ...res });
    if (res.ok) {
      await loadPubs();          // RLS тепер пропустить
      subscribeResults();        // слухаємо відповіді
    }
  });

  // За бажанням: тут можна зчитати останній app_user_id із localStorage і авто-лінкувати
});