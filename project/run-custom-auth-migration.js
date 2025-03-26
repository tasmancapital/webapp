// Script to run the custom authentication migration
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read the migration file
const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250326000001_custom_authentication.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

async function runMigration() {
  console.log('=== RUNNING CUSTOM AUTHENTICATION MIGRATION ===');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    // Execute the SQL migration
    const { error } = await supabase.rpc('pgmoon.execute', { query: migrationSQL });
    
    if (error) {
      console.error('Error running migration:', error.message);
      
      // Try an alternative approach if the RPC method fails
      console.log('Trying alternative approach...');
      
      // Split the SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      console.log(`Executing ${statements.length} SQL statements...`);
      
      let successCount = 0;
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        const { error: stmtError } = await supabase.rpc('pgmoon.execute', { query: stmt });
        
        if (stmtError) {
          console.error(`Error executing statement ${i + 1}:`, stmtError.message);
        } else {
          successCount++;
        }
      }
      
      console.log(`Successfully executed ${successCount}/${statements.length} statements`);
    } else {
      console.log('Migration executed successfully!');
    }
    
    // Verify the tables were created
    const { data: adminUsersData, error: adminUsersError } = await supabase
      .from('admin_users')
      .select('email')
      .limit(10);
    
    if (adminUsersError) {
      console.error('Error verifying admin_users table:', adminUsersError.message);
    } else {
      console.log('admin_users table created successfully!');
      console.log('Users found:', adminUsersData.length);
      adminUsersData.forEach(user => console.log(`- ${user.email}`));
    }
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(10);
    
    if (profilesError) {
      console.error('Error verifying profiles table:', profilesError.message);
    } else {
      console.log('profiles table created successfully!');
      console.log('Profiles found:', profilesData.length);
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
  
  console.log('=== MIGRATION COMPLETE ===');
}

// Run the migration
runMigration();
