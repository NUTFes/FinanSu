SET character_set_client = utf8mb4;
SET character_set_connection  = utf8mb4;
SET character_set_results = utf8mb4;

ALTER TABLE purchase_reports ADD buyer varchar(255) DEFAULT "" AFTER remark;
