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
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  dec_lat NUMERIC,
  dec_long NUMERIC
);

CREATE TABLE user_rivers (
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  river_id INTEGER REFERENCES rivers ON DELETE CASCADE,
  PRIMARY KEY (username, river_id)
)

CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  river_id INTEGER REFERENCES rivers ON DELETE CASCADE,
  date DATE NOT NULL,
  rating INTEGER CHECK (rating >= 0) CHECK (rating <= 10),
  flow NUMERIC,
  weather VARCHAR(20),
  high_temp INTEGER,
  low_temp INTEGER
);