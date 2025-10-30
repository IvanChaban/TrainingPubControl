// ---- Replace with your actual project values
export const SUPABASE_URL = 'https://slgdsksjkqfbckyjdrcj.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZ2Rza3Nqa3FmYmNreWpkcmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyOTc4MDUsImV4cCI6MjA3Njg3MzgwNX0.jL8kINGW_1V4xKVzZHBVBQ5LHrivOcMBMMosO9U8kFU';

export const TABLES = {
  COMMANDS: 'commands',
  RESULTS: 'results',
  USER_LINKS: 'user_links'
};

// Stable deviceId per browser
export const deviceId = (() => {
  const k='rc_device_id'; let v=localStorage.getItem(k);
  if(!v){ v = (crypto?.randomUUID?.() || String(Date.now())); localStorage.setItem(k, v); }
  return v;
})();