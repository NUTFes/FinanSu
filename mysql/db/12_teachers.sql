use finansu_db;

   CREATE TABLE teachers (
          id int (10) unsigned not null auto_increment,
          name varchar(255) not null,
          position varchar(255) not null,
          department_id int (10),
          building_id int (10),
          is_black boolean,
          remark varchar(255),
          is_deleted boolean default false,
          created_at datetime not null default current_timestamp,
          updated_at datetime not null default current_timestamp on update current_timestamp,
          PRIMARY KEY (id)
          );

   INSERT into teachers (name, position, department_id, building_id, is_black, remark)
   values ('test-name', 'test-position', 1, 1, false, "test-remark");

   INSERT into teachers (name, position, department_id, building_id, is_black, remark)
   values ('test-teacher', 'test-position2', 1, 1, false, "test-remark");
