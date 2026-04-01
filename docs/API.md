# Documentazione API Supabase

Guida tecnica alla struttura del database e alle query utilizzate.

## 📊 Schema Database

### Tabella: `threads`

Contiene i thread (topic) del forum.

```sql
CREATE TABLE threads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,                              -- Titolo thread
  author TEXT,                                     -- Autore primo post
  description TEXT,                                -- (Opzionale) Descrizione
  category TEXT,                                   -- (Opzionale) Categoria
  created_at TIMESTAMP DEFAULT NOW(),
  first_post_at TIMESTAMP,                         -- Data primo messaggio
  last_post_at TIMESTAMP,                          -- Data ultimo messaggio
  post_count INT DEFAULT 0,                        -- Numero messaggi
  reply_count INT DEFAULT 0,                       -- (Opzionale)
  view_count INT DEFAULT 0,                        -- (Opzionale)
  is_pinned BOOLEAN DEFAULT FALSE,                 -- (Opzionale) Fissato in alto
  status TEXT DEFAULT 'active'                     -- 'active', 'archived', 'locked'
);

CREATE INDEX idx_threads_last_post ON threads(last_post_at DESC);
CREATE INDEX idx_threads_author ON threads(author);
CREATE INDEX idx_threads_status ON threads(status);
```

### Tabella: `posts`

Contiene i messaggi all'interno dei thread.

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  thread_id INT REFERENCES threads(id) ON DELETE CASCADE,
  author TEXT NOT NULL,                            -- Nickname autore
  content TEXT,                                    -- Testo messaggio (HTML safe)
  post_number INT,                                 -- Numero sequenziale nel thread
  created_at TIMESTAMP DEFAULT NOW(),
  posted_at TIMESTAMP DEFAULT NOW(),               -- Data visibile
  updated_at TIMESTAMP,                            -- (Opzionale) Ultima modifica
  ip_address TEXT,                                 -- (Opzionale, per moderazione)
  user_id INT,                                     -- (Opzionale) Relazione utente
  likes INT DEFAULT 0,                             -- (Opzionale)
  status TEXT DEFAULT 'visible'                    -- 'visible', 'deleted', 'hidden'
);

CREATE INDEX idx_posts_thread ON posts(thread_id);
CREATE INDEX idx_posts_author ON posts(author);
CREATE INDEX idx_posts_posted_at ON posts(posted_at DESC);
CREATE INDEX idx_posts_status ON posts(status);
```

### Vista: `threads_view`

View ottimizzata per la ricerca full-text.

```sql
CREATE VIEW threads_view AS
SELECT 
  t.id,
  t.name,
  t.author,
  t.description,
  t.category,
  t.created_at,
  t.first_post_at,
  t.last_post_at,
  t.post_count,
  t.is_pinned,
  t.status,
  -- Full-text search vector: combina titolo + primi post
  (
    to_tsvector('italian', COALESCE(t.name, '')) || 
    to_tsvector('italian', COALESCE(t.description, '')) ||
    to_tsvector('italian', COALESCE(STRING_AGG(p.content, ' '), ''))
  ) as search_vector
FROM threads t
LEFT JOIN posts p ON p.thread_id = t.id AND p.status = 'visible'
WHERE t.status = 'active'
GROUP BY t.id, t.name, t.author, t.description, t.category, 
         t.created_at, t.first_post_at, t.last_post_at, 
         t.post_count, t.is_pinned, t.status;

-- Indice GIN per ricerca veloce
CREATE INDEX idx_threads_view_search ON threads_view 
USING GIN(search_vector);
```

---

## 🔍 Query API utilizzate

### 1. Ricerca thread con filtri

```javascript
// File: index.html, function search()

let query = supabase
  .from('threads_view')
  .select('*', { count: 'exact' });

// Keyword (full-text search)
if (keyword) {
  query = query.textSearch('search_vector', keyword, { config: 'italian' });
}

// Author filter
if (author) {
  query = query.ilike('author', `%${author}%`);
}

// Date range
if (dateFrom) {
  query = query.gte('first_post_at', dateFrom);
}
if (dateTo) {
  query = query.lte('last_post_at', dateTo + 'T23:59:59');
}

// Order + Pagination
query = query
  .order('last_post_at', { ascending: false })
  .range((page - 1) * 25, page * 25 - 1);

const { data, count, error } = await query;
```

**Risposta tipica:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Come usare il forum",
      "author": "Admin",
      "first_post_at": "2001-01-15T10:30:00",
      "last_post_at": "2005-06-22T14:45:00",
      "post_count": 42,
      "is_pinned": true
    }
  ],
  "count": 1234
}
```

### 2. Recuperare messaggi di un thread

```javascript
// File: index.html, function openThread(threadId)

const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('thread_id', threadId)
  .eq('status', 'visible')
  .order('posted_at', { ascending: true });
```

