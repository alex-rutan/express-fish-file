CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE rivers (
  id PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  dec_lat NUMERIC,
  dec_long NUMERIC
);

CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  river_id INTEGER NOT NULL REFERENCES rivers,
  date DATE NOT NULL,
  rating INTEGER CHECK (rating >= 0) CHECK (rating <= 10),
  flow NUMERIC,
  weather VARCHAR(20),
  high_temp INTEGER,
  low_temp INTEGER
);