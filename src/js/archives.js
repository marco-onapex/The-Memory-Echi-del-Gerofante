/**
 * Archives management - Year-based filtering
 * L'Orecchio del Gerofante
 */

import { escHtml } from './utils.js';

let currentYearFilter = 'all';

/**
 * Carica gli anni disponibili dai thread
 */
export async function loadArchives(supabase) {
  try {
    const { data, error } = await supabase
      .from('threads_view')
      .select('first_post_at')
      .not('first_post_at', 'is', null)
      .order('first_post_at', { ascending: true });

    if (error) throw error;

    // Estrai anni unici
    const years = new Set();
    data.forEach(thread => {
      const year = new Date(thread.first_post_at).getFullYear();
      years.add(year);
    });

    // Sort anni in ordine decrescente
    const sortedYears = Array.from(years).sort((a, b) => b - a);

    // Renderizza gli archivi
    renderArchives(sortedYears);
  } catch (err) {
    console.error('❌ Errore caricamento archivi:', err);
  }
}

/**
 * Renderizza la lista di anni nella sidebar
 */
function renderArchives(years) {
  const el = document.getElementById('archives-list');
  if (!el) return;

  let html = '<li><a href="#" onclick="window.filterByYear(\'all\');" class="sidebar-link active">Tutti i periodi</a></li>';

  years.forEach(year => {
    html += `
      <li>
        <a href="#" onclick="window.filterByYear(${year});" class="sidebar-link" data-year="${year}">
          📅 ${year}
        </a>
      </li>`;
  });

  el.innerHTML = html;
}

/**
 * Filtra i thread per anno
 */
export function filterByYear(year) {
  currentYearFilter = year;

  // Aggiorna UI (active state)
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });

  if (year === 'all') {
    document.querySelector('[onclick*="filterByYear(\'all\')"]')?.classList.add('active');
  } else {
    document.querySelector(`[data-year="${year}"]`)?.classList.add('active');
  }

  // Lancia la ricerca
  window.search();
}

/**
 * Ritorna il filtro anno attuale
 */
export function getCurrentYearFilter() {
  return currentYearFilter;
}
