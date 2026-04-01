/**
 * Configuration loader
 * Sviluppo: Carica da .env.local via build script
 * Production: Carica da src/config.js generato da GitHub Actions
 */

let CONFIG = null;

/**
 * Carica la configurazione
 */
export async function loadConfig() {
  try {
    // Tenta di caricare config.js
    const response = await fetch('./src/config.js');
    if (!response.ok) {
      throw new Error('Config file not found. Configura .env e esegui il build script.');
    }
    
    const configModule = await import('./config.js?t=' + Date.now());
    CONFIG = configModule.default;

    if (!CONFIG.supabase?.url || !CONFIG.supabase?.anonKey) {
      throw new Error('Supabase config missing in config.js');
    }

    return CONFIG;
  } catch (err) {
    console.error('Config load error:', err);
    throw err;
  }
}

/**
 * Ottiene la config
 */
export function getConfig() {
  if (!CONFIG) {
    throw new Error('Config not loaded. Chiama loadConfig() prima.');
  }
  return CONFIG;
}
