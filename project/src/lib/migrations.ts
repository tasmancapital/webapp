import { supabase } from './supabase';

export const migrations = [
  {
    name: '20250325000000_seed_users.sql',
    file: '20250325000000_seed_users.sql',
  },
  {
    name: '20250325000001_user_authentication.sql',
    file: '20250325000001_user_authentication.sql',
  },
  {
    name: '20250325000002_website_content.sql',
    file: '20250325000002_website_content.sql',
  },
  {
    name: '20250325000003_seed_pages.sql',
    file: '20250325000003_seed_pages.sql',
  },
  {
    name: '20250325000004_seed_home_page.sql',
    file: '20250325000004_seed_home_page.sql',
  },
  {
    name: '20250325000005_seed_about_page.sql',
    file: '20250325000005_seed_about_page.sql',
  },
  {
    name: '20250325000006_seed_investments_page.sql',
    file: '20250325000006_seed_investments_page.sql',
  },
  {
    name: '20250325000007_seed_team_page.sql',
    file: '20250325000007_seed_team_page.sql',
  },
  {
    name: '20250325000008_seed_contact_page.sql',
    file: '20250325000008_seed_contact_page.sql',
  },
  {
    name: '20250325000009_seed_legal_pages.sql',
    file: '20250325000009_seed_legal_pages.sql',
  },
  {
    name: '20250325000010_seed_theme_styles.sql',
    file: '20250325000010_seed_theme_styles.sql',
  },
  {
    name: '20250325000011_page_templates.sql',
    file: '20250325000011_page_templates.sql',
  },
  {
    name: '20250325000012_header_footer_customization.sql',
    file: '20250325000012_header_footer_customization.sql',
  },
  {
    name: '20250325000013_navigation_menus.sql',
    file: '20250325000013_navigation_menus.sql',
  },
];

export const runMigrations = async () => {
  try {
    // Check if migrations have already run
    const { data: settings, error } = await supabase
      .from('pages')
      .select('*')
      .limit(1);

    // If there's no error and table exists with data, migrations have run
    if (!error && settings !== null && settings.length > 0) {
      console.log('Migrations already applied');
      return;
    }

    console.log('Running migrations...');

    // Run all migrations in sequence
    for (const migration of migrations) {
      console.log(`Running migration: ${migration.name}`);
      
      // Read migration file
      const response = await fetch(`/supabase/migrations/${migration.file}`);
      const sql = await response.text();
      
      // Execute SQL
      const { error: migrationError } = await supabase.rpc('run_sql', { sql });
      
      if (migrationError) {
        console.error(`Migration ${migration.name} failed:`, migrationError);
        throw migrationError;
      }
      
      console.log(`Migration ${migration.name} completed successfully`);
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};