ALTER TABLE campus_donations
ADD UNIQUE INDEX idx_campus_donations_teacher_year (teacher_id, year_id);