**Risposta tipica:**
```json
{
  "data": [
    {
      "id": 101,
      "thread_id": 1,
      "author": "Marco",
      "content": "<p>Primo messaggio nel thread...</p>",
      "posted_at": "2001-01-15T10:30:00",
      "post_number": 1
    },
    {
      "id": 102,
      "thread_id": 1,
      "author": "Luigi",
      "content": "<p>Risposta di Luigi</p>",
      "posted_at": "2001-01-15T11:15:00",
      "post_number": 2
    }
  ]
}
```

---

## 🔐 Row Level Security (RLS)

### Policy per lettura pubblica

```sql
-- Per threads_view
CREATE POLICY "Enable read access for all users"
ON threads_view FOR SELECT
USING (true);

-- Per posts
CREATE POLICY "Enable read access for all users"
ON posts FOR SELECT
USING (status = 'visible');

-- Per threads (per admin view)
CREATE POLICY "Enable read access for all users"
ON threads FOR SELECT
USING (status = 'active');
```

### Configurazione Supabase

1. In Supabase dashboard → Tables → `posts`
2. Clicca "Security" → "RLS" → Enable
3. Aggiungi Policy come sopra

---

## 🚀 Performance Tuning

### Indici raccomandati

```sql
-- Index full-text search
CREATE INDEX idx_threads_view_search ON threads_view 
USING GIN(search_vector);

-- Index per filtri comuni
CREATE INDEX idx_threads_last_post ON threads(last_post_at DESC);
CREATE INDEX idx_threads_author ON threads(author);
CREATE INDEX idx_posts_thread ON posts(thread_id);
CREATE INDEX idx_posts_posted_at ON posts(posted_at DESC);
```

### Ottimizzazione query

1. **Paginazione**: Sempre usa `.range()` per evitare huge result sets
2. **Filtri**: Applica `ilike()` e `textSearch()` server-side
3. **SELECT specifico**: Non fare `SELECT '*'` se possibile
4. **Denormalizzazione**: Il campo `post_count` evita conteggi ad ogni load

---

## 📝 Importazione dati iniziali

### Da CSV

```bash
# 1. Prepara CSV con header: id, name, author, first_post_at, last_post_at, post_count
# 2. In Supabase SQL Editor:

COPY threads(id, name, author, first_post_at, last_post_at, post_count)
FROM STDIN (DELIMITER ',', FORMAT CSV, HEADER);
```

### Da JSON

```javascript
const data = require('./forum_data.json');

const { data: result, error } = await supabase
  .from('threads')
  .insert(data.map(t => ({
    name: t.title,
    author: t.author,
    first_post_at: t.created,
    last_post_at: t.updated,
    post_count: t.replies
  })));

if (error) console.error(error);
else console.log(`Importati ${result.length} thread`);
```

### Da database esterno (PostgreSQL)

```bash
# Dump da database originale
pg_dump -h old-server.com -U user -d forum_db > forum_backup.sql

# Restore in Supabase
psql -h xxxxx.supabase.co -U postgres << EOF
\i forum_backup.sql
EOF
```

---

## 🔒 Sicurezza

### Best practices

1. **Anon Key solo per lettura**
   - Abilita RLS su tutte le tabelle
   - Usa `SELECT ONLY` per anon role
   - Non permettere `UPDATE`, `DELETE`, `INSERT`

2. **HTML Sanitization**
   ```javascript
   // Client-side (index.html)
   function sanitizeHtml(html) {
     return html
       .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
       .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
       .replace(/on\w+="[^"]*"/gi, '');
   }
   ```

3. **Input validation**
   - Dates: validate ISO format
   - Keywords: limita a 100 caratteri
   - Author: limita a 50 caratteri

4. **Rate limiting**
   - Supabase ha rate limiting gratuito
   - Per produzione, considera edge functions per throttle

---

## 📊 Monitoraggio

### Metriche da tracciare

```sql
-- Numero thread per periodo
SELECT DATE_TRUNC('month', first_post_at) as month, COUNT(*) as count
FROM threads
GROUP BY month
ORDER BY month DESC;

-- Author più attivi
SELECT author, COUNT(*) as post_count
FROM posts
WHERE status = 'visible'
GROUP BY author
ORDER BY post_count DESC
LIMIT 20;

-- Lunghezza media thread
SELECT AVG(post_count) as avg_posts, MAX(post_count) as max_posts
FROM threads;
```

---

## 🔧 Admin Operations

### Backup

```bash
# Backup diretto da Supabase CLI
supabase db pull

# Salva in file SQL
pg_dump postgresql://user:password@host/db > backup.sql
```

### Ripristino

```bash
psql postgresql://user:password@host/db < backup.sql
```

### Manutenzione

```sql
-- Vacuum (ripulisci tabelle)
VACUUM ANALYZE threads;
VACUUM ANALYZE posts;

-- Controlla dimensione DB
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📞 Support

Problemi con le query? 
- Leggi [Supabase Docs - Queries](https://supabase.com/docs/guides/api)
- Apri un Issue nel repository

