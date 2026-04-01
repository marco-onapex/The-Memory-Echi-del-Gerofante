/**
 * Supabase client initialization and configuration
 */

let supabaseClient = null;

/**
 * Inizializza il client Supabase con credenziali da config
 * @param {object} config - { url, anonKey }
 */
export function initSupabase(config) {
  if (!config || !config.url || !config.anonKey) {
    throw new Error('Supabase config missing: url o anonKey');
  }
  
  supabaseClient = window.supabase.createClient(config.url, config.anonKey);
  return supabaseClient;
}

/**
 * Ottiene l'istanza Supabase client
 */
export function getSupabase() {
  if (!supabaseClient) {
    throw new Error('Supabase non è inizializzato. Chiama initSupabase() prima.');
  }
  return supabaseClient;
}

/**
 * Testa la connessione a Supabase
 */
export async function testConnection() {
  try {
    const { data, error } = await getSupabase()
      .from('threads_view')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    return true;
  } catch (err) {
    throw new Error('Errore connessione Supabase: ' + (err.message || err));
  }
}
