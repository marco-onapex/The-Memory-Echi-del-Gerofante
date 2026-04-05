/**
 * Main application orchestration
 * L'Orecchio del Gerofante - Forum Archive Browser
 */

import { initSupabase, getSupabase, testConnection } from './supabase.js';
import { searchThreads, getFiltersFromUI } from './search.js';
import { renderThreadDetail } from './ui.js';
import { router } from './router.js';
import { createForumTabs } from './forum-selector.js';

let supabaseClient = null;

/**
 * Inizializza l'applicazione
 */
export async function initApp(config) {
  try {
    // Crea i tab dei forum
    createForumTabs();
    
    // Inizializza Supabase
    supabaseClient = initSupabase(config);
    
    // Testa connessione
    await testConnection();
    
    // Ripristina la view dall'URL (se presente)
    // Passa supabaseClient per ricerche di forum su thread ID legacy
    await router.restoreFromUrl(supabaseClient);
    
    // Carica i dati iniziali SOLO se non stiamo visualizzando un thread
    if (router.currentView !== 'detail') {
      await search();
    }
    
    // Event listener per caricare il detail thread quando richiesto
    window.addEventListener('thread-detail-view', (e) => {
      const { threadId, forum } = e.detail;
      renderThreadDetail(threadId, supabaseClient, forum);
    });

    // Event listener per back/forward del browser
    window.addEventListener('popstate', (e) => {
      router.handlePopState(e);
    });
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

  // Sincronizza router con pagina e parametri di ricerca
  router.currentPage = page;
  router.searchParams = {
    keyword: filters.keyword || '',
    author: filters.author || '',
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || ''
  };

  // Aggiorna URL con i parametri di ricerca e il forum
  const params = new URLSearchParams();
  params.set('forum', router.currentForum);
  if (page > 1) params.set('page', page);
  if (filters.keyword) params.set('keyword', filters.keyword);
  if (filters.author) params.set('author', filters.author);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);

  const url = `?${params.toString()}`;
  window.history.replaceState(
    { view: 'list', page, searchParams: router.searchParams, forum: router.currentForum },
    'Lista thread',
    url
  );

  await searchThreads(supabaseClient, filters);
}

/**
 * Vai a una pagina specifica
 */
export function goToPage(page) {
  // Delega al router per aggiornare URL e state
  router.goToPage(page);
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

// Esponi funzioni e oggetti globali per HTML onclick
window.search = search;
window.goToPage = goToPage;
window.router = router;
window.openThread = (threadId, threadName) => {
  // Wrapper per retrocompatibilità - redirige a router
  if (typeof window.router !== 'undefined') {
    window.router.goToThreadDetail(threadId, threadName);
  }
};
