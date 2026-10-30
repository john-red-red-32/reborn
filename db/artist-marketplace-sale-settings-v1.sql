-- Add optional selling configuration without changing existing gallery artwork records.
-- No payment, auction clock or live bidding is activated by this migration.
CREATE TABLE IF NOT EXISTS gallery_sale_settings (
 work_id TEXT PRIMARY KEY REFERENCES gallery_works(id) ON DELETE CASCADE,
 auction_duration_days INTEGER NOT NULL DEFAULT 7 CHECK(auction_duration_days IN (3,5,7,10,14)),
 reserve_price_minor INTEGER CHECK(reserve_price_minor IS NULL OR reserve_price_minor BETWEEN 0 AND 100000000),
 buy_now_price_minor INTEGER CHECK(buy_now_price_minor IS NULL OR buy_now_price_minor BETWEEN 0 AND 100000000),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
