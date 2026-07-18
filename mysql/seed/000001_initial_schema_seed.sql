-- TODO: シードを整理する
use finansu_db;

-- yearを挿入
INSERT INTO
    years (year)
VALUES
    (2025),
    (2026);

INSERT INTO
    year_periods (year_id, started_at, ended_at)
VALUES
    (1, '2024-12-15 00:00:00', '2025-12-15 00:00:00'),
    (2, '2025-12-15 00:00:00', '2026-12-15 00:00:00');

-- ユーザーを一括で挿入
INSERT INTO
    users (name, bureau_id, role_id)
VALUES
    -- 一般ユーザー
    ('技大太郎1', 1, 1),
    -- 管理者ユーザー
    ('技大太郎2', 6, 2),
    -- 財務局長
    ('技大太郎3', 3, 3),
    -- 財務局員
    ('技大太郎4', 3, 4);

INSERT INTO
    financial_records (name, year_id)
VALUES
    ('総務局', 1),
    ('渉外局', 1),
    ('情報局', 2),
    ('企画局', 2);

INSERT INTO
    divisions (name, financial_record_id)
VALUES
    ('衛生管理部門', 1),
    ('国際部門', 1),
    ('広報部門', 2),
    ('ゲスト部門', 2),
    ('GM2', 3),
    ('FinanSu', 3),
    ('お化け屋敷部門', 4),
    ('ステージ部門', 4);

INSERT INTO
    festival_items (name, memo, division_id)
VALUES
    ('農ポリ', '', 1),
    ('養生テープ', '', 1),
    ('ラミ', '', 2),
    ('広報物郵送費', '', 3),
    ('折込チラシ用費', '', 3),
    ('ゲストブッキング費', '', 4),
    ('ルーター', '', 5),
    ('サーバー', '', 5),
    ('ドメイン代', '', 6),
    ('人件費', '', 7),
    ('人件費', '', 8),
    ('GM費', '', 5),
    ('FinanSu費', '', 6),
    ('お化け費', '', 7),
    ('ステージ費', '', 8); 

INSERT INTO
    item_budgets (amount, festival_item_id)
VALUES
    (10000, 1),
    (10000, 2),
    (10000, 3),
    (20000, 4),
    (50000, 5),
    (1500000, 6),
    (10000, 7),
    (20000, 8),
    (3000, 9),
    (50000, 10),
    (50000, 11),
    (1000, 12),
    (2000, 13),
    (4000, 14),
    (8000, 15);

