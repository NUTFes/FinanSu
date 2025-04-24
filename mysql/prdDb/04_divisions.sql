USE finansu_db;

CREATE TABLE
    divisions (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        financial_record_id INT(10) UNSIGNED NOT NULL,
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
    ('参加団体部門', 1),
    ('会場電力部門', 1),
    ('物品管理部門', 1),
    ('衛生管理部門', 1),
    ('国際団体部門', 1),
    -- 渉外局
    ('広報部門', 2),
    ('企業協賛部門', 2),
    ('ゲスト部門', 2),
    ('地域・他大学誘致部門', 2),
    -- 企画局
    ('クイズ大会部門', 3),
    ('グルメグランプリ部門', 3),
    ('コンテスト部門', 3),
    ('スタンプラリー部門', 3),
    ('ビンゴ部門', 3),
    ('WS部門', 3),
    ('縁日部門', 3),
    ('手筒花火部門', 3),
    ('謎解き部門', 3),
    ('お化け屋敷部門', 3),
    ('ヒーローショー部門', 3),
    ('オープニング企画部門', 3),
    ('新入生企画部門', 3),
    ('レントオール新潟部門', 3),
    -- 制作局
    ('パンフレット部門', 4),
    ('総務・企画局窓口部門', 4),
    ('渉外局窓口部門', 4),
    ('校内・校外装飾部門', 4),
    ('制作局全体部門', 4),
    -- 財務局
    ('収支管理部門', 5),
    ('技大祭物販テント部門', 5),
    ('副局長部門', 5),
    -- 情報
    ('GM3部門', 6),
    ('FinanSu部門', 6),
    ('SeeFT部門', 6),
    ('HP部門', 6),
    ('Seeds部門', 6),
    ('Bingo部門', 6),
    ('DSチーム', 6),
    ('デザインチーム', 6),
    ('インフラチーム', 6);
