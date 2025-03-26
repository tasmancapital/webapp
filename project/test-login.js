// Script to test login credentials with Supabase
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

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test credentials
const testCredentials = [
  {
    email: 'tito@nrgy.com.au',
    password: '!Daftfunk1'
  },
  {
    email: 'admin@tasmancapital.com.au',
    password: 'Tasman!!2025'
  }
];

async function testLogin() {
  console.log('=== TESTING LOGIN CREDENTIALS ===');
  console.log('Supabase URL:', supabaseUrl);
  
  for (const cred of testCredentials) {
    console.log(`\nTesting login for: ${cred.email}`);
    
    try {
      // Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password
      });
      
      if (error) {
        console.error(`Login failed: ${error.message}`);
      } else {
        console.log('Login successful!');
        console.log('User ID:', data.user.id);
        console.log('Session expires at:', new Date(data.session.expires_at * 1000).toLocaleString());
      }
    } catch (err) {
      console.error('Error during login test:', err);
    }
  }
  
  // Also check if users exist in auth.users
  console.log('\n=== CHECKING USER EXISTENCE ===');
  
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting current user:', authError.message);
    } else if (authData.user) {
      console.log('Currently logged in as:', authData.user.email);
      
      // Sign out before finishing
      await supabase.auth.signOut();
      console.log('Signed out successfully');
    } else {
      console.log('No user currently logged in');
    }
  } catch (err) {
    console.error('Error checking user existence:', err);
  }
  
  console.log('\n=== LOGIN TEST COMPLETE ===');
}

// Run the test
testLogin();
