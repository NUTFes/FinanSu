-- 建物の表示グループを明示するためのキーを追加する
ALTER TABLE buildings ADD COLUMN group_key VARCHAR(255) NOT NULL DEFAULT 'other';

UPDATE buildings SET group_key = 'mechanical_civil_engineering' WHERE name = '機械・建設棟';
UPDATE buildings SET group_key = 'electrical_engineering' WHERE name = '電気棟';
UPDATE buildings SET group_key = 'biology' WHERE name = '生物棟';
UPDATE buildings SET group_key = 'environmental_system' WHERE name = '環境・システム棟';
UPDATE buildings SET group_key = 'materials_management_information' WHERE name = '物質・材料経営情報棟';
UPDATE buildings SET group_key = 'general_research' WHERE name = '総合研究棟';
UPDATE buildings SET group_key = 'nuclear_system_safety' WHERE name = '原子力・システム安全棟';
UPDATE buildings SET group_key = 'administration' WHERE name = '事務局棟';
UPDATE buildings SET group_key = 'extreme_energy_density_research_center' WHERE name = '極限エネルギ密度工学研究センター';
UPDATE buildings SET group_key = 'machine_shop' WHERE name = '工作センター';
UPDATE buildings SET group_key = 'large_experiment' WHERE name = '大型実験棟';
UPDATE buildings SET group_key = 'analysis_instrumentation_center' WHERE name = '分析計測センター';
