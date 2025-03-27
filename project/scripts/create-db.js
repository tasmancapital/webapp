// Script to create a pre-initialized SQLite database
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const { Database } = sqlite3;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the database path
const dbDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dbDir, 'visual-editor.db');

// Create the directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  console.log(`Creating directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  console.log(`Removing existing database: ${dbPath}`);
  fs.unlinkSync(dbPath);
}

async function createDatabase() {
  console.log('Creating pre-initialized database...');
  
  try {
    // Open the database connection
    const db = await open({
      filename: dbPath,
      driver: Database
    });
    
    // Create tables
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
    
    // Create default admin user
    const adminId = uuidv4();
    const passwordHash = bcrypt.hashSync('admin123', 10);
    
    await db.run(
      'INSERT INTO users (id, email, password_hash, name, is_admin) VALUES (?, ?, ?, ?, ?)',
      [adminId, 'admin@tasmancapital.com', passwordHash, 'Admin User', 1]
    );
    
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
        'INSERT INTO sections (id, name, description) VALUES (?, ?, ?)',
        [section.id, section.name, section.description]
      );
    }
    
    // Create default home page
    const homePageId = uuidv4();
    await db.run(
      'INSERT INTO pages (id, slug, title, is_published) VALUES (?, ?, ?, ?)',
      [homePageId, 'home', 'Home', 1]
    );
    
    // Add default components to home page
    const heroId = uuidv4();
    await db.run(
      'INSERT INTO components (id, section_id, page_id, sort_order, data) VALUES (?, ?, ?, ?, ?)',
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
    
    // Set permissions on the database file
    await db.close();
    
    // Make the database file readable and writable
    fs.chmodSync(dbPath, 0o666);
    
    console.log(`Database created successfully at: ${dbPath}`);
    console.log('File permissions set to 666 (readable and writable)');
    
    // Verify the database
    const verifyDb = await open({
      filename: dbPath,
      driver: Database
    });
    
    const users = await verifyDb.all('SELECT * FROM users');
    console.log(`Verified database contains ${users.length} users`);
    
    await verifyDb.close();
    
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

createDatabase();
