use finansu_db
CREATE TABLE
  building_units (
    id int(10) unsigned not null auto_increment,
    building_id int(10) unsigned not null default 1,
    unit_number varchar(255) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id),
    FOREIGN KEY (building_id) REFERENCES buildings (id)
  );

INSERT INTO
  building_units (building_id, unit_number)
VALUES
  (1, "1号棟"),
  (1, "2号棟"),
  (1, "3号棟"),
  (2, "1号棟"),
  (2, "2号棟"),
  (3, "1号棟"),
  (4, "1号棟"),
  (5, "1号棟"),
  (5, "2号棟"),
  (6, "1号棟"),
  (7, "1号棟"),
  (8, "1号棟"),
  (9, "1号棟"),
  (10, "1号棟"),
  (11, "1号棟"),
  (12, "1号棟"),
  (13, "1号棟");
