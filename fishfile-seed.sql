INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'alex@gmail.com',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'alexadmin@gmail.com',
        TRUE);

INSERT INTO rivers (id, name, dec_lat, dec_long)
VALUES (09038500, 
        'WILLIAMS FORK BELOW WILLIAMS FORK RESERVOIR CO', 
        40.03592778, 
        -106.2050139),
       (13022500, 
        'SNAKE RIVER ABOVE RESERVOIR, NEAR ALPINE, WY', 
        43.1961111, 
        -110.8894444);

INSERT INTO users_rivers (username, river_id)
VALUES ('testuser'
        09038500),
        ('testuser'
        13022500),
       ('testadmin'
        09038500),
        ('testadmin'
        13022500);

INSERT INTO records (username, river_id, date, rating, description, flow, weather, high_temp, low_temp)
VALUES ('testuser',
        09038500, 
        08-20-2021, 
        6,
        'Beautiful sunny day. Caught four rainbows out of a technical section with tons of boulders and eddie lines. A couple of them pushing 16 inches. Black caddis were the hot fly.', 
        45.7,
        'Sunny',
        83,
        51),
        ('testadmin',
        13022500,
        09-25-2021,
        8,
        'Fishing was amazing in the morning. Lots of cutties going after the sculpzillas. The black/purple Amys Ant to a olive wd-40 dropper was also having tons of success as the day warmed up and the wind picked up a bit.'
        3400,
        'Partly Cloudy',
        69,
        34);