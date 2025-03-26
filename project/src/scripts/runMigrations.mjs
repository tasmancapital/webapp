// Migration script to run all Supabase migrations
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const migrationsDir = path.join(projectRoot, 'supabase/migrations');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dauopcopxsapqlzvrube.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdW9wY29weHNhcHFsenZydWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTcwMzEsImV4cCI6MjA1ODQzMzAzMX0.Y-HL9T_drR28RNHMIPjnDbKUCqFslUaw5nG-3VWEL6E';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get all migration files
function getMigrationFiles() {
  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure migrations run in order
    
    return files;
  } catch (error) {
    console.error('Error reading migration files:', error);
    return [];
  }
}

// Function to execute SQL directly via Supabase dashboard
async function runMigrations() {
  console.log('Starting migration process...');
  
  try {
    // Get all migration files
    const migrationFiles = getMigrationFiles();
    
    if (migrationFiles.length === 0) {
      console.error('No migration files found in:', migrationsDir);
      return;
    }
    
    console.log(`Found ${migrationFiles.length} migration files:`);
    migrationFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
    
    // Combine all SQL files into one script
    let combinedSql = '';
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      combinedSql += `\n-- ========== START OF ${file} ==========\n\n`;
      combinedSql += sql;
      combinedSql += `\n\n-- ========== END OF ${file} ==========\n`;
    }
    
    // Print instructions for manual execution
    console.log('\n=== MIGRATION INSTRUCTIONS ===');
    console.log('Since we cannot directly execute complex SQL statements via the Supabase JS client,');
    console.log('please follow these steps to apply the migrations:');
    console.log('1. Log in to the Supabase dashboard: https://app.supabase.com');
    console.log('2. Navigate to your project: dauopcopxsapqlzvrube');
    console.log('3. Go to the SQL Editor');
    console.log('4. Create a new query');
    console.log('5. Copy and paste the SQL from each migration file in order:');
    
    // List each migration file
    for (const file of migrationFiles) {
      console.log(`   - ${file}`);
    }
    
    console.log('\nAlternatively, you can run the following combined SQL script:');
    
    // Write the combined SQL to a file for easier access
    const combinedSqlPath = path.join(projectRoot, 'combined_migrations.sql');
    fs.writeFileSync(combinedSqlPath, combinedSql);
    console.log(`Combined SQL script written to: ${combinedSqlPath}`);
    
    console.log('\n6. Execute each query in order');
    console.log('=== END INSTRUCTIONS ===\n');
    
    // Check database status
    console.log('Checking database status...');
    
    // Check if users table exists
    const { data: tableInfo, error: tableCheckError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (tableCheckError && tableCheckError.code === '42P01') {
      console.log('Users table does not exist. Please run the SQL migrations manually via the Supabase dashboard.');
    } else {
      console.log('Users table exists. Checking for users...');
      
      // Check if users exist
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .order('email');
      
      if (usersError) {
        console.error('Error checking users:', usersError);
      } else if (users && users.length > 0) {
        console.log('Existing users:');
        users.forEach(user => {
          console.log(`- ${user.email}`);
        });
      } else {
        console.log('No users found. Please run the SQL migrations manually via the Supabase dashboard.');
      }
    }
    
    console.log('\nMigration process completed');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Run the migrations
runMigrations();
