// Script to verify Supabase API keys
import { createClient } from '@supabase/supabase-js';

// Define the URL and keys to test
const supabaseUrl = 'https://dauopcopxsapqlzvrube.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdW9wY29weHNhcHFsenZydWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzMjI4MzksImV4cCI6MjAyNjg5ODgzOX0.Nh83ebqzf2OQiEXkHw8Pvmgr6zMxwGdM8KMNbXlGGbM';

// Function to test a specific key
async function testKey(keyType, key) {
  console.log(`\nTesting ${keyType} key...`);
  console.log(`Key (first 10 chars): ${key.substring(0, 10)}...`);
  
  try {
    const supabase = createClient(supabaseUrl, key);
    console.log(`Supabase client created with ${keyType} key`);
    
    // Test a public table query that should work with anon key
    console.log('Testing public table query...');
    const { data, error } = await supabase.from('pages').select('id').limit(1);
    
    if (error) {
      console.error(`❌ Error querying with ${keyType} key:`, error.message);
      console.error('Hint:', error.hint || 'No hint provided');
      return false;
    } else {
      console.log(`✅ Successfully queried table with ${keyType} key`);
      console.log('Data:', data);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error creating Supabase client with ${keyType} key:`, error.message);
    return false;
  }
}

// Main function
async function verifyKeys() {
  console.log('=== SUPABASE KEY VERIFICATION ===');
  console.log('URL:', supabaseUrl);
  
  // Test anon key
  const anonKeyValid = await testKey('anon', supabaseAnonKey);
  
  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log(`Anon key: ${anonKeyValid ? '✅ VALID' : '❌ INVALID'}`);
  
  if (!anonKeyValid) {
    console.log('\n🔍 TROUBLESHOOTING SUGGESTIONS:');
    console.log('1. Verify the project URL is correct');
    console.log('2. Check if the API keys have been rotated in the Supabase dashboard');
    console.log('3. Ensure the project is active and not in maintenance mode');
    console.log('4. Check if your IP address is restricted in Supabase settings');
  }
}

verifyKeys();
