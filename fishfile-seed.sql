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

INSERT INTO records (river_id, date, rating, flow, weather, high_temp, low_temp)
VALUES (09038500, 
        08-20-2021, 
        6, 
        3400,
        'Sunny',
        83,
        51),
        (13022500,
        10-25-2021,
        8,
        45.7,
        'Partly Cloudy',
        47,
        24);