CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  name TEXT NOT NULL,
  usgs_id VARCHAR(20),
  dec_lat NUMERIC,
  dec_long NUMERIC,
  fish TEXT,
  favorite BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  location_id INTEGER REFERENCES locations ON DELETE CASCADE,
  date DATE NOT NULL,
  rating INTEGER CHECK (rating >= 0) CHECK (rating <= 10),
  description TEXT,
  flies TEXT, 
  flow NUMERIC,
  water_temp NUMERIC CHECK (water_temp >= 30) CHECK (water_temp <= 100),
  pressure NUMERIC CHECK (pressure >= 26) CHECK (pressure <= 32),
  weather VARCHAR(20),
  high_temp INTEGER CHECK (high_temp >= -40) CHECK (high_temp <= 120),
  low_temp INTEGER CHECK (low_temp >= -40) CHECK (low_temp <= 120)
);