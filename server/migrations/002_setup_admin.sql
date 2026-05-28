-- Admin User Setup
-- Email: admin7173@gmail.com
-- Password: zaid1234
-- Bcrypt hash of "zaid1234": $2a$10$eImiTXuWVxfaHNAVIqlFe.nJF7QJYq1NV8wXNXGKqZRm7A.uy9z0S

-- Delete existing admin user if exists
DELETE FROM users WHERE email = 'admin' OR email = 'admin@localhost' OR email = 'admin7173@gmail.com';

-- Insert admin user with password "zaid1234"
INSERT INTO users (name, email, password_hash, role, created_at)
VALUES (
  'Admin User',
  'admin7173@gmail.com',
  '$2a$10$eImiTXuWVxfaHNAVIqlFe.nJF7QJYq1NV8wXNXGKqZRm7A.uy9z0S',
  'admin',
  CURRENT_TIMESTAMP
);

-- Verify the admin user was created
SELECT id, name, email, role FROM users WHERE email = 'admin7173@gmail.com';
