CREATE TABLE IF NOT EXISTS gallery_shipping_terms (
 work_id TEXT PRIMARY KEY REFERENCES gallery_works(id) ON DELETE CASCADE,
 shipping_included INTEGER NOT NULL DEFAULT 0 CHECK(shipping_included IN (0,1)),
 ships_from_country TEXT NOT NULL DEFAULT 'GB' CHECK(length(ships_from_country)=2),
 destination_country TEXT NOT NULL DEFAULT 'GB' CHECK(length(destination_country)=2),
 dispatch_days INTEGER NOT NULL DEFAULT 5 CHECK(dispatch_days BETWEEN 1 AND 30),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
