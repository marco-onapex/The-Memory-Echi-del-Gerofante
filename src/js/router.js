/**
 * SPA Router - Client-side routing with History API
 * L'Orecchio del Gerofante
 */

class Router {
  constructor() {
    this.currentView = 'list';
    this.routeStack = [];
  }

  /**
   * Naviga alla pagina di dettaglio di un thread
   */
  goToThreadDetail(threadId, threadName) {
    console.log('🔗 Router: navigating to thread', threadId, threadName);
    
    // Salva stato per il back
    this.routeStack.push({
      view: 'list',
      state: {}
    });

    // Cambio view
    this.switchView('detail', { threadId, threadName });
    
    // Aggiorna URL (senza reload)
    const url = `?thread=${encodeURIComponent(threadId)}&name=${encodeURIComponent(threadName)}`;
    window.history.pushState(
      { view: 'detail', threadId, threadName },
      threadName,
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
        threadId: event.state.threadId,
        threadName: event.state.threadName
      });
    } else {
      this.switchView('list');
    }
  }

  /**
   * Cambia la view (list o detail)
   */
  switchView(view, params = {}) {
    console.log('📺 Router: switching view to', view);
    
    const listView = document.getElementById('container');
    const detailView = document.getElementById('detail-page');

    if (!listView || !detailView) {
      console.error('❌ View elements not found', { listView, detailView });
      return;
    }

    if (view === 'detail') {
      listView.style.display = 'none';
      detailView.style.display = 'block';
      this.currentView = 'detail';

      // Trigger evento custom per caricare i dati del thread
      const event = new CustomEvent('thread-detail-view', {
        detail: params
      });
      console.log('🎯 Dispatching thread-detail-view event with params:', params);
      window.dispatchEvent(event);
    } else {
      listView.style.display = 'block';
      detailView.style.display = 'none';
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
    const threadName = params.get('name');

    if (threadId && threadName) {
      this.switchView('detail', { threadId, threadName });
      
      // Trigger fetch diretto
      const event = new CustomEvent('thread-detail-view', {
        detail: { threadId, threadName }
      });
      window.dispatchEvent(event);
    }
  }
}

export const router = new Router();
