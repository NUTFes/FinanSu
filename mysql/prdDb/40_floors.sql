use finansu_db
CREATE TABLE
  floors (
    id int(10) unsigned not null auto_increment,
    building_unit_id int(10) unsigned not null,
    floor_number varchar(255) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id),
    FOREIGN KEY (building_unit_id) REFERENCES building_units (id)
  );
