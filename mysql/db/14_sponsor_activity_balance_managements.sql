USE finansu_db;

CREATE TABLE sponsor_activity_balance_managements (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    sponsor_activity_id INT(10) UNSIGNED NOT NULL,
    income_expenditure_management_id INT(10) UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY sponsor_activity_id_foreign_key (sponsor_activity_id) REFERENCES activities (id) ON DELETE CASCADE,
    FOREIGN KEY income_expenditure_management_id_foreign_key (income_expenditure_management_id) REFERENCES income_expenditure_managements (id) ON DELETE CASCADE
);
