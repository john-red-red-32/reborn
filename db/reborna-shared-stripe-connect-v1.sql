-- Reborna marketplace's own ledger; references shared merchant Stripe account, never Varanos orders.
-- Run on preview and production D1 before publishing new Pages Functions.
CREATE TABLE IF NOT EXISTS gallery_stripe_sellers (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 stripe_account_id TEXT NOT NULL UNIQUE,
 country TEXT NOT NULL CHECK(length(country)=2),
 charges_enabled INTEGER NOT NULL DEFAULT 0 CHECK(charges_enabled IN (0,1)),
 payouts_enabled INTEGER NOT NULL DEFAULT 0 CHECK(payouts_enabled IN (0,1)),
 details_submitted INTEGER NOT NULL DEFAULT 0 CHECK(details_submitted IN (0,1)),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS gallery_purchase_orders (
 id TEXT PRIMARY KEY,
 work_id TEXT NOT NULL REFERENCES gallery_works(id),
 buyer_user_id TEXT NOT NULL REFERENCES users(id),
 seller_user_id TEXT NOT NULL REFERENCES users(id),
 amount_minor INTEGER NOT NULL CHECK(amount_minor BETWEEN 500 AND 100000000),
 application_fee_minor INTEGER NOT NULL CHECK(application_fee_minor>=0),
 currency TEXT NOT NULL CHECK(currency IN ('GBP','EUR','USD')),
 stripe_session_id TEXT UNIQUE,
 stripe_payment_intent_id TEXT,
 status TEXT NOT NULL DEFAULT 'creating' CHECK(status IN ('creating','checkout','paid','expired','failed','refunded','disputed')),
 checkout_expires_at INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS gallery_purchase_orders_buyer ON gallery_purchase_orders(buyer_user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS gallery_purchase_orders_seller ON gallery_purchase_orders(seller_user_id,created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS gallery_purchase_one_paid_per_work ON gallery_purchase_orders(work_id) WHERE status IN ('paid','refunded','disputed');
CREATE TABLE IF NOT EXISTS gallery_checkout_holds (
 work_id TEXT PRIMARY KEY REFERENCES gallery_works(id) ON DELETE CASCADE,
 order_id TEXT NOT NULL UNIQUE REFERENCES gallery_purchase_orders(id),
 expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS gallery_stripe_events (
 event_id TEXT PRIMARY KEY,
 event_type TEXT NOT NULL,
 processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
