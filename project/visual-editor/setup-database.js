/**
 * Visual Editor Database Setup
 * 
 * This script creates the SQLite database structure for the visual editor,
 * mirroring the structure from Supabase but optimized for local file-based editing.
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create content directories if they don't exist
const contentDirs = ['pages', 'components', 'media', 'templates', 'users'];
contentDirs.forEach(dir => {
  const dirPath = path.join(__dirname, 'content', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Initialize database
const db = new sqlite3.Database(path.join(dbDir, 'visual-editor.db'));

// Run setup
db.serialize(() => {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create pages table
  db.run(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      meta_title TEXT,
      meta_description TEXT,
      is_published BOOLEAN DEFAULT 0,
      template_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      FOREIGN KEY (template_id) REFERENCES page_templates(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (updated_by) REFERENCES users(id)
    )
  `);

  // Create components table
  db.run(`
    CREATE TABLE IF NOT EXISTS components (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      component_type TEXT NOT NULL,
      schema TEXT NOT NULL, -- JSON schema
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (updated_by) REFERENCES users(id)
    )
  `);

  // Create sections table
  db.run(`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      component_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      FOREIGN KEY (component_id) REFERENCES components(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (updated_by) REFERENCES users(id)
    )
  `);

  // Create page_content table
  db.run(`
    CREATE TABLE IF NOT EXISTS page_content (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      section_id TEXT,
      content_file TEXT NOT NULL, -- Path to JSON file with content
      position INTEGER NOT NULL,
      is_published BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
      FOREIGN KEY (section_id) REFERENCES sections(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (updated_by) REFERENCES users(id)
    )
  `);

  // Create media table
  db.run(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      file_path TEXT NOT NULL, -- Path to media file
      thumbnail_path TEXT,
      alt_text TEXT,
      caption TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (updated_by) REFERENCES users(id)
    )
  `);

  // Create themes table
  db.run(`
    CREATE TABLE IF NOT EXISTS themes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT 0,
      variables_file TEXT NOT NULL, -- Path to JSON file with variables
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      updated_by TEXT,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (updated_by) REFERENCES users(id)
    )
  `);

  // Create page_templates table
  db.run(`
    CREATE TABLE IF NOT EXISTS page_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      structure_file TEXT NOT NULL, -- Path to JSON file with structure
      thumbnail TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create admin user if none exists
  db.get('SELECT COUNT(*) as count FROM users WHERE is_admin = 1', (err, row) => {
    if (err) {
      console.error('Error checking for admin users:', err);
      return;
    }

    if (row.count === 0) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('admin123', salt); // Default password, should be changed
      const userId = require('crypto').randomUUID();

      db.run(
        'INSERT INTO users (id, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
        [userId, 'admin@tasmancapital.com.au', hash, 1],
        function(err) {
          if (err) {
            console.error('Error creating admin user:', err);
          } else {
            console.log('Admin user created successfully');
            
            // Create admin user JSON file
            const userFile = path.join(__dirname, 'content', 'users', `${userId}.json`);
            fs.writeFileSync(userFile, JSON.stringify({
              id: userId,
              email: 'admin@tasmancapital.com.au',
              is_admin: true,
              created_at: new Date().toISOString()
            }, null, 2));
          }
        }
      );
    }
  });

  console.log('Database setup complete');
});

// Close database connection
db.close();
