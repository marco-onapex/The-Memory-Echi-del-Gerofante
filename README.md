# L'Orecchio del Gerofante 📜

Archivio interattivo di forum storici ospitato su GitHub Pages con backend Supabase.

> **L'Orecchio del Gerofante** è una raccolta di discussioni e messaggi da un forum del periodo 2001-2019, accessibile tramite un'interfaccia web elegante e ricercabile.

## 🚀 Quick Start

### 1. Preparare i dati su Supabase

Questo progetto richiede un database Supabase con la seguente struttura:

**Tabella `threads_view`:**
```sql
- id (INT, PK)
- name (TEXT) - titolo del thread
- author (TEXT) - autore del primo messaggio
- first_post_at (TIMESTAMP)
- last_post_at (TIMESTAMP)
- post_count (INT)
- search_vector (tsvector) - per ricerca full-text
```

**Tabella `posts`:**
```sql
- id (INT, PK)
- thread_id (INT, FK)
- author (TEXT)
- content (TEXT/HTML)
- posted_at (TIMESTAMP)
```

Vedi [docs/API.md](docs/API.md) per lo schema completo.

### 2. Setup locale (Sviluppo)

#### Prerequisiti
- Node.js 16+ installato
- git configurato
- Account Supabase con dati caricati

#### Step
```bash
# 1. Clone repo
git clone https://github.com/marco-onapex/The-Memory-Echi-del-Gerofante.git
cd The-Memory-Echi-del-Gerofante

# 2. Copia .env.example in .env.local e compila con credenziali Supabase
cp .env.example .env.local
# Edita .env.local e inserisci:
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=your_anon_key_here

# 3. Avvia server locale (genera automaticamente src/config.js)
npm run serve
# Oppure: npm run dev

# 4. Apri http://localhost:8000 nel browser
```

### 3. Deploy su GitHub Pages (Production)

#### Step 1: Configura GitHub Secrets
Nel repository GitHub:
1. Vai a **Settings → Secrets and variables → Actions**
2. Crea due secrets:
   - `VITE_SUPABASE_URL` - URL progetto Supabase
   - `VITE_SUPABASE_ANON_KEY` - Chiave anonima Supabase

#### Step 2: Abilita GitHub Pages
1. Vai a **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`
4. **Folder**: `/ (root)`
5. Salva

#### Step 3: Push
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Il workflow GitHub Actions farà il deploy automatico! 🚀

## 📋 Struttura del Progetto

```
.
├── index.html                    # Entry point (minimale)
├── src/
│   ├── js/
│   │   ├── app.js              # Orchestrazione app
│   │   ├── supabase.js         # Client Supabase
│   │   ├── search.js           # Logica ricerca
│   │   ├── ui.js               # Render UI
│   │   └── utils.js            # Funzioni utility
│   ├── css/
│   │   └── style.css           # Main stylesheet
│   ├── config.js               # (GENERATO) Credenziali ambiente
│   └── config-loader.js        # Loader configurazione
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions CI/CD
├── build.js                    # Script build (genera config.js)
├── package.json                # Dipendenze e script
├── .env.example                # Template credenziali
├── .gitignore                  # Git ignores
├── README.md                   # Questa documentazione
├── LICENSE                     # MIT License
├── docs/
│   ├── SETUP.md               # Setup dettagliato
│   ├── API.md                 # Database schema
│   ├── CONFIG.md              # Configurazione app
│   └── IMPROVEMENTS.md        # Roadmap
└── CONTRIBUTING.md            # Guida per contribuenti
```

## 🎨 Caratteristiche

- 🎭 **Design elegante** - Tema ispirato a manoscritti medievali
- 🔍 **Ricerca avanzata** - Filtra per keyword, autore, data
- 📄 **Full-text search** - Ricerca full-text (italiano) su Supabase
- 📱 **Responsive** - Funziona su desktop, tablet, mobile
- 🔐 **Sicuro** - Credenziali sottobanco, HTML sanitizzato
- ⚡ **Performance** - SPA statica, server-side pagination
- 🚀 **Easy deploy** - Un click su GitHub Pages

## 🛠️ Sviluppo

### Scripts npm

```bash
npm run serve        # Avvia server locale con auto-config
npm run dev          # Alias di serve
npm run build        # Genera src/config.js da .env.local
npm run setup        # Setup veloce (.env.local)
```

### Come funziona la configurazione

- **Dev**: `npm run serve` → legge `.env.local` → genera `src/config.js` → carica app
- **Prod**: GitHub Actions → legge GitHub Secrets → genera `src/config.js` → deploy Pages

Il file `src/config.js` è **GENERATO** e **NON** va committato. È ignorato in `.gitignore`.

## 📝 Contribuire

Vedi [CONTRIBUTING.md](CONTRIBUTING.md) per guideline su pull requests e segnalazione bug.

### Bug Report
Apri una Issue con:
- Titolo chiaro
- Step per riprodurre
- Browser/OS usati
- Screenshot

### Feature Request  
Apri una Issue con tag `enhancement`:
- Caso d'uso
- Proposta implementazione
- Priorità (P0/P1/P2/P3)

## 📜 License

MIT License - Vedi [LICENSE](LICENSE)

## 🙏 Credits

**Forum originale:** Ultima Online The Miracle Shard - Sezione "L'Orecchio del Gerofante (2001-2019)"
**Archivio:** Salvato su Supabase PostgreSQL
**Design:** Tema medievale ispirato a manoscritti antichi
- ⚡ **Performante** - Paginazione automatica (25 risultati per pagina)
- 🌙 **Tema scuro** - Design dark-mode by default
- 🔐 **Sicuro** - HTML sanitization, validazione input

## 🛠 Setup Dettagliato

Vedi [SETUP.md](docs/SETUP.md) per una guida passo-passo con screenshot.

## 🔌 API Supabase Richieste

Per i dettagli sulle query e le autorizzazioni RLS, vedi [API.md](docs/API.md).

### Permessi row-level security (RLS)

```sql
-- Threads: lettura pubblica
CREATE POLICY "Enable read access for all users"
ON threads_view FOR SELECT
USING (true);

