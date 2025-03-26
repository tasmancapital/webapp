// This script runs during Netlify function initialization
import fs from 'fs';
import path from 'path';
import { Database } from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Define the database path in /tmp for Netlify
const dbPath = path.join('/tmp', 'visual-editor.db');

// Initialize the database
export async function initDatabase() {
  console.log('Initializing database in Netlify environment...');
  console.log('Database path:', dbPath);
  
  try {
    // Create the directory if it doesn't exist
    const tmpDir = path.dirname(dbPath);
    if (!fs.existsSync(tmpDir)) {
      console.log(`Creating directory: ${tmpDir}`);
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    // Check if database already exists
    const dbExists = fs.existsSync(dbPath);
    console.log(`Database exists: ${dbExists}`);
    
    if (dbExists) {
      // Check if file is writable
      try {
        fs.accessSync(dbPath, fs.constants.W_OK);
        console.log('Database file is writable');
      } catch (accessError) {
        console.error('Database file is not writable:', accessError);
        // Try to fix permissions
        try {
          fs.chmodSync(dbPath, 0o666);
          console.log('Updated file permissions to 666');
        } catch (chmodError) {
          console.error('Failed to update file permissions:', chmodError);
        }
      }
    }
    
    // Open the database connection
    console.log('Opening database connection...');
    const db = await open({
      filename: dbPath,
      driver: Database
    });
    console.log('Database connection opened successfully');
    
    // Create tables
    console.log('Creating tables if they don\'t exist...');
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        is_admin INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        meta_title TEXT,
        meta_description TEXT,
        is_published INTEGER DEFAULT 0,
        template_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        thumbnail TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS components (
        id TEXT PRIMARY KEY,
        section_id TEXT NOT NULL,
        page_id TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES sections(id),
        FOREIGN KEY (page_id) REFERENCES pages(id)
      );

      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created successfully');

    // Check if admin user exists
    const adminUser = await db.get('SELECT * FROM users WHERE email = ?', ['admin@tasmancapital.com']);
    
    if (!adminUser) {
      console.log('Creating default admin user...');
      // Create default admin user
      const adminId = uuidv4();
      const passwordHash = bcrypt.hashSync('admin123', 10);
      
      await db.run(
        'INSERT OR IGNORE INTO users (id, email, password_hash, name, is_admin) VALUES (?, ?, ?, ?, ?)',
        [adminId, 'admin@tasmancapital.com', passwordHash, 'Admin User', 1]
      );
      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }
    
    // Check if sections exist
    const sectionsCount = await db.get('SELECT COUNT(*) as count FROM sections');
    
    if (!sectionsCount || sectionsCount.count === 0) {
      console.log('Creating default sections...');
      // Create default sections
      const sections = [
        { id: 'hero', name: 'Hero', description: 'Main hero section with heading and CTA' },
        { id: 'text', name: 'Text', description: 'Simple text section with heading and paragraph' },
        { id: 'features', name: 'Features', description: 'Feature list with icons' },
        { id: 'cta', name: 'Call to Action', description: 'Call to action section with button' },
        { id: 'team', name: 'Team', description: 'Team members with photos and bios' },
        { id: 'testimonials', name: 'Testimonials', description: 'Customer testimonials' },
        { id: 'contact', name: 'Contact', description: 'Contact form and information' }
      ];
      
      for (const section of sections) {
        await db.run(
          'INSERT OR IGNORE INTO sections (id, name, description) VALUES (?, ?, ?)',
          [section.id, section.name, section.description]
        );
      }
      console.log('Default sections created');
    } else {
      console.log('Sections already exist');
    }
    
    // Check if home page exists
    const homePage = await db.get('SELECT * FROM pages WHERE slug = ?', ['home']);
    
    if (!homePage) {
      console.log('Creating default home page...');
      // Create default home page
      const homePageId = uuidv4();
      await db.run(
        'INSERT OR IGNORE INTO pages (id, slug, title, is_published) VALUES (?, ?, ?, ?)',
        [homePageId, 'home', 'Home', 1]
      );
      
      // Add default components to home page
      const heroId = uuidv4();
      await db.run(
        'INSERT OR IGNORE INTO components (id, section_id, page_id, sort_order, data) VALUES (?, ?, ?, ?, ?)',
        [
          heroId, 
          'hero', 
          homePageId, 
          0, 
          JSON.stringify({
            heading: 'Tasman Capital Partners',
            subheading: 'Private equity investment firm',
            buttonText: 'Learn More',
            buttonUrl: '/about'
          })
        ]
      );
      console.log('Default home page created');
    } else {
      console.log('Home page already exists');
    }
    
    // Test database by running a simple query
    try {
      const testQuery = await db.get('SELECT COUNT(*) as count FROM sqlite_master');
      console.log('Database test query successful:', testQuery);
    } catch (testError) {
      console.error('Database test query failed:', testError);
    }
    
    console.log('Database initialized successfully in Netlify environment');
    await db.close();
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Run the initialization when this module is imported directly
// TypeScript doesn't recognize import.meta.main, so we'll just run the initialization
// when the module is imported directly in development
if (process.env.NODE_ENV === 'development') {
  initDatabase();
}
