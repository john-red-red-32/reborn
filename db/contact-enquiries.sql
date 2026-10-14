-- Reborna confidential contact enquiries, EU D1.
-- No public listing endpoint. Enquiries are not forum posts or mailing list subscriptions.
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('general','artist','verification','community','supplier','events','report')),
  message TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT (datetime('now')),
  delivery_status TEXT NOT NULL DEFAULT 'queued' CHECK(delivery_status IN ('queued','sent','failed')),
  delivered_at TEXT,
  delivery_error TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','in_progress','closed'))
);
CREATE INDEX IF NOT EXISTS contact_enquiries_received ON contact_enquiries(received_at DESC);
CREATE INDEX IF NOT EXISTS contact_enquiries_delivery ON contact_enquiries(delivery_status,received_at);
