/**
 * Search logic for forum threads
 */

import { showError, hideError, showLoading } from './utils.js';
import { renderThreads, renderPagination, renderStats, setTotalCount, setCurrentPage, PAGE_SIZE, currentPage } from './ui.js';

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
  setCurrentPage(page);

  showLoading();
  hideError();

  try {
    const keyword = filters.keyword?.trim() || '';
    const author = filters.author?.trim() || '';
    const dateFrom = filters.dateFrom || '';
    const dateTo = filters.dateTo || '';

    let query = supabase.from('threads_view').select('*', { count: 'exact' });

    // Full-text search
    if (keyword) {
      query = query.textSearch('search_vector', keyword, { config: 'italian' });
    }

    // Author filter (case-insensitive)
    if (author) {
      query = query.ilike('author', `%${author}%`);
    }

    // Date filters
    if (dateFrom) {
      query = query.gte('first_post_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('last_post_at', dateTo + 'T23:59:59');
    }

    // Year filter (archive)
    if (filters.year) {
      const yearStart = `${filters.year}-01-01T00:00:00`;
      const yearEnd = `${filters.year}-12-31T23:59:59`;
      query = query.gte('first_post_at', yearStart).lte('first_post_at', yearEnd);
    }

    // Ordering and pagination
    query = query
      .order('last_post_at', { ascending: false, nullsFirst: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    setTotalCount(count ?? 0);
    renderThreads(data || []);
    renderPagination(Math.ceil((count || 0) / PAGE_SIZE), () => {});
    renderStats();
  } catch (err) {
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
