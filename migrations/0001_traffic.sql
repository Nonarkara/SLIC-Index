CREATE TABLE IF NOT EXISTS traffic_daily (
  day TEXT NOT NULL,
  country TEXT NOT NULL CHECK(length(country) = 2),
  count INTEGER NOT NULL CHECK(count > 0),
  PRIMARY KEY(day, country)
);
CREATE TABLE IF NOT EXISTS traffic_budget (
  day TEXT NOT NULL,
  digest TEXT NOT NULL,
  count INTEGER NOT NULL CHECK(count > 0),
  PRIMARY KEY(day, digest)
);
CREATE TABLE IF NOT EXISTS traffic_sessions (
  day TEXT NOT NULL,
  digest TEXT NOT NULL,
  budget TEXT NOT NULL,
  country TEXT NOT NULL,
  PRIMARY KEY(day, digest)
);
CREATE TRIGGER IF NOT EXISTS traffic_count AFTER INSERT ON traffic_sessions BEGIN
  INSERT INTO traffic_daily(day, country, count) VALUES(NEW.day, NEW.country, 1)
    ON CONFLICT(day, country) DO UPDATE SET count = count + 1;
  INSERT INTO traffic_budget(day, digest, count) VALUES(NEW.day, NEW.budget, 1)
    ON CONFLICT(day, digest) DO UPDATE SET count = count + 1;
END;
