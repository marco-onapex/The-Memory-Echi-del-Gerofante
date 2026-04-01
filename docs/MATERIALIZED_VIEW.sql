-- ════════════════════════════════════════════════════════════════════════════════
-- MATERIALIZED VIEW: threads_view (ORDINATA E PRE-CALCOLATA)
-- ════════════════════════════════════════════════════════════════════════════════
-- Eseguire questo comando nel Supabase SQL Editor
-- Questo sostituisce la vista regolare con una materialized view molto più veloce

DROP MATERIALIZED VIEW IF EXISTS threads_view CASCADE;

CREATE MATERIALIZED VIEW threads_view AS
WITH last_post AS (
  SELECT DISTINCT ON (posts.thread_id) 
    posts.id AS last_post_id,
    posts.thread_id,
    posts.author AS last_post_author,
    posts.posted_at AS last_post_at,
    -- Full body (non troncato)
    posts.content AS last_post_body,
    -- Strip HTML migliorato: rimuove tag, normalizza spazi, decode entità comuni
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
stats AS (
  SELECT 
    posts.thread_id,
    COUNT(*) AS post_count,
    MIN(posts.posted_at) AS first_post_at
  FROM posts
  GROUP BY posts.thread_id
)
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
  lp.last_post_preview
FROM ((threads t
  JOIN stats s ON (s.thread_id = t.id))
  JOIN last_post lp ON (lp.thread_id = t.id))
-- ✅ ORDINAMENTO DEFINITIVO - Già nella view!
ORDER BY lp.last_post_at DESC;

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

