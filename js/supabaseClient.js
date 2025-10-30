import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Use global supabase from CDN (loaded in index.html)
if (!window.supabase) {
  throw new Error('Supabase JS is not loaded. Check <script> in index.html');
}

export const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);