-- Reborna community v1. SQLite / Cloudflare D1.
-- Applied explicitly before public registration is enabled. Never store raw passwords or session tokens.
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY,
 email TEXT UNIQUE COLLATE NOCASE,
 handle TEXT NOT NULL UNIQUE COLLATE NOCASE,
 display_name TEXT NOT NULL,
 bio TEXT NOT NULL DEFAULT '',
 password_salt TEXT,
 password_hash TEXT,
 password_iterations INTEGER NOT NULL DEFAULT 100000,
 email_verified_at TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now')),
 is_editorial INTEGER NOT NULL DEFAULT 0 CHECK(is_editorial IN (0,1)),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended','deleted')),
 allow_messages INTEGER NOT NULL DEFAULT 1 CHECK(allow_messages IN (0,1)),
 notification_email INTEGER NOT NULL DEFAULT 0 CHECK(notification_email IN (0,1)),
 marketing_email INTEGER NOT NULL DEFAULT 0 CHECK(marketing_email IN (0,1)),
 CONSTRAINT real_user_password CHECK(is_editorial=1 OR (email IS NOT NULL AND password_salt IS NOT NULL AND password_hash IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS user_roles (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 role TEXT NOT NULL CHECK(role IN ('collector','reborn_artist','sculptor','supplier')),
 PRIMARY KEY(user_id,role)
);
CREATE TABLE IF NOT EXISTS user_interests (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 interest TEXT NOT NULL CHECK(interest IN ('kits','finished_dolls','high_end_dolls','materials','techniques','events','authenticity','selling')),
 PRIMARY KEY(user_id,interest)
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 expires_at TEXT NOT NULL,
 last_seen TEXT
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS email_tokens (
 token_hash TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 purpose TEXT NOT NULL CHECK(purpose IN ('verify','reset')),
 expires_at TEXT NOT NULL,
 used_at TEXT
);
CREATE INDEX IF NOT EXISTS email_tokens_user ON email_tokens(user_id);
CREATE TABLE IF NOT EXISTS rate_limits (
 key TEXT PRIMARY KEY,
 count INTEGER NOT NULL,
 window_start INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS posts (
 id TEXT PRIMARY KEY,
 author_id TEXT NOT NULL REFERENCES users(id),
 category TEXT NOT NULL CHECK(category IN ('general','kits','painting','mohair','silicone','authenticity','showcase','marketplace')),
 title TEXT NOT NULL,
 body TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now')),
 status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published','hidden','removed')),
 pinned INTEGER NOT NULL DEFAULT 0 CHECK(pinned IN (0,1)),
 locked INTEGER NOT NULL DEFAULT 0 CHECK(locked IN (0,1))
);
CREATE INDEX IF NOT EXISTS posts_category_time ON posts(category,created_at DESC);
CREATE INDEX IF NOT EXISTS posts_time ON posts(created_at DESC);
CREATE TABLE IF NOT EXISTS post_products (
 post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
 product_type TEXT NOT NULL CHECK(product_type IN ('kit','material')),
 product_path TEXT NOT NULL,
 PRIMARY KEY(post_id,product_type,product_path)
);
CREATE INDEX IF NOT EXISTS post_products_lookup ON post_products(product_path,post_id);
CREATE TABLE IF NOT EXISTS replies (
 id TEXT PRIMARY KEY,
 post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
 author_id TEXT NOT NULL REFERENCES users(id),
 body TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published','hidden','removed'))
);
CREATE INDEX IF NOT EXISTS replies_post ON replies(post_id,created_at);
CREATE TABLE IF NOT EXISTS votes (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 PRIMARY KEY(user_id,post_id)
);
CREATE TABLE IF NOT EXISTS conversations (
 id TEXT PRIMARY KEY,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now')),
 related_post_id TEXT REFERENCES posts(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS conversation_members (
 conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 last_read_at TEXT,
 PRIMARY KEY(conversation_id,user_id)
);
CREATE INDEX IF NOT EXISTS conversation_members_user ON conversation_members(user_id);
CREATE TABLE IF NOT EXISTS messages (
 id TEXT PRIMARY KEY,
 conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
 sender_id TEXT NOT NULL REFERENCES users(id),
 body TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS messages_thread ON messages(conversation_id,created_at);
CREATE TABLE IF NOT EXISTS reports (
 id TEXT PRIMARY KEY,
 reporter_id TEXT NOT NULL REFERENCES users(id),
 target_type TEXT NOT NULL CHECK(target_type IN ('post','reply','message','user')),
 target_id TEXT NOT NULL,
 reason TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','reviewing','closed'))
);
-- Editorial starter discussions are clearly authored by Reborna. No fabricated members or votes.
INSERT OR IGNORE INTO users (id,handle,display_name,bio,is_editorial,email_verified_at)
 VALUES ('reborna-editorial','reborna','Reborna Editorial','Practical guidance and independently sourced conversations from the Reborna team.',1,datetime('now'));
INSERT OR IGNORE INTO posts (id,author_id,category,title,body,pinned) VALUES
('guide-welcome','reborna-editorial','general','Welcome to the Reborna community',
'This is a space for collectors, reborn artists, original sculptors and specialist suppliers. Ask genuine questions, share techniques and talk openly about products. Reborna editorial posts are identified as such; we do not manufacture member reviews, comments or votes. Be kind to other people and respect the work of original artists.',1),
('guide-original-kits','reborna-editorial','authenticity','Original kits, copied sculpts and how to check provenance',
'A manufactured kit is not the same thing as a completed reborn doll. Start with the original sculptor, compare edition details and look for authorised sources. A certificate on its own cannot prove that the vinyl kit in front of you is genuine. Have you found useful ways to verify provenance?',1),
('guide-paint-systems','reborna-editorial','painting','Heat-set, air-dry and silicone paints: why the distinction matters',
'Heat-set vinyl paints, air-dry vinyl paints and silicone pigments use different systems. Curing instructions, surfaces and mediums are not interchangeable. Check the manufacturer guidance for your specific product and substrate before experimenting. Which system do you use, and what would you like to learn?',0),
('guide-baking','reborna-editorial','painting','Discussing heat-setting techniques and manufacturer instructions',
'Heat-setting advice varies by product and equipment. This thread is for comparing manufacturer instructions, ventilation arrangements and results, rather than assuming one temperature or curing cycle works for every brand. Tell us the exact paint system you mean when asking a question.',0),
('guide-silicone-vinyl','reborna-editorial','silicone','Silicone versus vinyl: materials, finishing and practical differences',
'Vinyl and silicone are distinct materials, with different preparation, painting, finishing and care considerations. What challenges have you encountered when changing materials? Please mention your material and product range so advice stays relevant.',0),
('guide-rooting','reborna-editorial','mohair','Rooting mohair: needle choice, hair texture and direction',
'Share what you have learned about mohair texture, rooting density and needle styles. Small differences in fibre, backing material and gauge can affect your results. Please include your material when asking for a recommendation.',0),
('guide-kit-discussion','reborna-editorial','kits','Talk about a specific sculpt or manufactured kit',
'When posting about a kit, use the product link option if it is already in the Reborna catalogue. Your discussion can then appear alongside the product page, making independent experiences easier for future collectors and artists to find.',0),
('guide-showcase','reborna-editorial','showcase','Show us what you are making',
'We would love to hear about your work in progress: a sculpt you are painting, a technique you are trying or a project you have just finished. Please credit the original sculptor and relevant makers whenever you share your work.',0);
