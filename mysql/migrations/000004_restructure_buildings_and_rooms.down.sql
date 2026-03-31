-- 000004 のロールバック（旧スキーマへの復元のみ）
--
-- 方針:
-- - up で移行した rooms の行は、down では行単位で元の floor_id に戻さない。
-- - room_teachers / rooms を TRUNCATE し、building_units / floors は空で再作成する。
-- - 旧スキーマ向けのマスタデータは mysql/seed/... を再投入して復元する（本番もシード更新とセット想定）。
--
-- campus_donations に削除したカラムを復元
ALTER TABLE campus_donations ADD COLUMN remark VARCHAR(255);
ALTER TABLE campus_donations ADD COLUMN is_first_check BOOLEAN;
ALTER TABLE campus_donations ADD COLUMN is_last_check BOOLEAN;

-- rooms 参照の子から空にする
TRUNCATE TABLE room_teachers;
TRUNCATE TABLE rooms;

-- 新スキーマの外部キーとカラムを外す
ALTER TABLE rooms DROP FOREIGN KEY rooms_building_id_foreign_key;
ALTER TABLE rooms DROP COLUMN building_id;
ALTER TABLE rooms DROP COLUMN floor_number;

-- 旧テーブルを空で復元（000001_initial_schema と同形）
CREATE TABLE building_units (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    building_id INT(10) UNSIGNED NOT NULL DEFAULT 1,
    unit_number VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (building_id) REFERENCES buildings (id)
);

CREATE TABLE floors (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    building_unit_id INT(10) UNSIGNED NOT NULL,
    floor_number VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (building_unit_id) REFERENCES building_units (id)
);

-- rooms は空のため floor_id をそのまま NOT NULL で追加可能
ALTER TABLE rooms ADD COLUMN floor_id INT(10) UNSIGNED NOT NULL;
ALTER TABLE rooms ADD CONSTRAINT rooms_ibfk_1 FOREIGN KEY (floor_id) REFERENCES floors (id);

ALTER TABLE buildings DROP COLUMN unit_number;
