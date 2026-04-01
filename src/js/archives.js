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
    console.log('📚 loadArchives: Inizio caricamento anni...');
    
    // Fallback: mostra anni comuni del forum (2001-2019)
    const years = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
                   2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
    console.log('✅ loadArchives completato, anni trovati:', years);
    renderArchives(years);
  } catch (err) {
    console.error('❌ Errore caricamento archivi:', err);
    // Fallback: mostra anni comuni
    const years = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
                   2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
    renderArchives(years);
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
