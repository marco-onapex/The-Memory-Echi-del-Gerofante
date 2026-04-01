# Miglioramenti Futuri (Roadmap)

Idee per espandere e migliorare il progetto nel tempo.

## 🎯 Feature Priority

### 🟢 P0 - Essenziali per il lancio
- [x] Ricerca di base (keyword, author, date)
- [x] Visualizzazione thread
- [x] Visualizzazione messaggi
- [x] Paginazione
- [x] Documentazione setup
- [ ] Test su diversi browser (Chrome, Firefox, Safari, Edge)
- [ ] Verifica RLS Supabase correctness

### 🟡 P1 - Raccomandati (primo mese)
- [ ] **Tema scuro/chiaro toggle** - Aggiungi pulsante per cambiare tema
- [ ] **Export feature** - Scarica thread come PDF o JSON
- [ ] **Breadcrumb navigation** - Miglior navigation nei thread
- [ ] **Author profile** - Clicca autore per vedere storia contributi
- [ ] **Search suggestions** - Autocomplete durante la ricerca
- [ ] **Comment count chart** - Visualizza attività nel tempo

### 🔵 P2 - Nice-to-have (fase 2)
- [ ] **Tagging system** - Tag per categorizzare thread
- [ ] **Statistics page** - Dashboard con statistiche forum
- [ ] **Timeline view** - Visualizza thread per periodo
- [ ] **Mobile app** - PWA o app nativa
- [ ] **Syntax highlighting** - Per codice nei post
- [ ] **Image gallery** - Carica screenshot/immagini
- [ ] **Thread voting** - Vote migliori thread (read-only badge)

### 🟣 P3 - Futuro (fase 3+)
- [ ] **Full-text search avanzafa** - Filtri booleani (AND, OR, NOT)
- [ ] **API pubblica** - Endpoint per sviluppatori esterni
- [ ] **Webhook integration** - Notifiche quando nuovi dati Supabase
- [ ] **Social sharing** - Share thread su Twitter, LinkedIn
- [ ] **Multi-language** - i18n (Italian, English, etc.)
- [ ] **A11y improvements** - WCAG 2.1 AA compliance
- [ ] **Dark theme** - Tema scuro default + toggle

---

## 💡 Idee di miglioramento per categoria

### UX/Design

- [ ] **Tema scuro/chiaro toggle** - Aggiungi pulsante toggleabile per cambiare tema senza reload pagina
- [ ] **Breadcrumb navigation** - Mostra: Home → Thread → Post (migliore navigazione)
- [ ] **Copy thread link** - Condividi link a un thread specifico
- [ ] **Loading skeleton** - Placeholder styling mentre carica dati da Supabase

### Performance

- [ ] **Lazy loading** - Carica post via infinite scroll invece di pagine
- [ ] **Service Worker** - Cache static assets per offline support
- [ ] **Image optimization** - Compress e resize immagini nei post
- [ ] **Database indexing** - Verifica che gli indici su Supabase siano ottimali

### Search

- [ ] **Autocomplete** - Suggerimenti mentre digiti
- [ ] **Filter chips** - Mostra filtri applicati come tag removibili
- [ ] **Search history** - Salva ultime ricerche (localStorage)
- [ ] **Advanced search** - Filtri booleani (AND, OR, NOT)

### Content

- [ ] **Thread pinned** - Mostra thread importanti in alto
- [ ] **Author profile** - Clicca autore → pagina con storia contributi
- [ ] **Thread statistics** - Mostra: visite, risposte per data, hot topics
- [ ] **Export feature** - Download thread come PDF / JSON / markdown

### Accessibility

- [ ] **Keyboard navigation** - Arrow keys, Tab, Enter per navigare
- [ ] **ARIA labels** - Migliore screen reader support
- [ ] **WCAG 2.1 AA** - Verifica contrast ratios, alt text, etc.
- [ ] **Mobile UX** - Testato su mobile devices

### Community

- [ ] **Comments/reactions** - Sistema di commenti sui thread (read-only badge)
- [ ] **RSS feed** - Subscribe ai nuovi thread
- [ ] **Discord webhook** - Notify Discord quando aggiungi dati
- [ ] **Contribution guidelines** - `CONTRIBUTING.md` per contrib esterni
  const isDark = document.body.classList.contains('dark-theme');
  document.body.classList.toggle('dark-theme', !isDark);
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
};

// Ricorda preferenza tema
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-theme');
}
```

```css
body.dark-theme {
  background-color: #0a0601;
  color: #e8d5b0;
  /* ... */
}
```

### Performance

```javascript
// Lazy load thread details (non caricare subito)
const observerOptions = { rootMargin: '50px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadThreadDetails(entry.target.dataset.id);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.thread-card').forEach(el => {
  observer.observe(el);
});
```

### Data Export

```javascript
// Scarica thread come JSON
const exportThreadJson = async (threadId) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('thread_id', threadId);

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thread-${threadId}.json`;
  a.click();
};
```

### Advanced Search

```html
<!-- Aggiungi opzioni di ricerca avanzate -->
<div class="filter-group">
  <label>🔍 Tipo ricerca</label>
  <select id="f-search-type">
    <option value="all">Titolo + Messaggi</option>
    <option value="title">Solo titolo</option>
    <option value="content">Solo messaggi</option>
  </select>
</div>
```

