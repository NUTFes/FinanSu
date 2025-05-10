#!/bin/bash

# エラーが発生したらスクリプトを終了
set -e

# MySQL接続情報
MYSQL_USER="$MYSQL_USER"
MYSQL_PASSWORD="$MYSQL_PASSWORD"
MYSQL_DATABASE="$MYSQL_DATABASE"

# ストアドプロシージャを作成
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" <<EOF
DELIMITER //

CREATE PROCEDURE updateExpense()
BEGIN
    -- テンポラリテーブル作成
    CREATE TEMPORARY TABLE tmp (
        id INT NOT NULL,
        totalPrice INT,
        purchase_reports_id INT,
        addition INT,
        discount INT,
        expense_id INT,
        finance_check BOOLEAN,
        PRIMARY KEY (id)
    );

    CREATE TEMPORARY TABLE tmp2 (
        id INT NOT NULL,
        totalPrice INT NOT NULL,
        PRIMARY KEY (id)
    );

    -- データ操作
    INSERT INTO tmp (id, totalPrice)
    SELECT pi.purchase_order_id, SUM(pi.price * pi.quantity)
    FROM purchase_items pi
    WHERE pi.finance_check IS TRUE
    GROUP BY pi.purchase_order_id;

    UPDATE tmp
    INNER JOIN purchase_reports pr ON tmp.id = pr.purchase_order_id
    SET tmp.purchase_reports_id = pr.id,
        tmp.addition = pr.addition,
        tmp.discount = pr.discount,
        tmp.finance_check = pr.finance_check;

    UPDATE tmp
    INNER JOIN purchase_orders po ON tmp.id = po.id
    SET tmp.expense_id = po.expense_id
    WHERE po.finance_check IS TRUE;

    DELETE FROM tmp
    WHERE expense_id IS NULL;

    INSERT INTO tmp2 (id, totalPrice)
    SELECT tmp.expense_id,
           SUM(tmp.totalPrice + tmp.addition - tmp.discount)
    FROM tmp
    WHERE tmp.finance_check IS TRUE
    GROUP BY tmp.expense_id;

    UPDATE expenses
    INNER JOIN tmp2 ON expenses.id = tmp2.id
    SET expenses.totalPrice = tmp2.totalPrice;

    UPDATE expenses
    LEFT JOIN tmp2 ON expenses.id = tmp2.id
    SET expenses.totalPrice = 0
    WHERE tmp2.id IS NULL;

    -- テンポラリテーブル削除
    DROP TEMPORARY TABLE tmp, tmp2;
END;
//

DELIMITER ;
EOF

echo "ストアドプロシージャを作成"