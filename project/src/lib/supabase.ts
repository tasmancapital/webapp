import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get values from environment variables if available, otherwise use hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dauopcopxsapqlzvrube.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdW9wY29weHNhcHFsenZydWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTcwMzEsImV4cCI6MjA1ODQzMzAzMX0.Y-HL9T_drR28RNHMIPjnDbKUCqFslUaw5nG-3VWEL6E';

// Debug logging
console.log('Initializing Supabase client');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

let supabase: SupabaseClient;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'tasman-capital-auth'
    }
  });
  console.log('Supabase client created successfully');
  
  // Check if we have an existing session
  (async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else if (data.session) {
        console.log('Existing session found:', data.session.user.email);
        
        // Verify the session is valid by making a simple query
        const { error: testError } = await supabase
          .from('pages')
          .select('id')
          .limit(1);
          
        if (testError) {
          console.error('Session appears invalid, signing out:', testError);
          await supabase.auth.signOut();
        } else {
          console.log('Session verified successfully');
        }
      } else {
        console.log('No existing session found');
      }
    } catch (error) {
      console.error('General error checking session:', error);
    }
  })();
} catch (error) {
  console.error('Error creating Supabase client:', error);
  throw error;
}

export { supabase };