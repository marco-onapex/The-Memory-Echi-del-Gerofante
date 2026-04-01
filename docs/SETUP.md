# Guida Dettagliata di Setup

Questa guida ti porterà passo-passo nel setup completo del progetto.

## 📋 Prerequisiti

- Un account **GitHub** (gratuito su github.com)
- Un account **Supabase** (gratuito su supabase.com)
- I tuoi dati del forum già salvati e organizzati

## 🔧 Step 1: Preparare Supabase

### 1.1 Creare un nuovo progetto Supabase

1. Accedi a [supabase.com](https://supabase.com) e clicca "New Project"
2. Seleziona una regione vicina a te
3. Crea una password strong e annota la **Project URL** e **Anon Key**

### 1.2 Importare i dati del forum

#### Schema minimo richiesto:

**Tabella: `threads`**
```sql
CREATE TABLE threads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  first_post_at TIMESTAMP,
  last_post_at TIMESTAMP,
  post_count INT DEFAULT 0
);
```

**Tabella: `posts`**
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  thread_id INT REFERENCES threads(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT,
  posted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Vista: `threads_view` (per ricerca ottimizzata)**
```sql
CREATE VIEW threads_view AS
SELECT 
  t.id,
  t.name,
  t.author,
  t.first_post_at,
  t.last_post_at,
  t.post_count,
  to_tsvector('italian', t.name || ' ' || COALESCE(STRING_AGG(p.content, ' '), '')) as search_vector
FROM threads t
LEFT JOIN posts p ON p.thread_id = t.id
GROUP BY t.id, t.name, t.author, t.first_post_at, t.last_post_at, t.post_count;
```

### 1.3 Importare i dati

**Opzione A: SQL direttamente**
- In Supabase → SQL Editor
- Copia-incolla il tuo SQL di import
- Esegui

**Opzione B: CSV upload**
- Prepara un CSV con i tuoi thread
- In Supabase → Table Editor → New Table → Import CSV
- Configura le colonne correttamente

**Opzione C: Script Python**
```python
import supabase
client = supabase.create_client(url, key)
# Carica i tuoi dati...
```

### 1.4 Configurare Row Level Security (RLS)

1. In Supabase → Authentication → Policies
2. Per la tabella `threads_view`: Enable RLS
3. Crea Policy "Public Read Only":
   ```sql
   CREATE POLICY "Enable read access for all users"
   ON threads_view FOR SELECT
   USING (true);
   ```
4. Ripeti per `posts`

### 1.5 Ottenere le credenziali

Nel dashboard Supabase:
1. Clicca "Connect" (in alto a destra)
2. Copia:
   - **URL**: `https://xxxxx.supabase.co`
   - **Anon Public Key**: La stringa lunga che inizia con `eyJ...`

Queste le userai per connettere l'app web.

---

## 🚀 Step 2: Setup GitHub (Hosting)

### 2.1 Creare una repository GitHub

1. Accedi a [github.com](https://github.com)
2. Clicca il `+` in alto a destra → "New repository"
3. Nome: `lorecchio-del-gerofante` (o il nome che preferisci)
4. Descrizione: "Archivio wiki del forum 2001-2019"
5. Public ✓ (necessario per GitHub Pages gratuito)
6. Initialize with README ✓
7. Create repository

### 2.2 Clonare la repository

```bash
git clone https://github.com/tuoutente/lorecchio-del-gerofante.git
cd lorecchio-del-gerofante
```

### 2.3 Aggiungere i file del progetto

```bash
# Copia i file da questo progetto
cp /path/to/index.html ./
cp /path/to/README.md ./
cp /path/to/.gitignore ./
mkdir docs
cp /path/to/docs/* ./docs/

# Verifica
ls -la
# Dovresti vedere: index.html, README.md, .gitignore, docs/
```

### 2.4 Pushare i file a GitHub

```bash
git add .
git commit -m "Initial commit: Forum archive setup"
git push origin main
```

Verifica su GitHub che i file siano caricati ✓

### 2.5 Abilitare GitHub Pages

1. Vai su GitHub → Tua repository → Settings
2. Sidebar: "Pages"
3. Under "Build and deployment":
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
4. Save

**La tua pagina sarà live tra 30-60 secondi!**  
URL: `https://tuoutente.github.io/lorecchio-del-gerofante/`

---

## 💻 Step 3: Configurare le credenziali

### Opzione A: Via interfaccia web (Consigliato)

1. Apri `https://tuoutente.github.io/lorecchio-del-gerofante/`
2. Banner in alto: "Inserisci le credenziali Supabase"
3. Incolla:
   - URL Supabase: `https://xxxxx.supabase.co`
   - Anon Key: `eyJ0eXAi...` (dalla sezione 1.5)
4. Clicca "Connetti ✦"
5. ✓ Dovrebbe mostrare i tuoi thread!

### Opzione B: File di configurazione (Per produzione)

1. Nella root della repository, crea `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ0eXAi...
   ```

2. **NON committare questo file!**
   ```bash
   echo ".env.local" >> .gitignore
   git add .gitignore
   git commit -m "Update gitignore to exclude .env.local"
   git push
   ```

3. Per il deployment, usa **GitHub Secrets**:
   - Repository Settings → Secrets → New secret
   - Nome: `SUPABASE_URL`
   - Valore: `https://xxxxx.supabase.co`
   - Ripeti con `SUPABASE_ANON_KEY`

---

## 🎨 Step 4: Personalizzare (Opzionale)

### Cambiare il titolo

Modifica in `index.html`:
```html
<title>L'Orecchio del Gerofante</title> <!-- Cambia here -->
```

### Otimizzare i colori

Modifica le variabili CSS in `index.html`:
```css
:root {
  --parchment:    #f5ead8;  /* Colore sfondo principale */
  --gold:         #b8860b;  /* Colore accent */
  --crimson:      #7a1c1c;  /* Colore evidenziazione */
  /* ... */
}
```

### Aggiungere un logo

```html
<header>
  <img src="logo.png" alt="Logo" style="height: 50px; margin-bottom: 1rem;">
  <!-- ... rest of header ... -->
</header>
```

Carica il logo nella root del progetto e pusha.

---

## ✅ Checklist di verifica

- [ ] Supabase project creato con dati importati
- [ ] RLS configurato su Supabase
- [ ] Credenziali Supabase copiate
- [ ] Repository GitHub creata
- [ ] File caricati su GitHub
- [ ] GitHub Pages abilitato
- [ ] URL di GitHub Pages copiato nel browser (aspetta 1 minuto se nuovo)
- [ ] Credenziali inserite nella pagina web
- [ ] Thread visualizzati ✓
- [ ] Ricerca funziona ✓
- [ ] Dettagli thread si aprono correttamente ✓

---

## 🐛 Troubleshooting

### "Nessun thread trovato"
- Verifica che i dati siano in Supabase: vai nel Table Editor e controlla
- Controlla il nome esatto della tabella (`threads_view`)
- Verifica le colonne: devono esistere `name`, `author`, `post_count`

### "Errore di connessione Supabase"
- URL contains spaces? Rimuovili
- Anon Key è corretta? Copia dal dashboard senza modifiche
- Firewall/VPN blocca? Prova da un altro network

### "CORS error"
- Supabase permette accesso client-side di default ✓
- Verifica che il dominio GitHub Pages sia raggiungibile (prova curl)
- Aspetta 5 minuti dopo il setup di GitHub Pages

### "Pagina bianca"
- Apri Developer Tools (F12)
- Vai a Console e guarda gli errori
- Verifica HTML sia caricato correttamente

### Una volta deployato, come aggiorno i dati?
- I dati si aggiornano da Supabase in tempo reale
- Se aggiungi/modifichi records in Supabase, appaiono automaticamente nella prossima ricerca
- No need to redeploy!

---

## 📚 Risorse

- [Supabase Docs](https://supabase.com/docs)
- [GitHub Pages Guide](https://pages.github.com/)
- [SQL Basics](https://www.postgresql.org/docs/)

---

**Fatto! 🎉 Il tuo forum archive è online!**

Per domande, apri un Issue nel repository.
