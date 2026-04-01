# L'Orecchio del Gerofante - Configurazione

File di configurazione e personalizzazione del progetto.

## 📝 File di Configurazione Opzionali

### `.env.local` - Credenziali Supabase (Git-ignored)

Se vuoi evitare di inserire le credenziali nel browser:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAi...
```

**IMPORTANTE:** Aggiungi a `.gitignore` - mai committare credenziali!

---

### `config.js` - Configurazione applicazione (Opzionale)

Se usi una versione con build tool (Vite, webpack):

```javascript
export const CONFIG = {
  // Supabase
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  },
  
  // Paginator
  resultsPerPage: 25,
  
  // UI
  theme: 'dark', // 'dark' | 'light'
  language: 'it', // 'it' | 'en'
  
  // Analytics (se abilito)
  analytics: {
    enabled: false,
    provider: 'plausible', // 'plausible' | 'fathom'
  },
  
  // Search
  search: {
    minLength: 2,
    debounceMs: 300,
    maxResults: 1000,
  },
  
  // Feature flags
  features: {
    darkModeToggle: false,
    export: false,
    advancedSearch: false,
    statistics: false,
  }
};
```

---

### `manifest.json` - Config PWA (Opzionale)

Per rendere il sito installabile come app:

```json
{
  "name": "L'Orecchio del Gerofante",
  "short_name": "Orecchio",
  "description": "Archivio interattivo del forum 2001-2019",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#1a1007",
  "theme_color": "#b8860b",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

Aggiungi in `<head>`:
```html
<link rel="manifest" href="manifest.json" />
<meta name="theme-color" content="#b8860b" />
```

---

### `.github/workflows/deploy.yml` - GitHub Actions CI/CD (Opzionale)

Deployment automatico su GitHub Pages:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

Questo workflow:
1. Trigga su push al branch `main`
2. Carica i file statici
3. Deploya automaticamente a GitHub Pages
4. Nessun build step richiesto

---

### GitHub Secrets - Credenziali (Per CI/CD)

Se usi CI/CD con credenziali:

1. Va a `Repository → Settings → Secrets and variables → Actions`
2. Aggiungi:
   - `SUPABASE_URL`: `https://xxxxx.supabase.co`
   - `SUPABASE_ANON_KEY`: `eyJ0eXAi...`

Usa così nel workflow:
```yaml
- name: Configure environment
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

---

## 🎯 Personalizzazione Visuale

### Colori (CSS Variables)

Modifica in `index.html` section `<style>`:

```css
:root {
  --parchment:    #f5ead8;      /* Fondo principale */
  --parchment-dk: #e8d5b0;      /* Fondo scuro */
  --ink:          #1c1007;      /* Testo principale */
  --ink-faded:    #4a3520;      /* Testo secondario */
  --gold:         #b8860b;      /* Colore accent */
  --gold-lt:      #d4a017;      /* Accent light */
  --crimson:      #7a1c1c;      /* Highlight/error */
  --shadow:       rgba(28,16,7,0.35);  /* Ombre */
  --border:       #8b6914;      /* Bordi */
}
```

**Palette suggerite:**

*Medieval Dark:*
```css
--parchment: #2a2520;
--gold: #c9a961;
--crimson: #a74444;
```

*Modern Light:*
```css
--parchment: #ffffff;
--gold: #2563eb;
--crimson: #dc2626;
```

### Font

Importa da Google Fonts in `<head>`:

```html
<!-- Default: Cinzel, Crimson Text, IM Fell English -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:wght@400;600&display=swap" rel="stylesheet" />
```

Modifica CSS:
```css
h1 { font-family: 'Playfair Display', serif; }
body { font-family: 'Lora', serif; }
```

### Logo/Immagini

Aggiungi in header:
```html
<header>
  <img src="logo.png" alt="Logo" style="height: 60px; margin-bottom: 1rem; filter: drop-shadow(0 0 4px var(--gold));" />
  <!-- ... rest ... -->
</header>
```

Salva immagine in root directory (stesso livello di `index.html`).

---

## 📊 Integrazione Analytics (Privacy-first)

### Option 1: Plausible Analytics

```html
<!-- In <head> -->
<script defer data-domain="tuodominio.com" src="https://plausible.io/js/script.js"></script>
```

- ✅ GDPR compliant
- ✅ No cookies
- ✅ Anonimo
- 💰 Freemium (da ~$10/month)

### Option 2: Fathom Analytics

```html
<script src="https://cdn.usefathom.com/script.js" data-site="XXXXX" defer></script>
```

- ✅ GDPR compliant
- ✅ No cookies
- ✅ European servers
- 💰 From $14/month

### Option 3: Custom privacy-first logging

Salva solo: keyword ricercato, numero risultati, timestamp (NO IP, NO fingerprint):

```javascript
const logSearch = async (keyword, resultsCount) => {
  // Log locale (no network request)
  console.log({
    keyword,
    resultsCount,
    timestamp: new Date().toISOString()
  });
  
  // Opzional: invia a endpoint privato (non public API)
  // await fetch('/api/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify({ keyword, resultsCount })
  // });
};
```

---

## 🔧 Manutenzione

### Aggiornare Supabase JS Client

Al momento il codice carica da CDN. Per aggiornare:

```html
<!-- Versione specifica -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0"></script>

<!-- Sempre latest (non recommended per production) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Checkare versoin corrente

Nel browser console:
```javascript
console.log(window.supabase.version);
```

---

## 📋 Checklist di configurazione

- [ ] Scegli tema colori e personalizza CSS
- [ ] Decidi se aggiungere logo
- [ ] Configura analytics (opzionale)
- [ ] Abilita GitHub Actions per deploys automatici (opzionale)
- [ ] Aggiungi credenziali GitHub Secrets se usi CI/CD
- [ ] Testa PWA manifest se vuoi app installabile (opzionale)

---

**Non è necessario configurare nulla per il funzionamento base!**  
La configurazione di default dovrebbe funzionare OOB.
