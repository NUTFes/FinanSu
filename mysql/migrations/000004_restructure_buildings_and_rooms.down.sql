-- campus_donationsテーブルに削除したカラムを復元
ALTER TABLE campus_donations ADD COLUMN remark VARCHAR(255);
ALTER TABLE campus_donations ADD COLUMN is_first_check BOOLEAN;
ALTER TABLE campus_donations ADD COLUMN is_last_check BOOLEAN;

-- building_unitsテーブルを復元
CREATE TABLE building_units (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    building_id INT(10) UNSIGNED NOT NULL DEFAULT 1,
    unit_number VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (building_id) REFERENCES buildings (id)
);

-- floorsテーブルを復元
CREATE TABLE floors (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    building_unit_id INT(10) UNSIGNED NOT NULL,
    floor_number VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (building_unit_id) REFERENCES building_units (id)
);

-- roomsテーブルにfloor_idカラムを復元
ALTER TABLE rooms ADD COLUMN floor_id INT(10) UNSIGNED;

-- 既存のbuilding_idからbuilding_unitsとfloorsにデータを復元
-- まずbuilding_unitsにデータを挿入
INSERT INTO building_units (building_id, unit_number, created_at, updated_at)
SELECT DISTINCT 
    b.id,
    COALESCE(b.unit_numbers, '1'),
    NOW(),
    NOW()
FROM buildings b
WHERE b.unit_numbers IS NOT NULL;

-- floorsにデータを挿入
INSERT INTO floors (building_unit_id, floor_number, created_at, updated_at)
SELECT DISTINCT
    bu.id,
    r.floor_number,
    NOW(),
    NOW()
FROM rooms r
JOIN buildings b ON r.building_id = b.id
JOIN building_units bu ON bu.building_id = b.id
WHERE r.floor_number IS NOT NULL;

-- roomsのfloor_idを更新
UPDATE rooms r
JOIN buildings b ON r.building_id = b.id
JOIN building_units bu ON bu.building_id = b.id
JOIN floors f ON f.building_unit_id = bu.id AND f.floor_number = r.floor_number
SET r.floor_id = f.id;

-- floor_idにNOT NULL制約を追加
ALTER TABLE rooms MODIFY COLUMN floor_id INT(10) UNSIGNED NOT NULL;

-- 古い外部キー制約を追加
ALTER TABLE rooms ADD CONSTRAINT rooms_ibfk_1 
    FOREIGN KEY (floor_id) REFERENCES floors (id);

-- 新しい外部キー制約を削除
ALTER TABLE rooms DROP FOREIGN KEY rooms_building_id_foreign_key;

-- 追加したカラムを削除
ALTER TABLE rooms DROP COLUMN building_id;
ALTER TABLE rooms DROP COLUMN floor_number;

-- buildingsテーブルからunit_numbersカラムを削除
ALTER TABLE buildings DROP COLUMN unit_numbers;