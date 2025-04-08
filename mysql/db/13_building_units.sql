use finansu_db

CREATE TABLE building_units(
  id int(10) unsigned not null auto_increment,
  building_id int(10) unsigned not null default 1,
  unit_number varchar(255) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (building_id) REFERENCES buildings(id)
);

INSERT INTO building_units (id, unit_number) VALUES (1, "1号棟");
INSERT INTO building_units (id, unit_number) VALUES (2, "2号棟");
INSERT INTO building_units (id, unit_number) VALUES (3, "3号棟");
