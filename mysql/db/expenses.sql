use finansu_db;

CREATE TABLE expenses (
  id int(10) unsigned not null auto_increment,
  expense_name varchar(255) not null,
  totalPrice int(10) default 0,
  yearID int(10),
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (id)
);

INSERT into expenses (expense_name,yearID) values ("企画局",2);
INSERT into expenses (expense_name,yearID) values ("総務局",2);
INSERT into expenses (expense_name,yearID) values ("情報局",2);
INSERT into expenses (expense_name,yearID) values ("制作局",2);
INSERT into expenses (expense_name,yearID) values ("渉外局",2);
INSERT into expenses (expense_name,yearID) values ("財務局",2);
INSERT into expenses (expense_name,yearID) values ("本部運営費",2);
INSERT into expenses (expense_name,yearID) values ("備品整備費",2);
INSERT into expenses (expense_name,yearID) values ("備品整備準備費",2);
INSERT into expenses (expense_name,yearID) values ("翌年度繰越金",2);


-- 終端文字の変更
DELIMITER //
-- ストアドプロシージャ作成
CREATE PROCEDURE updateExpense()
BEGIN

-- 1 テンポラリテーブル作成tmp,tmp
CREATE TEMPORARY TABLE tmp (
  id int(10) NOT NULL,
  totalPrice int(10),
  purchase_reports_id int(10),
  addition int(10),
  discount int(10),
  expense_id int(10),
  finance_check boolean,
  PRIMARY KEY (`id`)
);

CREATE TEMPORARY TABLE tmp2 (
  id int(10) NOT NULL,
  totalPrice int(10) NOT NULL,
  PRIMARY KEY (`id`)
);

-- 2 mpにpurchase_itemsのfinansu_checkがtrueのものをpurchase_orderごとに和を入れる
INSERT INTO
	tmp(id,totalPrice)
SELECT 
	pi.purchase_order_id,
	SUM(pi.price * pi.quantity)
FROM
	purchase_items pi
WHERE
	pi.finance_check IS true
GROUP BY
	pi.purchase_order_id;

-- 3 tmpにpurhchase_reportsのデータを入れる
UPDATE
	tmp
INNER JOIN
	purchase_reports pr
ON
	tmp.id = pr.purchase_order_id
SET
	tmp.purchase_reports_id = pr.id,
	tmp.addition = pr.addition,
	tmp.discount = pr.discount,
	tmp.finance_check = pr.finance_check;

-- tmpにpurchaser_ordersのexpense_idを入れる
UPDATE
	tmp
INNER JOIN
	purchase_orders po
ON
	tmp.id = po.id
SET
	tmp.expense_id = po.expense_id
WHERE
	po.finance_check IS true;

-- expense_idがNULLのレコードを削除する
DELETE FROM tmp WHERE expense_id IS NULL;

-- tmpのデータをexpense_idごとにまとめて総和を求める、データをtmp2に入れる
INSERT INTO
	tmp2(id, totalPrice)
SELECT
	tmp.expense_id,
	SUM(tmp.totalPrice + tmp.addition - tmp.discount)
FROM
	tmp
WHERE
	tmp.finance_check IS true
GROUP BY
	tmp.expense_id;

-- tmp2のデータをexpeneseに入れる
UPDATE
	expenses
INNER JOIN
	tmp2
ON
	expenses.id = tmp2.id
SET
	expenses.totalPrice = tmp2.totalPrice;

-- tmp2のidがNULLのexpensesのtotalPriceを0にする
UPDATE
	expenses
LEFT JOIN 
	tmp2
ON
	expenses.id = tmp2.id
SET
	expenses.totalPrice = 0
WHERE
	tmp2.id IS NULL;

-- テンポラリテーブル削除
DROP TEMPORARY TABLE tmp,tmp2;

END;
//

-- 終端文字戻す 
DELIMITER ;
