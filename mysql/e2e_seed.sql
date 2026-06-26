USE finansu_db;

INSERT INTO bureaus (id, name)
VALUES (1, '総務局');

INSERT INTO roles (id, name)
VALUES (1, 'user');

INSERT INTO years (id, year)
VALUES (1, 2025);

INSERT INTO year_periods (year_id, started_at, ended_at)
VALUES (1, '2024-11-15 00:00:00', '2025-11-15 00:00:00');
