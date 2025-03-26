// Simple script to test Supabase connection
// Use proper ES module format
import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials for testing
const supabaseUrl = 'https://dauopcopxsapqlzvrube.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdW9wY29weHNhcHFsenZydWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzMjI4MzksImV4cCI6MjAyNjg5ODgzOX0.Nh83ebqzf2OQiEXkHw8Pvmgr6zMxwGdM8KMNbXlGGbM';

console.log('Testing Supabase connection with:');
console.log('URL:', supabaseUrl);
console.log('Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

async function testSupabase() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully');
    
    // Test a simple query
    const { data, error } = await supabase.from('pages').select('*').limit(1);
    
    if (error) {
      console.error('Error querying Supabase:', error);
    } else {
      console.log('Successfully queried Supabase!');
      console.log('Data:', data);
    }
  } catch (error) {
    console.error('Error creating Supabase client:', error);
  }
}

testSupabase();
