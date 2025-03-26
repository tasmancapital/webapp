// Test script specifically for Supabase authentication
import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials for testing
const supabaseUrl = 'https://dauopcopxsapqlzvrube.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdW9wY29weHNhcHFsenZydWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzMjI4MzksImV4cCI6MjAyNjg5ODgzOX0.Nh83ebqzf2OQiEXkHw8Pvmgr6zMxwGdM8KMNbXlGGbM';

console.log('Testing Supabase auth with:');
console.log('URL:', supabaseUrl);
console.log('Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

async function testAuth() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully');
    
    // Test the auth.getSession endpoint specifically
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error with auth.getSession:', error);
    } else {
      console.log('Auth session check successful!');
      console.log('Session data:', data);
    }
    
    // Try to get the user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error with auth.getUser:', userError);
    } else {
      console.log('Auth getUser successful!');
      console.log('User data:', userData);
    }
  } catch (error) {
    console.error('Error creating Supabase client:', error);
  }
}

testAuth();
