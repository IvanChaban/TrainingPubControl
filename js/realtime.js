import { sb } from './supabaseClient.js';
import { TABLES } from './config.js';
import { print } from './ui.js';

export function subscribeResults(){
  sb
    .channel('results-watch')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLES.RESULTS }, (payload) => {
      print({ realtime: true, result: payload.new });
    })
    .subscribe((status) => console.log('Realtime status:', status));
}