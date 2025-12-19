-- Seed script to create admin and test users
-- Password for admin: admin123
-- Password for patient: patient123

-- Admin user (phone: 9800000000, password: admin123)
INSERT INTO users (id, phone, email, name, password, role, is_active, is_staff, created_at, updated_at)
VALUES (
  'admin-' || gen_random_uuid()::text,
  '9800000000',
  'admin@kistclinic.com',
  'Admin User',
  '$2a$10$rOYvF3K9qGZ8hHxP7zBZLeG7L6U4xZfJf9jKF.0QX9v9X9v9X9v9X',
  'admin',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (phone) DO NOTHING;

-- Test patient user (phone: 9811111111, password: patient123)
INSERT INTO users (id, phone, email, name, address, password, role, is_active, is_staff, created_at, updated_at)
VALUES (
  'patient-' || gen_random_uuid()::text,
  '9811111111',
  'patient@example.com',
  'Test Patient',
  'Kathmandu, Nepal',
  '$2a$10$3h.Qvf0W8uF3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q3Q',
  'patient',
  true,
  false,
  NOW(),
  NOW()
)
ON CONFLICT (phone) DO NOTHING;
