// realtime.js
import { sb } from './supabaseClient.js';
import { TABLES } from './config.js';
import { print } from './ui.js';

export function subscribeResults() {
  const channel = sb
    .channel('results-listener')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: TABLES.RESULTS },
      (payload) => {
        const row = payload.new;           // { id, command_id, status, data, error, created_at }
        const cmd = window.__LAST_CMD__;   // поклав у actions.js після enqueue

        // 1) має бути наша команда
        if (!cmd || row.command_id !== cmd.id) return;

        // 2) результат не старіший за момент enqueue
        if (new Date(row.created_at) < new Date(cmd.created_at)) return;

        // Ок — логуй
        print({ realtime: true, result: row });
      }
    )
    .subscribe((status) => {
      // за бажанням: print({ realtimeStatus: status });
    });

  return channel;
}