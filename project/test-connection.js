// Script to test Supabase connection with user-provided API keys
import { createClient } from '@supabase/supabase-js';

// Supabase project URL (this should be correct)
const supabaseUrl = 'https://dauopcopxsapqlzvrube.supabase.co';

// Function to test connection with a given API key
async function testConnection(apiKey) {
  console.log('\n=== TESTING SUPABASE CONNECTION ===');
  console.log('URL:', supabaseUrl);
  console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
  
  try {
    // Create Supabase client with the provided key
    const supabase = createClient(supabaseUrl, apiKey);
    console.log('✅ Supabase client created successfully');
    
    // Test authentication
    console.log('\nTesting authentication...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Auth session error:', sessionError.message);
    } else {
      console.log('✅ Auth session check successful');
      console.log('Session:', sessionData.session ? 'Active' : 'None');
    }
    
    // Test a simple database query
    console.log('\nTesting database access...');
    const { data: dbData, error: dbError } = await supabase.from('pages').select('id').limit(1);
    if (dbError) {
      console.error('❌ Database query error:', dbError.message);
      console.error('Hint:', dbError.hint || 'No hint provided');
    } else {
      console.log('✅ Database query successful');
      console.log('Data:', dbData);
    }
    
    return !sessionError && !dbError;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error.message);
    return false;
  }
}

// Get API key from command line argument
const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Please provide an API key as a command line argument:');
  console.error('node test-connection.js YOUR_API_KEY');
  process.exit(1);
}

// Run the test
testConnection(apiKey)
  .then(success => {
    console.log('\n=== TEST RESULT ===');
    if (success) {
      console.log('✅ Connection successful! This API key works correctly.');
      
      // Provide instructions for updating the key in the codebase
      console.log('\n=== NEXT STEPS ===');
      console.log('1. Update the API key in src/lib/supabase.ts');
      console.log('2. Restart your development server');
    } else {
      console.log('❌ Connection failed. This API key does not work correctly.');
      console.log('\n🔍 TROUBLESHOOTING SUGGESTIONS:');
      console.log('1. Verify you\'re using the correct API key (anon key for client-side)');
      console.log('2. Check if your Supabase project is active');
      console.log('3. Verify there are no IP restrictions in your Supabase settings');
    }
  });
