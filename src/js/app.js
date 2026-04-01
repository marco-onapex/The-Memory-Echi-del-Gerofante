/**
 * Main application orchestration
 * L'Orecchio del Gerofante - Forum Archive Browser
 */

import { initSupabase, getSupabase, testConnection } from './supabase.js';
import { searchThreads, getFiltersFromUI } from './search.js';
import { renderThreadDetail } from './ui.js';
import { loadArchives, getCurrentYearFilter, filterByYear } from './archives.js';

let supabaseClient = null;

/**
 * Inizializza l'applicazione
 */
export async function initApp(config) {
  try {
    // Inizializza Supabase
    supabaseClient = initSupabase(config);
    
    // Testa connessione
    await testConnection();
    
    // Carica gli archivi nella sidebar
    await loadArchives(supabaseClient);
    
    // Carica i dati iniziali
    await search();
    
    // Event listener per caricare il detail thread quando richiesto
    window.addEventListener('thread-detail-view', (e) => {
      console.log('📨 Received thread-detail-view event:', e.detail);
      const { threadId, threadName } = e.detail;
      renderThreadDetail(threadId, threadName, supabaseClient);
    });
    
    console.log('✅ App initialized successfully');
  } catch (err) {
    console.error('❌ Init error:', err);
    const el = document.getElementById('error-box');
    if (el) {
      el.textContent = err.message;
      el.style.display = 'block';
    }
  }
}

/**
 * Ricerca thread con filtri attuali
 */
export async function search(page = 1) {
  if (!supabaseClient) {
    console.error('Supabase not initialized');
    return;
  }

  const filters = getFiltersFromUI();
  filters.page = page;

  // Aggiungi il filtro anno se selezionato
  const yearFilter = getCurrentYearFilter();
  if (yearFilter !== 'all') {
    filters.year = parseInt(yearFilter);
  }

  await searchThreads(supabaseClient, filters);
}

/**
 * Vai a una pagina specifica
 */
export function goToPage(page) {
  search(page);
}

/**
 * Listeners globali
 */
export function setupEventListeners() {
  // Enter key su campi filtro
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.activeElement?.id?.startsWith('f-')) {
      search();
    }
  });

  // Button listeners
  const searchBtn = document.querySelector('.btn-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => search());
  }
}

// Esponi funzioni globali per HTML onclick
window.search = search;
window.goToPage = goToPage;
window.filterByYear = filterByYear;
window.openThread = (threadId, threadName) => {
  // Wrapper per retrocompatibilità - redirige a router
  if (typeof window.router !== 'undefined') {
    window.router.goToThreadDetail(threadId, threadName);
  }
};
