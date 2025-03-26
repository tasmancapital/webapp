# Tasman Capital Website Migrations

This document provides instructions for applying the database migrations manually through the Supabase dashboard.

## Migration Files

The following migration files need to be applied in order:

1. `20250325000000_seed_users.sql` - Create initial admin users
2. `20250325000001_user_authentication.sql` - Set up user authentication and profiles
3. `20250325000002_website_content.sql` - Create tables for website content
4. `20250325000003_seed_pages.sql` - Seed basic page structure
5. `20250325000004_seed_home_page.sql` - Seed home page content
6. `20250325000005_seed_about_page.sql` - Seed about page content
7. `20250325000006_seed_investments_page.sql` - Seed investments page content
8. `20250325000007_seed_team_page.sql` - Seed team page content
9. `20250325000008_seed_contact_page.sql` - Seed contact page content
10. `20250325000009_seed_legal_pages.sql` - Seed legal pages content
11. `20250325000010_seed_theme_styles.sql` - Seed theme styles and CSS variables
12. `20250325000011_page_templates.sql` - Create page templates
13. `20250325000012_header_footer_customization.sql` - Set up header and footer customization
14. `20250325000013_navigation_menus.sql` - Create navigation menu system

## How to Apply Migrations

1. Log in to the [Supabase Dashboard](https://app.supabase.com)
2. Select the Tasman Capital project
3. Go to the SQL Editor
4. For each migration file:
   - Open the SQL file from the `supabase/migrations` directory
   - Copy the entire SQL content
   - Create a new query in the SQL Editor
   - Paste the SQL content
   - Run the query
   - Verify that the query executed successfully before proceeding to the next migration

## Admin User Credentials

After running the migrations, you can log in with the following credentials:

- **Admin 1**
  - Email: tito@nrgy.com.au
  - Password: !Daftfunk1

- **Admin 2**
  - Email: admin@tasman
  - Password: Tasman!!2025

## Verifying the Migrations

After applying all migrations, you should be able to:

1. Log in with the admin credentials
2. Access the website content management system
3. View and edit pages, components, headers, footers, and navigation menus
4. Customize theme styles and CSS variables

If you encounter any issues during the migration process, check the error messages in the SQL Editor and resolve them before continuing with the next migration.
