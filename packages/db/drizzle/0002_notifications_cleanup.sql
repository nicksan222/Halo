-- Cleanup function to purge read notifications older than 15 days
CREATE OR REPLACE FUNCTION cleanup_read_notifications()
RETURNS trigger AS $$
BEGIN
  DELETE FROM notifications
  WHERE is_read = true
    AND read_at IS NOT NULL
    AND read_at < now() - interval '15 days';

  RETURN NULL; -- statement-level trigger returns null
END;
$$ LANGUAGE plpgsql;

-- Statement-level trigger to run after inserts or updates to notifications
DROP TRIGGER IF EXISTS trigger_cleanup_read_notifications ON notifications;
CREATE TRIGGER trigger_cleanup_read_notifications
AFTER INSERT OR UPDATE OF is_read, read_at ON notifications
FOR EACH STATEMENT EXECUTE FUNCTION cleanup_read_notifications(); 