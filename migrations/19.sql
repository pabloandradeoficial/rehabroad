CREATE TABLE site_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL DEFAULT 'home',
  visitor_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_views_page ON site_views(page);
CREATE INDEX idx_site_views_created_at ON site_views(created_at);