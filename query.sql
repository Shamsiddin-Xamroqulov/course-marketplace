-- Active: 1765981898457@@127.0.0.1@5432@course_marketplace
SELECT * FROM users;

INSERT INTO users (
  first_name,
  last_name,
  email,
  password,
  phone_number,
  role,
  is_verified,
  "createdAt",
  "updatedAt"
) VALUES (
  'Shamsiddin',
  'Xamroqulov',
  'xamroqulovsh7@gmail.com',
  '$2b$10$H.s.XIqsHPiFcmQHj3doSujqthosT8bl5YQyA4wllp3H9O.eS17CC',
  '+998971912227',
  'admin',
  true,
  NOW(),
  NOW()
);

SELECT * FROM admins;

INSERT INTO admins(user_id, is_super, "createdAt", "updatedAt") VALUES(1, true, NOW(), NOW());

DELETE FROM users WHERE id=7;