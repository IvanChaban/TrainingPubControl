import { sb } from './supabaseClient.js';
import { logResult } from './ui.js';

export async function ensureAnonSession() {
  const { data: sess } = await sb.auth.getSession();
  if (!sess?.session) {
    const { data, error } = await sb.auth.signInAnonymously();
    if (error) { logResult({ ok:false, step:'signInAnonymously', error: error.message }); return null; }
    return data.session;
  }
  return sess.session;
}

export async function getAuthUid() {
  const { data } = await sb.auth.getUser();
  return data?.user?.id || null;
}

export async function linkCurrentUser(appUserId) {
  const uid = await getAuthUid();
  if (!uid) return { ok:false, error:'No auth.uid. Sign-in failed?' };
  const payload = { auth_uid: uid, app_user_id: appUserId };
  const { error } = await sb
    .from('user_links')
    .upsert(payload, { onConflict: 'auth_uid,app_user_id', ignoreDuplicates: true });
  if (error) return { ok:false, error: error.message };
  return { ok:true, auth_uid: uid, app_user_id: appUserId };
}