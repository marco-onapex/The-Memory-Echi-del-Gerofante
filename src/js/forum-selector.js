/**
 * Forum Selection Module
 * Gestisce la selezione tra i due forum come subforum tabs
 */

export const FORUMS = {
  GEROFANTE: 'Gerofante',
  CRONACHE: 'Cronache'
};

export const FORUM_INFO = {
  [FORUMS.GEROFANTE]: {
    name: "L'Orecchio del Gerofante",
    description: "Archivio perduto del forum GDR di The Miracle Shard (2001-2019)",
    color: '#D4AF37',
    darkColor: '#8B7500',
    icon: '𝔍'
  },
  [FORUMS.CRONACHE]: {
    name: 'Cronache d\'Ardania',
    description: 'Cronache e annali dal mondo di Ardania',
    color: '#C0504D',
    darkColor: '#7F0000',
    icon: '✦'
  }
};

/**
 * Ottieni il forum selezionato da localStorage
 * Default: Gerofante
 */
export function getSelectedForum() {
  const stored = localStorage.getItem('selected-forum');
  return stored || FORUMS.GEROFANTE;
}

/**
 * Salva il forum selezionato in localStorage
 */
export function setSelectedForum(forum) {
  if (!Object.values(FORUMS).includes(forum)) {
    console.error('Invalid forum:', forum);
    return;
  }
  localStorage.setItem('selected-forum', forum);
  updateTabsUI();
}

/**
 * Crea i tab dei subforum
 */
export function createForumTabs() {
  const container = document.getElementById('forum-tabs');
  if (!container) {
    console.warn('forum-tabs container not found');
    return;
  }

  container.innerHTML = '';

  const tabsHtml = Object.entries(FORUMS).map(([key, forumId]) => {
    const info = FORUM_INFO[forumId];
    const isActive = getSelectedForum() === forumId ? 'active' : '';
    return `
      <button class="subforum-tab ${isActive}" 
              data-forum="${forumId}"
              style="--forum-color: ${info.color}"
              title="${info.description}">
        ${info.icon} ${info.name}
      </button>
    `;
  }).join('');

  container.innerHTML = tabsHtml;

  // Event listeners
  document.querySelectorAll('.subforum-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const forum = e.currentTarget.getAttribute('data-forum');
      selectForum(forum);
    });
  });
}

/**
 * Aggiorna lo style dei tab
 */
export function updateTabsUI() {
  const selected = getSelectedForum();
  document.querySelectorAll('.subforum-tab').forEach(tab => {
    const forum = tab.getAttribute('data-forum');
    if (forum === selected) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

/**
 * Seleziona un forum e aggiorna il router
 */
function selectForum(forum) {
  setSelectedForum(forum);
  updateTabsUI();
  
  // Ripulisci i risultati attuali
  const resultsList = document.getElementById('thread-list');
  if (resultsList) {
    resultsList.innerHTML = '<div class="loading">Caricamento...</div>';
  }

  // Sincronizza con il router e aggiorna URL
  if (window.router) {
    window.router.setForum(forum);
    // Torna alla prima pagina con il nuovo forum
    window.router.goToPage(1);
  } else {
    // Fallback: emetti evento se router non è disponibile
    window.dispatchEvent(new CustomEvent('forum-changed', { detail: { forum } }));
  }
}

