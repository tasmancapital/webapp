// Script to run Supabase migrations and seed users
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

console.log('=== RUNNING MIGRATIONS ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Using anon key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to create admin users
async function createAdminUsers() {
  console.log('\n--- CREATING ADMIN USERS ---');
  
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
  
  for (const user of adminUsers) {
    console.log(`\nCreating user: ${user.email}`);
    
    try {
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
      } else {
        console.log(`User created with ID: ${authData.user.id}`);
      }
    } catch (error) {
      console.error(`Unexpected error creating user ${user.email}:`, error);
    }
  }
}

// Main function to run migrations
async function runMigrations() {
  try {
    // First, create the admin users
    await createAdminUsers();
    
    console.log('\n=== MIGRATIONS COMPLETE ===');
    console.log('Please try logging in with:');
    console.log('- Email: tito@nrgy.com.au');
    console.log('- Password: !Daftfunk1');
    console.log('\nOr:');
    console.log('- Email: admin@tasmancapital.com.au');
    console.log('- Password: Tasman!!2025');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

// Run the migrations
runMigrations();
