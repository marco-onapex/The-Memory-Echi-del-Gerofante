/**
 * UI rendering functions for thread list and detail view
 */

import { escHtml, sanitizeHtml, formatDate } from './utils.js';
import { router } from './router.js';
import { getSelectedForum, FORUMS, FORUM_INFO } from './forum-selector.js';

// Global state
export const PAGE_SIZE = 25;
export let totalCount = 0;

/**
 * Renderizza la lista di thread dopo ricerca.
 * @param {Array} threads - Array di thread da threads_view
 */
export function renderThreads(threads) {
  const el = document.getElementById('thread-list');
  if (!el) return;

  if (!threads.length) {
    el.innerHTML = '<div class="empty">Nessun thread trovato. Prova con altri filtri.</div>';
    return;
  }

  el.innerHTML = `
    <table class="threads-table">
      <thead>
        <tr>
          <th>Discussione</th>
          <th style="width: 80px; text-align: center;">Risposte</th>
          <th>Ultimo Messaggio</th>
        </tr>
      </thead>
      <tbody>
        ${threads.map(t => {
          const firstDate = t.created_at ? formatDate(t.created_at) : formatDate(t.first_post_at);
          const lastDate = t.last_post_at ? formatDate(t.last_post_at) : '—';
          const lastAuthor = t.last_post_author || 'Anonimo';
          const lastPreview = t.last_post_preview ? `"${escHtml(t.last_post_preview)}"` : 'No preview';
          
          return `
            <tr onclick="window.router.goToThreadDetail(${t.id})" style="cursor: pointer;">
              <td>
                <div class="col-title">
                  <div class="title-text"><strong>${escHtml(t.name)}</strong></div>
                  <div class="title-meta">
                    <span class="by-label">by</span>
                    <span class="author-highlight">${escHtml(t.thread_author || 'Anonimo')}</span>
                    <span class="meta-sep">•</span>
                    <span class="meta-date">${firstDate}</span>
                  </div>
                </div>
              </td>
              <td class="col-count" style="text-align: center;">
                ${t.post_count || 0}
              </td>
              <td class="col-last-post">
                <div class="last-post-author">
                  <span class="by-label">by</span>
                  <span class="author-highlight">${escHtml(lastAuthor)}</span>
                </div>
                <div class="last-post-date">${lastDate}</div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Renderizza la pagina di dettaglio di un thread (carica il nome dal DB).
 * @param {number} threadId - ID del thread
 * @param {Object} supabase - Client Supabase
 * @param {string} forum - Forum corrente (opzionale, di default da getSelectedForum())
 */
export async function renderThreadDetail(threadId, supabase, forum) {
  if (!supabase) {
    console.error('Supabase not initialized');
    return;
  }

  const titleEl = document.getElementById('detail-title');
  const metaEl = document.getElementById('detail-meta');
  const postsEl = document.getElementById('detail-posts');

  if (!titleEl || !metaEl || !postsEl) {
    console.error('❌ Detail elements not found', {
      titleEl: !!titleEl,
      metaEl: !!metaEl,
      postsEl: !!postsEl
    });
    return;
  }

  titleEl.textContent = 'Caricamento...';
  metaEl.innerHTML = '<div class="loading">Caricamento...</div>';
  postsEl.innerHTML = '';

  // Breadcrumb sarà aggiornato après caricamento dei dati

  try {
    console.log('🔄 Caricamento dettagli thread dal DB...');
    
    // Carica i dettagli del thread
    const { data: threadData, error: threadError } = await supabase
      .from('threads_view')
      .select('*')
      .eq('id', threadId)
      .single();

    console.log('📦 Thread data loaded');
    
    if (threadError) throw threadError;

    // Carica tutti i messaggi del thread
    console.log('🔄 Caricamento messaggi...');
    
    // Determina quale tabella usare in base al forum (parametro o da localStorage)
    const selectedForum = forum || getSelectedForum();
    const postsTable = selectedForum === FORUMS.CRONACHE ? 'cronache_posts' : 'posts';
    
    console.log('🎯 Loading posts from forum:', selectedForum, 'table:', postsTable);
    
    const { data: postsData, error: postsError } = await supabase
      .from(postsTable)
      .select('*')
      .eq('thread_id', threadId)
      .order('posted_at', { ascending: true });

    console.log('📦 Posts data:', { data: postsData, error: postsError });
    
    if (postsError) throw postsError;

    const posts = postsData || [];
    console.log('✅ Messaggi caricati:', posts.length);
    
    // Aggiorna il titolo dal DB
    if (threadData?.name) {
      titleEl.textContent = threadData.name;
      const breadcrumbEl = document.getElementById('breadcrumb-current');
      if (breadcrumbEl) {
        breadcrumbEl.textContent = threadData.name;
      }
    }

    // Costruisci metadata
    let metaHtml = '<div class="thread-detail-meta">';
    if (threadData) {
      metaHtml += `<div class="meta-item">
        <span class="meta-label">Autore:</span>
        <span class="meta-value">${escHtml(threadData.thread_author || 'Anonimo')}</span>
      </div>`;
      
      if (threadData.first_post_at) {
        metaHtml += `<div class="meta-item">
          <span class="meta-label">Creato:</span>
          <span class="meta-value">${formatDate(threadData.first_post_at)}</span>
        </div>`;
      }
      
      if (threadData.last_post_at) {
        metaHtml += `<div class="meta-item">
          <span class="meta-label">Ultimo messaggio:</span>
          <span class="meta-value">${formatDate(threadData.last_post_at)}</span>
        </div>`;
      }
      
      metaHtml += `<div class="meta-item">
        <span class="meta-label">Messaggi:</span>
        <span class="meta-value">${posts.length}</span>
      </div>`;
    }
    metaHtml += '</div>';
    metaEl.innerHTML = metaHtml;

    // Renderizza i post
    if (!posts.length) {
      postsEl.innerHTML = '<div class="empty">Nessun messaggio in questo thread.</div>';
      return;
    }

    postsEl.innerHTML = posts.map((p, idx) => `
      <div class="post-card">
        <div class="post-header">
          <div class="post-info">
            <span class="post-number">#${idx + 1}</span>
            <span class="post-author">${escHtml(p.author)}</span>
            <span class="post-date">${p.posted_at ? formatDate(p.posted_at) : '—'}</span>
          </div>
        </div>
        <div class="post-content">${sanitizeHtml(p.content)}</div>
      </div>`).join('');
    
    console.log('✅ Thread detail renderizzato correttamente');
  } catch (err) {
    console.error('❌ Errore caricamento thread:', err);
    console.error('Stack:', err.stack);
    postsEl.innerHTML = `<div class="error">❌ Errore: ${escHtml(err.message)}</div>`;
    metaEl.innerHTML = '';
  }
}

/**
 * Renderizza la paginazione.
 * @param {number} totalPages - Numero totale di pagine
 * @param {Function} searchFn - Funzione ricerca da chiamare
 */
export function renderPagination(totalPages, searchFn) {
  const elBottom = document.getElementById('pagination');
  const elTop = document.getElementById('pagination-top');
  
  if (!elBottom && !elTop) return;

  if (totalPages <= 1) {
    if (elBottom) elBottom.innerHTML = '';
    if (elTop) elTop.innerHTML = '';
    return;
  }

  let html = '';
  html += `<button class="page-btn" onclick="window.goToPage(${router.currentPage - 1})" ${router.currentPage === 1 ? 'disabled' : ''}>‹ Prec</button>`;

  const delta = 2;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= router.currentPage - delta && i <= router.currentPage + delta)) {
      pages.push(i);
    }
  }
  let prev = null;
  for (const p of pages) {
    if (prev && p - prev > 1) html += `<span class="page-info">…</span>`;
    html += `<button class="page-btn ${p === router.currentPage ? 'active' : ''}" onclick="window.goToPage(${p})">${p}</button>`;
    prev = p;
  }

  html += `<button class="page-btn" onclick="window.goToPage(${router.currentPage + 1})" ${router.currentPage === totalPages ? 'disabled' : ''}>Succ ›</button>`;
  
  // Genera pagination in entrambi i posti
  if (elBottom) elBottom.innerHTML = html;
  if (elTop) elTop.innerHTML = html;
}

/**
 * Renderizza le statistiche.
 */
export function renderStats() {
  const el = document.getElementById('stats-txt');
  if (!el) return;

  const selectedForum = getSelectedForum();
  const forumName = FORUM_INFO[selectedForum]?.name || 'Forum';
  
  el.innerHTML = `Trovati <strong>${totalCount.toLocaleString('it')}</strong> thread in ${forumName}`;
}

/**
 * Aggiorna total count
 */
export function setTotalCount(count) {
  totalCount = count;
}
