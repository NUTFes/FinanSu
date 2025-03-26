use finansu_db;

CREATE TABLE roles (
    id int(10) unsigned not null auto_increment,
    name varchar(255) not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
);

INSERT into roles (name) values ('user');
INSERT into roles (name) values ('admin');
INSERT into roles (name) values ('Finance Director');
INSERT into roles (name) values ('Finance Staff');