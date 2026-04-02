/**
 * Utility functions for L'Orecchio del Gerofante
 */

/**
 * Sanitizza HTML per bloccare XSS/script injection.
 * Rimuove: <script>, <iframe>, event handlers (onclick, etc.)
 * Permette: <b>, <i>, <br>, <a>, <img> (tag sicuri)
 * 
 * @param {string} html - HTML string (potenzialmente non sicuro)
 * @returns {string} HTML sanitizzato
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

/**
 * Scappa caratteri HTML per evitare injection nella UI.
 * Converte: & → &amp;, < → &lt;, > → &gt;, " → &quot;
 * 
 * @param {string} s - String da escapare
 * @returns {string} Escapato
 */
export function escHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Converte ISO string in data formattata italiana.
 * Es: "2001-01-15T10:30:00Z" → "15 gen 2001"
 * 
 * @param {string} iso - ISO datetime string
 * @returns {string} Data formattata locale (it-IT)
 */
export function formatDate(iso) {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const time = d.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${date} ${time}`;
  } catch {
    return iso;
  }
}

/**
 * Mostra messaggio di errore nel banner.
 * @param {string} msg - Messaggio errore
 */
export function showError(msg) {
  const el = document.getElementById('error-box');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

/**
 * Nasconde il banner di errore.
 */
export function hideError() {
  const el = document.getElementById('error-box');
  if (el) {
    el.style.display = 'none';
  }
}

/**
 * Mostra stato di caricamento.
 */
export function showLoading() {
  const el = document.getElementById('thread-list');
  if (el) {
    el.innerHTML = '<div class="loading">Consultando le pergamene...</div>';
  }
  const paginationEl = document.getElementById('pagination');
  if (paginationEl) {
    paginationEl.innerHTML = '';
  }
  const statsEl = document.getElementById('stats-txt');
  if (statsEl) {
    statsEl.innerHTML = '';
  }
}
