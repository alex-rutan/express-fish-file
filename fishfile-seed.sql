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

INSERT INTO locations (username, name, usgs_id, dec_lat, dec_long, fish)
VALUES  ('testuser',
        'Williams Fork',
        '09038500',  
        40.03592778, 
        -106.2050139,
        'Brown Trout, Rainbow Trout'),
        ('testuser', 
        'Snake River - Jackson',
        '13022500', 
        43.1961111, 
        -110.8894444,
        'Cutthroat Trout, Rainbow Trout, Brown Trout'),
        ('testadmin',
        'Williams Fork', 
        '09038500', 
        40.03592778, 
        -106.2050139,
        'Brown Trout, Rainbow Trout'),
        ('testadmin',
        'Snake River - Jackson', 
        '13022500', 
        43.1961111, 
        -110.8894444,
        'Cutthroat Trout, Rainbow Trout, Brown Trout');

INSERT INTO records (username, location_id, date, rating, description, flies, flow, water_temp, pressure, weather, high_temp, low_temp)
VALUES ('testuser',
        1, 
        '2021-08-20', 
        6,
        'Beautiful sunny day. Caught four rainbows out of a technical section with tons of boulders and eddie lines. A couple of them pushing 16 inches. Black caddis were the hot fly.',
        'Black Caddis', 
        45.7,
        null,
        null,
        'Sunny',
        83,
        51),
        ('testadmin',
        4,
        '2021-09-25',
        8,
        'Fishing was amazing in the morning. Lots of cutties going after the sculpzillas. The black/purple Amys Ant to a olive wd-40 dropper was also having tons of success as the day warmed up and the wind picked up a bit.',
        'Sculpzilla, Amys Ant, Olive WD-40',
        3400,
        null,
        null,
        'Partly Cloudy',
        69,
        34);