### Analytics (Privacy-first)

```javascript
// Track ricerche (per capire cosa cercano gli utenti)
// Salva SOLO: keyword, filter_count, results_count, timestamp
// Non track: user IP, detailed behavior, cookies

const logSearch = async (keyword, resultsCount) => {
  await supabase
    .from('analytics_searches')
    .insert([{
      keyword: keyword,
      results_count: resultsCount,
      searched_at: new Date().toISOString(),
      // NO IP, NO user ID, NO fingerprint
    }]);
};
```

### PWA (Progressive Web App)

```json
// manifest.json - Aggiungi app installabile
{
  "name": "L'Orecchio del Gerofante",
  "short_name": "Orecchio",
  "description": "Archivio forum 2001-2019",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1007",
  "theme_color": "#b8860b",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🔧 Code Refactoring

### Separare CSS e JavaScript (Current: Inline)

**Struttura proposta:**
```
.
├── index.html                    # HTML puro
├── css/
│   ├── variables.css            # CSS variables/theme
│   ├── layout.css               # Layout styling
│   ├── components.css           # Component styling
│   └── responsive.css           # Media queries
├── js/
│   ├── api.js                   # Supabase queries
│   ├── search.js                # Search functionality
│   ├── ui.js                    # UI rendering
│   ├── theme.js                 # Theme toggle
│   └── main.js                  # App initialization
└── public/
    ├── favicon.ico
    └── logo.png
```

**Benefici:**
- Codice più mantenibile
- CSS riutilizzabile
- JS testabile
- Possibilità di aggiungere build tools (Vite, Webpack)

### Aggiungere TypeScript (Opzionale)

```typescript
// Se usi build tool
interface Thread {
  id: number;
  name: string;
  author: string;
  post_count: number;
  first_post_at: string;
  last_post_at: string;
}

interface Post {
  id: number;
  thread_id: number;
  author: string;
  content: string;
  posted_at: string;
}

const search = async (filters: SearchFilters): Promise<Thread[]> => {
  // Type-safe queries
};
```

### Error Handling Robusto

```javascript
// Current: Mostra errore generico
// Proposto: Categorizza errori

class ForumError extends Error {
  constructor(
    public code: 'SUPABASE_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR',
    message: string,
    public recoverable: boolean = true
  ) {
    super(message);
  }
}

const handleError = (error: ForumError) => {
  if (error.code === 'SUPABASE_ERROR') {
    // Mostra: "Database temporaneamente unavailable"
  } else if (error.code === 'NETWORK_ERROR') {
    // Mostra: "Controlla la connessione internet"
  }
};
```

---

## 🌍 Internazionalizzazione (i18n)

```javascript
const translations = {
  it: {
    'search.placeholder': 'Cerca nel titolo o nel testo...',
    'author.label': '✍ Autore',
    'threading.messages': 'messaggi',
    'error.no-connection': 'Inserisci URL e chiave Supabase.',
  },
  en: {
    'search.placeholder': 'Search title or content...',
    'author.label': '✍ Author',
    'threading.messages': 'messages',
    'error.no-connection': 'Enter Supabase URL and key.',
  }
};

const t = (key: string) => {
  const [section, name] = key.split('.');
  return translations[navigator.language] || translations['en'];
};
```

---

## 📱 Mobile-first Redesign

```css
/* Versione mobile ottimizzata */
@media (max-width: 480px) {
  .filters-bar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .thread-card {
    padding: 0.7rem; /* Più compatto */
  }
  
  .detail-panel {
    max-height: 100vh;
    border-radius: 0;
  }
}
```

---

## 🚀 Deployment Avanzato

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### CDN Strategy

Hosted su Cloudflare Pages per:
- ✅ Cache globale
- ✅ Analytics
- ✅ Zero-downtime deploys
- ✅ Più region worldwide

---

## 📊 Analytics & Monitoring

### Implementare privacy-first analytics

```javascript
// Usa Fathom Analytics o Plausible (GDPR compliant)
<script defer data-domain="forum.example.com" src="https://analytics.example.com/js/script.js"></script>

// O implementa tracking minimo:
const trackEvent = (event: string, properties?: object) => {
  // Salva solo: event name, timestamp, aggregated count
  // NO: user IP, device fingerprint, tracking cookies
};
```

---

## ✅ Testing

```javascript
// Test suite (Vitest)
describe('Search', () => {
  it('should filter threads by keyword', async () => {
    const results = await search({ keyword: 'test' });
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return empty with no matches', async () => {
    const results = await search({ keyword: 'zzz_nonexistent' });
    expect(results).toEqual([]);
  });
});
```

---

## 📝 Documentation

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Component library docs
- [ ] Contributing guide
- [ ] Troubleshooting FAQ
- [ ] Video tutorial

---

## 🎉 Quando completare?

**MVP (ora):**
- Ricerca base, visualizzazione, paginazione

**Beta (1-2 settimane dopo):**
- Tema scuro, export, bug fixes basati su feedback

**v1.0 (1 mese):**
- Search avanzata, analytics, mobile optimized

**v2.0 (3+ mesi):**
- PWA, API, i18n, social features

---

**Feedback welcome!** Apri un Issue per suggerire priorità diverse.
