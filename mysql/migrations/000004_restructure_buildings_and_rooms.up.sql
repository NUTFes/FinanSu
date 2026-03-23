-- buildings / rooms の再設計（000001 比）
--
-- 運用前提: 本番・開発とも、マイグレーション後にシード（mysql/seed/...）を新スキーマ向けに更新して投入する。
-- 段階的な二重書き込み期間は設けない。
--
-- buildingsテーブルにunit_numberカラムを追加
ALTER TABLE buildings ADD COLUMN unit_number TINYINT UNSIGNED NOT NULL DEFAULT 0;

-- room系マスタはシードで再投入する前提で空にする
TRUNCATE TABLE room_teachers;
TRUNCATE TABLE rooms;

-- roomsテーブルの構造変更の準備
ALTER TABLE rooms ADD COLUMN building_id INT(10) UNSIGNED NOT NULL;
ALTER TABLE rooms ADD COLUMN floor_number VARCHAR(255) NOT NULL;

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
