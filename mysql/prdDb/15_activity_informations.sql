use finansu_db;

CREATE TABLE
  activity_informations (
    id int(10) unsigned not null auto_increment,
    activity_id int(10),
    bucket_name varchar(255),
    file_name varchar(255),
    file_type varchar(255),
    design_progress int(10),
    file_information varchar(255),
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );
