/**
 * UI rendering functions for thread list and detail view
 */

import { escHtml, sanitizeHtml, formatDate } from './utils.js';
import { router } from './router.js';

// Global state
export let currentPage = 1;
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

  el.innerHTML = threads.map(t => {
    const date = t.last_post_at ? formatDate(t.last_post_at) : '—';
    const firstDate = t.first_post_at ? formatDate(t.first_post_at) : '—';
    return `
      <div class="thread-card" onclick="window.router.goToThreadDetail(${t.id}, ${JSON.stringify(t.name).replace(/"/g, '&quot;')})">
        <div class="thread-title">${escHtml(t.name)}</div>
        <div class="thread-meta">
          <span class="author">✍ ${escHtml(t.author || 'Anonimo')}</span>
          <span class="badge">${t.post_count} ${t.post_count === 1 ? 'messaggio' : 'messaggi'}</span>
          <span class="date">📅 ${firstDate} → ${date}</span>
        </div>
      </div>`;
  }).join('');
}

/**
 * Renderizza la pagina di dettaglio di un thread.
 * @param {number} threadId - ID del thread
 * @param {string} threadName - Nome thread
 * @param {Object} supabase - Client Supabase
 */
export async function renderThreadDetail(threadId, threadName, supabase) {
  if (!supabase) return;

  const titleEl = document.getElementById('detail-title-page');
  const metaEl = document.getElementById('detail-meta-page');
  const postsEl = document.getElementById('detail-posts-page');

  if (!titleEl || !metaEl || !postsEl) return;

  titleEl.textContent = threadName;
  metaEl.innerHTML = '<div class="loading">Caricamento...</div>';
  postsEl.innerHTML = '';

  try {
    // Carica i dettagli del thread
    const { data: threadData, error: threadError } = await supabase
      .from('threads_view')
      .select('*')
      .eq('id', threadId)
      .single();

    if (threadError) throw threadError;

    // Carica tutti i messaggi del thread
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('thread_id', threadId)
      .order('posted_at', { ascending: true });

    if (postsError) throw postsError;

    const posts = postsData || [];
    
    // Costruisci metadata
    let metaHtml = '<div class="thread-detail-meta">';
    if (threadData) {
      metaHtml += `<div class="meta-item">
        <span class="meta-label">Autore:</span>
        <span class="meta-value">${escHtml(threadData.author || 'Anonimo')}</span>
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
            <span class="post-author">${escHtml(p.author)}</span>
            <span class="post-date">${p.posted_at ? formatDate(p.posted_at) : '—'}</span>
            <span class="post-number">#${idx + 1}</span>
          </div>
        </div>
        <div class="post-content">${sanitizeHtml(p.content)}</div>
      </div>`).join('');
  } catch (err) {
    console.error('Errore caricamento thread:', err);
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
  const el = document.getElementById('pagination');
  if (!el) return;

  if (totalPages <= 1) {
    el.innerHTML = '';
    return;
  }

  let html = '';
  html += `<button class="page-btn" onclick="window.goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹ Prec</button>`;

  const delta = 2;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    }
  }
  let prev = null;
  for (const p of pages) {
    if (prev && p - prev > 1) html += `<span class="page-info">…</span>`;
    html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="window.goToPage(${p})">${p}</button>`;
    prev = p;
  }

  html += `<button class="page-btn" onclick="window.goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Succ ›</button>`;
  el.innerHTML = html;
}

/**
 * Renderizza le statistiche.
 */
export function renderStats() {
  const el = document.getElementById('stats-txt');
  if (!el) return;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  el.innerHTML = `Trovati <strong>${totalCount.toLocaleString('it')}</strong> thread · Pagina <strong>${currentPage}</strong> di <strong>${totalPages}</strong>`;
}

/**
 * Aggiorna pagina corrente
 */
export function setCurrentPage(page) {
  currentPage = page;
}

/**
 * Aggiorna total count
 */
export function setTotalCount(count) {
  totalCount = count;
}
