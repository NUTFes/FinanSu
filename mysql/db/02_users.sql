use finansu_db;

CREATE TABLE
  users (
    id int(10) unsigned not null auto_increment,
    name varchar(255) not null,
    bureau_id int(10) not null,
    role_id int(10) not null,
    is_deleted boolean DEFAULT false,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
  );

-- ユーザーを一括で挿入
INSERT INTO
  users (name, bureau_id, role_id)
VALUES
  -- 一般ユーザー
  ('技大太郎1', 1, 1),
  -- 管理者ユーザー
  ('技大太郎2', 6, 2),
  -- 財務局長
  ('技大太郎3', 3, 3),
  -- 財務局員
  ('技大太郎4', 3, 4);
