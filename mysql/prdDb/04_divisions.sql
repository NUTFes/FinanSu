USE finansu_db;

CREATE TABLE
    divisions (
        id INT (10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        financial_record_id INT (10) UNSIGNED NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY financial_record_id_foreign_key (financial_record_id) REFERENCES financial_records (id) ON DELETE CASCADE
    );

-- データを一括で挿入
INSERT INTO
    divisions (name, financial_record_id)
VALUES
    -- 総務局
    ('参加団体部門', 1), -- divisions.id = 1
    ('会場電力部門', 1), -- divisions.id = 2
    ('物品管理部門', 1), -- divisions.id = 3
    ('衛生管理部門', 1), -- divisions.id = 4
    ('国際団体部門', 1), -- divisions.id = 5
    -- 渉外局
    ('広報部門', 2), -- divisions.id = 6
    ('企業協賛部門', 2), -- divisions.id = 7
    ('ゲスト部門', 2), -- divisions.id = 8
    ('地域・他大学誘致部門', 2), -- divisions.id = 9
    -- 企画局
    ('クイズ大会部門', 3), -- divisions.id = 10
    ('グルメグランプリ部門', 3), -- divisions.id = 11
    ('コンテスト部門', 3), -- divisions.id = 12
    ('スタンプラリー部門', 3), -- divisions.id = 13
    ('ビンゴ部門', 3), -- divisions.id = 14
    ('WS部門', 3), -- divisions.id = 15
    ('縁日部門', 3), -- divisions.id = 16
    ('手筒花火部門', 3), -- divisions.id = 17
    ('謎解き部門', 3), -- divisions.id = 18
    ('お化け屋敷部門', 3), -- divisions.id = 19
    ('ヒーローショー部門', 3), -- divisions.id = 20
    ('オープニング企画部門', 3), -- divisions.id = 21
    ('新入生企画部門', 3), -- divisions.id = 22
    ('レントオール新潟部門', 3), -- divisions.id = 23
    -- 制作局
    ('パンフレット部門', 4), -- divisions.id = 24
    ('総務・企画局窓口部門', 4), -- divisions.id = 25
    ('渉外局窓口部門', 4), -- divisions.id = 26
    ('校内・校外装飾部門', 4), -- divisions.id = 27
    ('制作局全体部門', 4), -- divisions.id = 28
    -- 財務局
    ('収支管理部門', 5), -- divisions.id = 29
    ('技大祭物販テント部門', 5), -- divisions.id = 30
    ('副局長部門', 5), -- divisions.id = 31
    -- 情報局
    ('GM3部門', 6), -- divisions.id = 32
    ('FinanSu部門', 6), -- divisions.id = 33
    ('SeeFT部門', 6), -- divisions.id = 34
    ('HP部門', 6), -- divisions.id = 35
    ('Seeds部門', 6), -- divisions.id = 36
    ('Bingo部門', 6), -- divisions.id = 37
    ('DSチーム', 6), -- divisions.id = 38
    ('デザインチーム', 6), -- divisions.id = 39
    ('インフラチーム', 6);

-- divisions.id = 40
