-- Admin Users Seeding Script
-- Run this in the Supabase SQL Editor

-- Function to create admin user if not exists
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT
) RETURNS TEXT AS $$
DECLARE
  new_user_id UUID;
  existing_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF existing_user_id IS NULL THEN
    -- Create user in auth.users
    INSERT INTO auth.users (
      email,
      raw_user_meta_data,
      created_at,
      updated_at,
      email_confirmed_at,
      confirmation_token,
      is_sso_user,
      encrypted_password
    ) VALUES (
      user_email,
      jsonb_build_object('name', user_name, 'role', 'admin'),
      NOW(),
      NOW(),
      NOW(),
      '',
      FALSE,
      -- This creates a proper Supabase password hash
      crypt(user_password, gen_salt('bf'))
    )
    RETURNING id INTO new_user_id;
    
    -- Create profile for user
    INSERT INTO public.profiles (
      id,
      email,
      name,
      role,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      user_email,
      user_name,
      'admin',
      NOW(),
      NOW()
    );
    
    -- Add to admin_users table
    INSERT INTO public.admin_users (
      user_id,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      NOW(),
      NOW()
    );
    
    RETURN 'User created: ' || user_email;
  ELSE
    -- User already exists, ensure they're in admin_users
    IF NOT EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = existing_user_id
    ) THEN
      INSERT INTO public.admin_users (
        user_id,
        created_at,
        updated_at
      ) VALUES (
        existing_user_id,
        NOW(),
        NOW()
      );
      
      RETURN 'Existing user added to admin_users: ' || user_email;
    ELSE
      RETURN 'User already exists and is admin: ' || user_email;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin users
SELECT create_admin_user('tito@nrgy.com.au', '!Daftfunk1', 'Tito Admin');
SELECT create_admin_user('admin@tasmancapital.com.au', 'Tasman!!2025', 'Tasman Admin');

-- Verify admin users
SELECT 'Admin users in auth.users:' AS check;
SELECT email, raw_user_meta_data->>'role' AS role
FROM auth.users
WHERE email IN ('tito@nrgy.com.au', 'admin@tasmancapital.com.au');

SELECT 'Admin users in admin_users table:' AS check;
SELECT au.id, u.email
FROM public.admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE u.email IN ('tito@nrgy.com.au', 'admin@tasmancapital.com.au');
