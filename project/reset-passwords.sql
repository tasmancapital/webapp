-- SQL script to reset passwords for admin users
-- Run this in the Supabase SQL Editor

-- Reset password for tito@nrgy.com.au
UPDATE auth.users 
SET encrypted_password = crypt('!Daftfunk1', gen_salt('bf'))
WHERE email = 'tito@nrgy.com.au';

-- Reset password for admin@tasmancapital.com.au
UPDATE auth.users 
SET encrypted_password = crypt('Tasman!!2025', gen_salt('bf'))
WHERE email = 'admin@tasmancapital.com.au';

-- Verify users
SELECT email, created_at 
FROM auth.users 
WHERE email IN ('tito@nrgy.com.au', 'admin@tasmancapital.com.au');