-- Posts: lettura pubblica
CREATE POLICY "Enable read access for all users"
ON posts FOR SELECT
USING (true);
```

## 🚀 Deployment

### GitHub Pages (Gratuito ✓)

1. Abilita GitHub Pages nella repository settings
2. La pagina è automaticamente servita a `https://tuoutente.github.io/repository-name`
3. I file statici (HTML/CSS/JS) vengono serviti direttamente

### Alternative

- **Vercel** - Drag & drop dal repo GitHub
- **Netlify** - Collegamento diretto con GitHub
- **Cloudflare Pages** - Aggiorna automaticamente da Git

## 🔒 Privacy e Sicurezza

- ✅ Le credenziali Supabase rimangono nel browser
- ✅ Le query utilizzano only filtri sull'interfaccia (niente esposizione diretta DB)
- ✅ HTML content viene sanitizzato server-side e client-side
- ✅ Script injection bloccato
- ✅ No cookie tracking

**Tip:** Usa una `anon key` (non la service role key!) e configura RLS su Supabase.

## 🤝 Contribuire

Se vuoi migliorare il progetto:

1. Fai un fork
2. Crea un branch per la feature (`git checkout -b feature/amazing-feature`)
3. Commita i cambiamenti (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## 📦 Dipendenze

- **Supabase JavaScript client** - CDN (nessuna installazione richiesta)
- **Google Fonts** - Font via CDN

> Nessuna dipendenza npm/node - il progetto funziona con un semplice file HTML!

## 🐛 Troubleshooting

### "Connessione Supabase fallita"
- ✓ Verifica URL e chiave (senza spazi)
- ✓ Controlla che Supabase sia raggiungibile (`curl https://xxxxx.supabase.co`)
- ✓ Verifica che RLS sia debitamente configurato

### "Nessun thread trovato"
- ✓ Assicurati che i dati siano nella tabella `threads_view`
- ✓ La query potrebbe filtrare tutti i risultati - prova senza filtri

### Ricerca lenta
- ✓ Crea un indice GIN su `threads_view(search_vector)`
- ✓ La paginazione limita a 25 risultati per pagina

### CORS errors
- ✓ Supabase è configurato per permettere accesso da client-side
- ✓ Se usi un dominio custom, aggiungi a CORS settings su Supabase

## 📄 Licenza

[Specificare la licenza: MIT, GPL, etc.]

## 👤 Autore

Archivio a cura di [your-name-here]  
Salvato il: 2019  
Migrato online: 2026

---

**Domande?** Apri un Issue su GitHub o contattami direttamente.

> *"In memoriam dei forum perduti - sempre nella memoria digitale"* 📜✦
