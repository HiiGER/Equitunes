-- Cleanup near-duplicate play_history rows (< 10s) per user+track
WITH ordered AS (
  SELECT
    id,
    user_id,
    track_id,
    played_at,
    lag(played_at) OVER (PARTITION BY user_id, track_id ORDER BY played_at) AS prev_played_at
  FROM play_history
)
DELETE FROM play_history p
USING ordered o
WHERE p.id = o.id
  AND o.prev_played_at IS NOT NULL
  AND EXTRACT(EPOCH FROM (o.played_at - o.prev_played_at)) < 10;
