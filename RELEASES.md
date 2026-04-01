# Release Notes

## [1.0.0] - 2026-04-01

### ✨ Features

- **Ricerca avanzata** - Filtra thread per keyword, autore, e date range
- **Full-text search** - Ricerca semantica in italiano su titoli e contenuti
- **Threading visualizer** - Visualizza messaggi di un thread in modal overlay
- **Paginazione server-side** - 25 thread per pagina, navigazione veloce
- **Tema medievale** - Design ispirato a manoscritti antichi con colori parchment/gold
- **Responsive design** - Funziona su desktop, tablet, mobile
- **HTML sanitization** - Protezione XSS per contenuti utente
- **Date formatting** - Date localizzate in italiano (it-IT)

### 🏗️ Architecture

- SPA (Single Page Application) con JavaScript vanilla
- Frontend statico hostato su GitHub Pages
- Backend database su Supabase (PostgreSQL)
- Credenziali configurabili via UI banner

### 📚 Documentation

- [README.md](README.md) - Guida quick start
- [docs/SETUP.md](docs/SETUP.md) - Setup dettagliato
- [docs/API.md](docs/API.md) - Schema database Supabase
- [docs/CONFIG.md](docs/CONFIG.md) - Configurazione applicazione
- [CONTRIBUTING.md](CONTRIBUTING.md) - Come contribuire

### 🚀 Deployment

- Deploy automatico su GitHub Pages dal branch `main`
- Configura Settings → Pages → Deploy from branch
- Supporta custom domain

### 📦 Files

- **index.html** (✨ UNICO file HTML - CSS + JS inline)
- **.env.example** - Template credenziali Supabase
- **package.json** - Metadati e script npm
- **.gitignore** - File da ignorare nel repository
- **LICENSE** - MIT license
- **setup.sh / setup.bat** - Helper script setup veloce

### ⚠️ Known Limitations

- Credenziali Supabase visibili nel codice client (use anon key, mai service role!)
- Ricerca avanzata booleana non supportata (v1.0)
- Non c'è backend API - diretta connessione a Supabase DB
- Campo images non supportato nei post (v1.0)

### 🙏 Credits

**Forum originale:** Ultima Online The Miracle Shard - Sezione "L'Orecchio del Gerofante"
**Archivio:** Salvato su Supabase PostgreSQL
**Tema:** Ispirato a design medievale e manoscritti antichi

---

## Prossime Release (Roadmap)

### v1.1 (Giugno 2026)
- [ ] Dark mode toggle
- [ ] Author profile page
- [ ] Export thread as PDF
- [ ] Search suggestions & autocomplete

### v1.2 (Settembre 2026)
- [ ] Statistics dashboard
- [ ] Timeline view per data
- [ ] RSS feed
- [ ] Better mobile UX

### v2.0 (Futuro)
- [ ] Tagging system
- [ ] User comments/reactions
- [ ] API pubblica
- [ ] Multi-language support

---
