// Script to reset passwords using Supabase admin API
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ADMIN_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

console.log('=== RESETTING ADMIN USER PASSWORDS ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Using service key (first 10 chars):', supabaseServiceKey.substring(0, 10) + '...');

// Admin user credentials
const adminUsers = [
  {
    email: 'tito@nrgy.com.au',
    password: '!Daftfunk1'
  },
  {
    email: 'admin@tasmancapital.com.au',
    password: 'Tasman!!2025'
  }
];

// Create Supabase admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetPasswords() {
  console.log('\nStarting password reset process...');
  
  for (const user of adminUsers) {
    console.log(`\nProcessing user: ${user.email}`);
    
    try {
      // First, get the user ID
      const { data: userData, error: getUserError } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', user.email)
        .single();
      
      if (getUserError) {
        console.error(`Error finding user: ${getUserError.message}`);
        continue;
      }
      
      if (!userData) {
        console.error(`User not found: ${user.email}`);
        continue;
      }
      
      console.log(`Found user with ID: ${userData.id}`);
      
      // Update the user's password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userData.id,
        { password: user.password }
      );
      
      if (updateError) {
        console.error(`Error updating password: ${updateError.message}`);
      } else {
        console.log(`Password updated successfully for ${user.email}`);
      }
    } catch (err) {
      console.error(`Unexpected error: ${err.message}`);
    }
  }
  
  console.log('\n=== PASSWORD RESET COMPLETE ===');
}

// Run the function
resetPasswords();
