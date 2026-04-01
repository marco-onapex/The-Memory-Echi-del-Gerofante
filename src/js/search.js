/**
 * Search logic for forum threads
 */

import { showError, hideError, showLoading } from './utils.js';
import { renderThreads, renderPagination, renderStats, setTotalCount, PAGE_SIZE } from './ui.js';
import { router } from './router.js';

/**
 * Ricerca thread con filtri multipli su Supabase.
 * 
 * @param {object} supabase - Client Supabase
 * @param {object} filters - { keyword, author, dateFrom, dateTo, page }
 */
export async function searchThreads(supabase, filters = {}) {
  if (!supabase) {
    showError('Supabase non è connesso.');
    return;
  }

  const page = filters.page || 1;

  showLoading();
  hideError();

  try {
    const keyword = filters.keyword?.trim() || '';
    const author = filters.author?.trim() || '';
    const dateFrom = filters.dateFrom || '';
    const dateTo = filters.dateTo || '';

    // Senza count per evitare problemi con la libreria Supabase
    let query = supabase.from('threads_view').select('*', { count: 'exact' });

    // Keyword search (case-insensitive) on thread name AND post content
    if (keyword) {
      // Ricerca parallela nei post
      const { data: matchingPosts, error: postsError } = await supabase
        .from('posts')
        .select('thread_id')
        .ilike('content', `%${keyword}%`);
      
      if (postsError) {
        console.error('❌ Errore ricerca nei post:', postsError);
      }
      
      // Thread ID trovati nei post
      const threadIdsFromPosts = matchingPosts?.map(p => p.thread_id) || [];
      const uniqueThreadIds = [...new Set(threadIdsFromPosts)];
      
      if (uniqueThreadIds.length > 0) {
        // Combina ricerca nel nome con ricerca nei post usando OR
        query = query.or(`name.ilike.%${keyword}%,id.in.(${uniqueThreadIds.join(',')})`);
      } else {
        // Se nessun risultato nei post, ricerca solo nel nome
        query = query.ilike('name', `%${keyword}%`);
      }
    }

    // Author filter (case-insensitive)
    if (author) {
      query = query.ilike('thread_author', `%${author}%`);
    }

    // Date filters
    if (dateFrom) {
      query = query.gte('first_post_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('last_post_at', dateTo + 'T23:59:59');
    }

    // Year filter (archive) - SOLO se esplicitamente richiesto dall'utente
    // Non applicare al caricamento iniziale
    if (filters.year && keyword === '' && author === '' && dateFrom === '' && dateTo === '') {
      const yearStart = `${filters.year}-01-01T00:00:00`;
      const yearEnd = `${filters.year}-12-31T23:59:59`;
      query = query.gte('first_post_at', yearStart).lte('first_post_at', yearEnd);
    }

    // Ordering and pagination
    // ✅ L'ordinamento è già gestito dalla MATERIALIZED VIEW (ORDER BY last_post_at DESC)
    // Usa .range() per paginazione SERVER-SIDE (carica solo la pagina richiesta)
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE - 1;
    
    query = query.range(startIndex, endIndex);
    const { data, count, error } = await query;

    if (error) {
      console.error('❌ Errore query:', error);
      throw error;
    }

    // I dati sono già paginati dal server
    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    
    setTotalCount(totalCount);
    renderThreads(data || []);
    renderPagination(totalPages, () => {});
    renderStats();
  } catch (err) {
    console.error('Errore query:', err);
    showError('Errore query: ' + (err.message || err));
    renderThreads([]);
  }
}

/**
 * Ottiene i filtri attuali dall'interfaccia
 */
export function getFiltersFromUI() {
  return {
    keyword: document.getElementById('f-keyword')?.value.trim() || '',
    author: document.getElementById('f-author')?.value.trim() || '',
    dateFrom: document.getElementById('f-date-from')?.value || '',
    dateTo: document.getElementById('f-date-to')?.value || ''
  };
}
