SET character_set_client = utf8mb4;
SET character_set_connection  = utf8mb4;
SET character_set_results = utf8mb4;

ALTER TABLE activities ADD design int(10) DEFAULT 0 AFTER remark;
ALTER TABLE activities ADD url varchar(255) DEFAULT "" AFTER design;

UPDATE activities SET design = 1 WHERE remark LIKE  '%<デザイン作成> 学生が作成%';
UPDATE activities SET design = 2 WHERE remark LIKE  '%<デザイン作成> 企業が作成%';
UPDATE activities SET design = 3 WHERE remark LIKE  '%<デザイン作成> 去年のものを使用%';
