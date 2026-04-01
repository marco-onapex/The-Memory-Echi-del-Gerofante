/**
 * SPA Router - Client-side routing with History API
 * L'Orecchio del Gerofante
 */

class Router {
  constructor() {
    this.currentView = 'list';
    this.routeStack = [];
    this.currentPage = 1;
    this.searchParams = {};
  }

  /**
   * Naviga a una pagina specifica (paginazione)
   */
  goToPage(page) {
    if (page < 1) return; // Prevedi page < 1
    
    this.currentPage = page;
    console.log('📄 Router: navigating to page', page);
    
    // Costruisci query string con pagina e filtri attuali
    const params = new URLSearchParams();
    params.set('page', page);
    
    // Aggiungi parametri di ricerca se presenti
    if (this.searchParams.keyword) params.set('keyword', this.searchParams.keyword);
    if (this.searchParams.author) params.set('author', this.searchParams.author);
    if (this.searchParams.dateFrom) params.set('dateFrom', this.searchParams.dateFrom);
    if (this.searchParams.dateTo) params.set('dateTo', this.searchParams.dateTo);

    const url = `?${params.toString()}`;
    
    // Aggiorna URL
    window.history.pushState(
      { view: 'list', page, searchParams: this.searchParams },
      `Lista thread - Pagina ${page}`,
      url
    );

    // Trigger ricerca con nuova pagina
    window.search(page);
  }

  /**
   * Naviga a una pagina di dettaglio di un thread (solo ID)
   */
  goToThreadDetail(threadId) {
    console.log('🔗 Router: navigating to thread', threadId);
    
    // Salva stato per il back
    this.routeStack.push({
      view: 'list',
      state: {}
    });

    // Cambio view
    this.switchView('detail', { threadId });
    
    // Aggiorna URL (senza reload)
    const url = `?thread=${encodeURIComponent(threadId)}`;
    window.history.pushState(
      { view: 'detail', threadId },
      'Thread Detail',
      url
    );
  }

  /**
   * Torna alla lista
   */
  back() {
    // Pulisci lo stack e torna alla lista
    this.routeStack = [];
    this.switchView('list');
    
    // Aggiorna URL
    window.history.pushState(
      { view: 'list' },
      'Lista thread',
      '?'
    );
  }

  /**
   * Gestisce il popstate (back button del browser)
   */
  handlePopState(event) {
    if (event.state?.view === 'detail') {
      this.switchView('detail', {
        threadId: event.state.threadId
      });
    } else if (event.state?.view === 'list') {
      // Ripristina pagina dalla history
      this.currentPage = event.state.page || 1;
      this.searchParams = event.state.searchParams || {};
      this.switchView('list');
      // Trigger ricerca con pagina ripristinata
      window.search(this.currentPage);
    } else {
      this.switchView('list');
    }
  }

  /**
   * Cambia la view (list o detail)
   */
  switchView(view, params = {}) {
    console.log('📺 Router: switching view to', view);
    
    const listView = document.getElementById('list-view');
    const detailView = document.getElementById('detail-view');

    if (!listView || !detailView) {
      console.error('View elements not found');
      return;
    }

    if (view === 'detail') {
      listView.classList.remove('visible');
      listView.classList.add('hidden');
      detailView.classList.remove('hidden');
      detailView.classList.add('visible');
      this.currentView = 'detail';

      // Trigger evento custom per caricare i dati del thread
      const event = new CustomEvent('thread-detail-view', {
        detail: params
      });
      console.log('🎯 Dispatching thread-detail-view event with params:', params);
      window.dispatchEvent(event);
    } else {
      listView.classList.remove('hidden');
      listView.classList.add('visible');
      detailView.classList.remove('visible');
      detailView.classList.add('hidden');
      this.currentView = 'list';
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  /**
   * Leggi lo stato URL attuale e ripristina la view
   */
  restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const threadId = params.get('thread');
    const page = parseInt(params.get('page')) || 1;

    // Salva parametri di ricerca dal URL
    this.currentPage = page;
    this.searchParams = {
      keyword: params.get('keyword') || '',
      author: params.get('author') || '',
      dateFrom: params.get('dateFrom') || '',
      dateTo: params.get('dateTo') || ''
    };

    if (threadId) {
      this.switchView('detail', { threadId });
      
      // Trigger fetch diretto
      const event = new CustomEvent('thread-detail-view', {
        detail: { threadId }
      });
      window.dispatchEvent(event);
    } else if (page > 1 || Object.values(this.searchParams).some(v => v)) {
      // Se c'è una pagina > 1 o parametri di ricerca, fai ricerca
      this.switchView('list');
      window.search(this.currentPage);
    }
  }
}

export const router = new Router();
