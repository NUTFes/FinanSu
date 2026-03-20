-- buildingsテーブルにunit_numbersカラムを追加
ALTER TABLE buildings ADD COLUMN unit_numbers VARCHAR(255);

-- 既存データの移行: building_unitsのunit_numberをbuildingsのunit_numbersに移行
UPDATE buildings b
SET unit_numbers = (
    SELECT bu.unit_number
    FROM building_units bu
    WHERE bu.building_id = b.id
    LIMIT 1
);

-- roomsテーブルの構造変更の準備
-- 一時的にbuilding_idカラムを追加
ALTER TABLE rooms ADD COLUMN building_id INT(10) UNSIGNED;

-- floor_numberカラムを追加
ALTER TABLE rooms ADD COLUMN floor_number VARCHAR(255);

-- 既存データの移行: floorsのfloor_numberとbuilding情報をroomsに移行
UPDATE rooms r
JOIN floors f ON r.floor_id = f.id
JOIN building_units bu ON f.building_unit_id = bu.id
SET 
    r.building_id = bu.building_id,
    r.floor_number = f.floor_number;

-- roomsテーブルのbuilding_idにNOT NULL制約を追加
ALTER TABLE rooms MODIFY COLUMN building_id INT(10) UNSIGNED NOT NULL;

-- roomsテーブルのfloor_numberにNOT NULL制約を追加
ALTER TABLE rooms MODIFY COLUMN floor_number VARCHAR(255) NOT NULL;

-- 新しい外部キー制約を追加
ALTER TABLE rooms ADD CONSTRAINT rooms_building_id_foreign_key 
    FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE CASCADE;

-- 古い外部キー制約を削除
ALTER TABLE rooms DROP FOREIGN KEY rooms_ibfk_1;

-- floor_idカラムを削除
ALTER TABLE rooms DROP COLUMN floor_id;

-- floorsテーブルを削除（外部キー制約があるため先にroom_teachersは影響なし）
DROP TABLE floors;

-- building_unitsテーブルを削除
DROP TABLE building_units;

-- campus_donationsテーブルから不要なカラムを削除
ALTER TABLE campus_donations DROP COLUMN is_last_check;
ALTER TABLE campus_donations DROP COLUMN is_first_check;
ALTER TABLE campus_donations DROP COLUMN remark;