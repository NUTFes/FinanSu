use finansu_db;

CREATE TABLE
  departments (
    id int(10) unsigned not null auto_increment,
    name varchar(255),
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

INSERT INTO
  departments (name)
VALUES
  ('電気電子情報'),
  ('物質生物'),
  ('機械創造'),
  ('環境社会基盤'),
  ('情報・経営システム'),
  ('基盤共通教育'),
  ('原子力システム安全'),
  ('技術科学イノベーション'),
  ('システム安全'),
  ('技術支援'),
  ('その他'),
  ('学長・事務'),
  ('FL');
