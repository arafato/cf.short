-- Migration number: 0001 	 2025-07-08T12:37:31.277Z
CREATE TABLE IF NOT EXISTS "user-url-mapping" (
  userId TEXT PRIMARY KEY,
  originalUrl TEXT,
  shortenedUrl TEXT
);