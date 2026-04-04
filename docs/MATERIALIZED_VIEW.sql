-- ════════════════════════════════════════════════════════════════════════════════
-- MATERIALIZED VIEW: threads_view (ORDINATA E PRE-CALCOLATA)
-- ════════════════════════════════════════════════════════════════════════════════
-- Eseguire questo comando nel Supabase SQL Editor
-- Questo sostituisce la vista regolare con una materialized view molto più veloce

DROP MATERIALIZED VIEW IF EXISTS threads_view CASCADE;

CREATE MATERIALIZED VIEW threads_view AS
-- ════════════════════════════════════════════════════════════════════════════════
-- GEROFANTE - Dati da threads e posts
-- ════════════════════════════════════════════════════════════════════════════════
WITH gerofante_last_post AS (
  SELECT DISTINCT ON (posts.thread_id) 
    posts.id AS last_post_id,
    posts.thread_id,
    posts.author AS last_post_author,
    posts.posted_at AS last_post_at,
    posts.content AS last_post_body,
    TRIM(
      LEFT(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(posts.content, '<[^>]+>'::text, ' '::text, 'g'),
            '&nbsp;|&#160;'::text, ' '::text, 'g'
          ),
          '\s+'::text, ' '::text, 'g'
        ),
        250
      )
    ) AS last_post_preview
  FROM posts
  ORDER BY posts.thread_id, posts.posted_at DESC
),
gerofante_stats AS (
  SELECT 
    posts.thread_id,
    COUNT(*) AS post_count,
    MIN(posts.posted_at) AS first_post_at
  FROM posts
  GROUP BY posts.thread_id
),
gerofante_data AS (
  SELECT 
    t.id,
    t.name,
    t.author AS thread_author,
    s.post_count,
    s.first_post_at,
    lp.last_post_id,
    lp.last_post_at,
    lp.last_post_author,
    lp.last_post_body,
    lp.last_post_preview,
    'Gerofante'::TEXT AS source
  FROM ((threads t
    JOIN gerofante_stats s ON (s.thread_id = t.id))
    JOIN gerofante_last_post lp ON (lp.thread_id = t.id))
),

-- ════════════════════════════════════════════════════════════════════════════════
-- CRONACHE - Dati da cronache_threads e cronache_posts
-- ════════════════════════════════════════════════════════════════════════════════
cronache_last_post AS (
  SELECT DISTINCT ON (cronache_posts.thread_id) 
    cronache_posts.id AS last_post_id,
    cronache_posts.thread_id,
    cronache_posts.author AS last_post_author,
    cronache_posts.posted_at AS last_post_at,
    cronache_posts.content AS last_post_body,
    TRIM(
      LEFT(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(cronache_posts.content, '<[^>]+>'::text, ' '::text, 'g'),
            '&nbsp;|&#160;'::text, ' '::text, 'g'
          ),
          '\s+'::text, ' '::text, 'g'
        ),
        250
      )
    ) AS last_post_preview
  FROM cronache_posts
  ORDER BY cronache_posts.thread_id, cronache_posts.posted_at DESC
),
cronache_stats AS (
  SELECT 
    cronache_posts.thread_id,
    COUNT(*) AS post_count,
    MIN(cronache_posts.posted_at) AS first_post_at
  FROM cronache_posts
  GROUP BY cronache_posts.thread_id
),
cronache_data AS (
  SELECT 
    ct.id,
    ct.name,
    ct.author AS thread_author,
    s.post_count,
    s.first_post_at,
    lp.last_post_id,
    lp.last_post_at,
    lp.last_post_author,
    lp.last_post_body,
    lp.last_post_preview,
    'Cronache'::TEXT AS source
  FROM ((cronache_threads ct
    JOIN cronache_stats s ON (s.thread_id = ct.id))
    JOIN cronache_last_post lp ON (lp.thread_id = ct.id))
)

-- ════════════════════════════════════════════════════════════════════════════════
-- UNION - Combina Gerofante e Cronache
-- ════════════════════════════════════════════════════════════════════════════════
SELECT 
  id,
  name,
  thread_author,
  post_count,
  first_post_at,
  last_post_id,
  last_post_at,
  last_post_author,
  last_post_body,
  last_post_preview,
  source
FROM gerofante_data

UNION ALL

SELECT 
  id,
  name,
  thread_author,
  post_count,
  first_post_at,
  last_post_id,
  last_post_at,
  last_post_author,
  last_post_body,
  last_post_preview,
  source
FROM cronache_data

-- ✅ ORDINAMENTO DEFINITIVO - Per last_post_at DESC
ORDER BY last_post_at DESC;

-- ════════════════════════════════════════════════════════════════════════════════
-- INDICE PER VELOCIZZARE QUERY
-- ════════════════════════════════════════════════════════════════════════════════
CREATE INDEX idx_threads_view_last_post_at ON threads_view (last_post_at DESC);

-- ════════════════════════════════════════════════════════════════════════════════
-- REFRESH POLICY
-- ════════════════════════════════════════════════════════════════════════════════
-- Per aggiornare la materialized view dopo modifiche ai posts/threads, usa:
-- REFRESH MATERIALIZED VIEW threads_view;
-- 
-- Oppure per fare un refresh con indice intact:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY threads_view;
-- 
-- Nota: CONCURRENTLY richiede un unique index. Se non funziona, usa il primo.