INSERT INTO
    user_groups (user_id, group_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (1, 8),
    (2, 5),
    (2, 6),
    (1, 7);

INSERT INTO
    buy_reports (festival_item_id, amount, memo, paid_by, paid_by_user_id)
VALUES
    (1, 5000, '', '技大太郎1', 1),
    (1, 4000, '', '技大太郎1', 1),
    (2, 5000, '', '技大太郎1', 1),
    (3, 2000, '', '技大太郎2', 2),
    (3, 2000, '', '技大太郎2', 2),
    (3, 2000, '', '技大太郎2', 2),
    (4, 10000, '', '技大太郎3', 3),
    (7, 2000, '', '技大太郎2', 2),
    (7, 3000, '', '技大太郎2', 2),
    (8, 20000, '', '技大太郎2', 2), 
    (10, 50000, '', '技大太郎1', 1),
    (13, 1000, '', '技大太郎2', 2),
    (14, 2000, '', '技大太郎1', 1),
    (15, 1000, '', '技大太郎1', 1),
    (15, 2000, '', '技大太郎1', 1);

INSERT INTO
    payment_receipts (buy_report_id, bucket_name, file_name, file_type, remark)
VALUES
    (1, 'payment-receipts', 'receipt-1.jpg', 'image/jpeg', ''),
    (2, 'payment-receipts', 'receipt-2.jpg', 'image/jpeg', ''),
    (3, 'payment-receipts', 'receipt-3.jpg', 'image/jpeg', ''),
    (4, 'payment-receipts', 'receipt-4.jpg', 'image/jpeg', ''),
    (5, 'payment-receipts', 'receipt-5.jpg', 'image/jpeg', ''),
    (6, 'payment-receipts', 'receipt-6.jpg', 'image/jpeg', ''),
    (7, 'payment-receipts', 'receipt-7.jpg', 'image/jpeg', ''),
    (8, 'payment-receipts', 'receipt-8.jpg', 'image/jpeg', ''),
    (9, 'payment-receipts', 'receipt-9.jpg', 'image/jpeg', ''),
    (10, 'payment-receipts', 'receipt-10.jpg', 'image/jpeg', ''),
    (11, 'payment-receipts', 'receipt-11.jpg', 'image/jpeg', ''),
    (12, 'payment-receipts', 'receipt-12.jpg', 'image/jpeg', ''),
    (13, 'payment-receipts', 'receipt-13.jpg', 'image/jpeg', ''),
    (14, 'payment-receipts', 'receipt-14.jpg', 'image/jpeg', ''),
    (15, 'payment-receipts', 'receipt-15.jpg', 'image/jpeg', '');

INSERT INTO
    buy_statuses (buy_report_id, is_packed, is_settled)
VALUES
    (1, TRUE, TRUE),
    (2, TRUE, FALSE),
    (3, TRUE, FALSE),
    (4, FALSE, FALSE),
    (5, FALSE, FALSE),
    (6, TRUE, FALSE),
    (7, FALSE, FALSE),
    (8, TRUE, FALSE),
    (9, FALSE, FALSE),
    (10, TRUE, TRUE),
    (11, TRUE, TRUE),
    (12, FALSE, FALSE),
    (13, TRUE, TRUE),
    (14, TRUE, FALSE),
    (15, TRUE, FALSE);

INSERT INTO
    income_expenditure_managements (amount, log_category, year_id, receive_option, is_checked, created_at, updated_at)
VALUES
    (50000, "income", 1, "hand", FALSE, NOW(), NOW()),
    (100000, "sponsor's income", 1, "transfer", FALSE, NOW(), NOW()),
    (5000, "expenditure", 1, NULL, FALSE, NOW(), NOW()),
    (4000, "expenditure", 1, NULL, FALSE, NOW(), NOW()),
    (5000, "expenditure", 1, NULL, FALSE, NOW(), NOW()),
    (2000, "expenditure", 1, NULL, FALSE, NOW(), NOW()),
    (2000, "expenditure", 1, NULL, FALSE, NOW(), NOW()),
    (2000, "expenditure", 1, NULL, FALSE, NOW(), NOW()),
    (10000, "expenditure", 1, NULL, FALSE, NOW(), NOW()),
    (20000, "expenditure", 2, NULL, FALSE, NOW(), NOW()),
    (50000, "expenditure", 2, NULL, FALSE, NOW(), NOW()),
    (2000, "expenditure", 2, NULL, FALSE, NOW(), NOW()),
    (100000, "sponsor's income", 2, "transfer", FALSE, NOW(), NOW());

INSERT INTO
    buy_report_income_expenditure_managements (buy_report_id, income_expenditure_management_id, created_at, updated_at)
VALUES
    (1, 3, NOW(), NOW()), -- buy_reports.id: 1 と income_expenditure_managements.id: 3 の対応
    (2, 4, NOW(), NOW()), -- buy_reports.id: 2 と income_expenditure_managements.id: 4 の対応
    (3, 5, NOW(), NOW()), -- buy_reports.id: 3 と income_expenditure_managements.id: 5 の対応
    (4, 6, NOW(), NOW()), -- buy_reports.id: 4 と income_expenditure_managements.id: 6 の対応
    (5, 7, NOW(), NOW()), -- buy_reports.id: 5 と income_expenditure_managements.id: 7 の対応
    (6, 8, NOW(), NOW()), -- buy_reports.id: 6 と income_expenditure_managements.id: 8 の対応
    (7, 9, NOW(), NOW()),
    (10, 10, NOW(), NOW()),
    (11, 11, NOW(), NOW()),
    (13, 12, NOW(), NOW());

INSERT INTO
    activities (user_id, is_done, sponsor_id, feature, expense, remark, design, url)
VALUES
    (1, false, 1, "なし", 11, "", 1, ""),
    (2, false, 2, "クーポン", 22, "味玉or大盛無料", 1, "");

INSERT INTO
    activity_styles (activity_id, sponsor_style_id)
VALUES
    (1, 1),
    (2, 2),
    (1, 2),
    (2, 1);

INSERT INTO
    bureaus (name)
VALUES
    ('総務局'),
    ('渉外局'),
    ('財務局'),
    ('企画局'),
    ('制作局'),
    ('情報局'),
    ('産学局');

INSERT INTO
    departments (name)
VALUES
    ('電気電子情報'),
    ('物質生物'),
    ('機械創造'),
    ('環境社会基盤'),
    ('情報・経営システム'),
    ('基盤共通教育'),
    ('原子力システム安全'),
    ('技術科学イノベーション'),
    ('システム安全'),
    ('技術支援'),
    ('その他'),
    ('学長・事務'),
    ('FL');

INSERT INTO
    mail_auth (email, password, user_id)
VALUES
    ("test1@example.com", "$2a$10$vtmStGYxc8/HdhBYJWyztOMrdpw1QaKxsuGdi72i8iqeyp.1997ke", 1),
    ("test2@example.com", "$2a$10$vtmStGYxc8/HdhBYJWyztOMrdpw1QaKxsuGdi72i8iqeyp.1997ke", 2),
    ("test3@example.com", "$2a$10$vtmStGYxc8/HdhBYJWyztOMrdpw1QaKxsuGdi72i8iqeyp.1997ke", 3),
    ("test4@example.com", "$2a$10$vtmStGYxc8/HdhBYJWyztOMrdpw1QaKxsuGdi72i8iqeyp.1997ke", 4);

INSERT INTO
    roles (name)
VALUES
    ('user'),
    ('admin'),
    ('Finance Director'),
    ('Finance Staff');

INSERT INTO
    sponsor_styles (style, feature, price)
VALUES
    ('8分の1', 'モノクロ', 3000),
    ('8分の1', 'カラー', 5000),
    ('4分の1', 'モノクロ', 8000),
    ('4分の1', 'カラー', 10000),
    ('2分の1', 'モノクロ', 12000),
    ('2分の1', 'カラー', 15000),
    ('1ページ', 'モノクロ', 20000),
    ('2ページ', 'カラー', 30000),
    ('企業ブース', 'なし', 30000);

-- カラムがそろってないので一旦コメントアウト
/*
INSERT INTO
    teachers (name, position, department_id, room, is_black, remark)
VALUES
    ('test-name', 'test-position', 1, '605', false, 'test-remark'),
    ('test-teacher', 'test-position2', 1, '605', false, 'test-remark');
*/


INSERT INTO
    incomes (name, created_at, updated_at)
VALUES
    ("教育振興会費", NOW(), NOW()),
    ("学内募金", NOW(), NOW()),
    ("同窓会費", NOW(), NOW()),
    ("雑収入", NOW(), NOW()),
    ("繰越金", NOW(), NOW()),
    ("企業協賛金", NOW(), NOW());

INSERT INTO
    income_income_expenditure_managements (income_expenditure_id, income_id, created_at, updated_at)
VALUES
    (1, 4, NOW(), NOW()),
    (2, 6, NOW(), NOW());

INSERT INTO
    buildings (name, unit_number, group_key)
VALUES
    ('機械・建設棟', 1, 'mechanical_civil_engineering'),
    ('機械・建設棟', 2, 'mechanical_civil_engineering'),
    ('機械・建設棟', 3, 'mechanical_civil_engineering'),
    ('電気棟', 1, 'electrical_engineering'),
    ('電気棟', 2, 'electrical_engineering'),
    ('生物棟', 1, 'biology'),
    ('環境・システム棟', 1, 'environmental_system'),
    ('物質・材料経営情報棟', 1, 'materials_management_information'),
    ('物質・材料経営情報棟', 2, 'materials_management_information'),
    ('総合研究棟', 1, 'general_research'),
    ('原子力・システム安全棟', 1, 'nuclear_system_safety'),
    ('事務局棟', 1, 'administration'),
    ('極限エネルギ密度工学研究センター', 1, 'extreme_energy_density_research_center'),
    ('工作センター', 1, 'machine_shop'),
    ('大型実験棟', 1, 'large_experiment'),
    ('分析計測センター', 1, 'analysis_instrumentation_center'),
    ('その他', 1, 'other');


-- sponsor を追加
INSERT INTO
    sponsors (name, tel, email, address, representative, created_at, updated_at)
VALUES
    ('株式会社test', '03-1234-5678', 'test@example.com', '新潟県', 'test 太郎1', '2025-03-10 10:00:00', '2025-03-10 10:00:00'),
    ('test物流株式会社', '03-2345-6789', 'test@logistics.example.com', '新潟県', 'test 太郎2', '2025-09-22 11:30:00', '2025-09-22 11:30:00'),
    ('testクリエイト株式会社', '03-3456-7890', 'test@next-create.example.com', '新潟県', 'test 太郎3', '2026-02-14 09:15:00', '2026-02-14 09:15:00'),
    ('test企画合同会社', '03-4567-8901', 'contact@test-planning.example.com', '新潟県', 'test 太郎4', '2026-08-01 14:45:00', '2026-08-01 14:45:00');

-- sponsor_style を追加
INSERT INTO
    sponsorship_activities (year_periods_id, sponsor_id, user_id, activity_status, feasibility_status, design_progress, remarks)
VALUES
    (1, 1, 3, 'rejected', 'impossible', 'unstarted', '見送り'),
    (1, 2, 2, 'receipt_sent', 'possible', 'completed', 'すべてが終わり'),
    (2, 3, 3, 'confirmed', 'possible', 'unstarted', '請求書送付まで完了'),
    (2, 4, 2, 'material_sent', 'unstarted', 'unstarted', '資料送付済み');

-- activity_sponsor_style_links を追加
INSERT INTO
    activity_sponsor_style_links (sponsorship_activity_id, sponsor_style_id, category)
VALUES
    (2, 1, 'money'),
    (2, 2, 'money'),
    (3, 6, 'goods'),
    (3, 4, 'money');
