// Script to seed admin users in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

console.log('=== SEEDING ADMIN USERS ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Using anon key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

// Admin user credentials
const adminUsers = [
  {
    email: 'tito@nrgy.com.au',
    password: '!Daftfunk1',
    name: 'Tito Admin'
  },
  {
    email: 'admin@tasmancapital.com.au',
    password: 'Tasman!!2025',
    name: 'Tasman Admin'
  }
];

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedAdminUsers() {
  console.log('\nStarting admin user seeding process...');
  
  for (const user of adminUsers) {
    console.log(`\nProcessing user: ${user.email}`);
    
    try {
      // Step 1: Check if user exists
      console.log(`Checking if user ${user.email} exists...`);
      const { data: existingUsers, error: getUserError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .limit(1);
      
      if (getUserError) {
        console.error(`Error checking if user exists: ${getUserError.message}`);
        continue;
      }
      
      let userId;
      
      // Step 2: Create user if doesn't exist
      if (!existingUsers || existingUsers.length === 0) {
        console.log(`User ${user.email} not found, creating new user...`);
        
        // Create user in auth.users
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              name: user.name,
              role: 'admin'
            }
          }
        });
        
        if (signUpError) {
          console.error(`Error creating user: ${signUpError.message}`);
          continue;
        }
        
        userId = authData.user.id;
        console.log(`User created with ID: ${userId}`);
      } else {
        userId = existingUsers[0].id;
        console.log(`User already exists with ID: ${userId}`);
      }
      
      // Step 3: Check if user is in admin_users table
      console.log(`Checking if user is in admin_users table...`);
      const { data: existingAdmins, error: getAdminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (getAdminError) {
        console.error(`Error checking admin status: ${getAdminError.message}`);
        continue;
      }
      
      // Step 4: Add to admin_users if not already there
      if (!existingAdmins || existingAdmins.length === 0) {
        console.log(`Adding user to admin_users table...`);
        
        const { error: insertAdminError } = await supabase
          .from('admin_users')
          .insert([{ user_id: userId }]);
        
        if (insertAdminError) {
          console.error(`Error adding user to admin_users: ${insertAdminError.message}`);
          continue;
        }
        
        console.log(`User successfully added to admin_users table`);
      } else {
        console.log(`User is already in admin_users table`);
      }
      
      console.log(`✅ User ${user.email} successfully processed`);
    } catch (error) {
      console.error(`Unexpected error processing user ${user.email}:`, error);
    }
  }
  
  console.log('\n=== ADMIN USER SEEDING COMPLETE ===');
}

// Run the seeding function
seedAdminUsers();
