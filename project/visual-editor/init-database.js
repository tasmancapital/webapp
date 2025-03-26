import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create content directory if it doesn't exist
const contentDir = path.join(__dirname, 'content');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
  fs.mkdirSync(path.join(contentDir, 'pages'), { recursive: true });
  fs.mkdirSync(path.join(contentDir, 'templates'), { recursive: true });
  fs.mkdirSync(path.join(contentDir, 'components'), { recursive: true });
}

// Initialize the database
async function initDatabase() {
  try {
    const db = await open({
      filename: path.join(dbDir, 'visual-editor.db'),
      driver: sqlite3.Database
    });

    console.log('Creating database tables...');

    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        is_admin INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create pages table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        meta_title TEXT,
        meta_description TEXT,
        template_id TEXT,
        is_published INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        FOREIGN KEY (template_id) REFERENCES page_templates (id),
        FOREIGN KEY (created_by) REFERENCES users (id),
        FOREIGN KEY (updated_by) REFERENCES users (id)
      )
    `);

    // Create components table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS components (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        schema TEXT NOT NULL,
        category TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        FOREIGN KEY (created_by) REFERENCES users (id),
        FOREIGN KEY (updated_by) REFERENCES users (id)
      )
    `);

    // Create sections table (for grouping components)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS sections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        FOREIGN KEY (created_by) REFERENCES users (id),
        FOREIGN KEY (updated_by) REFERENCES users (id)
      )
    `);

    // Create page_content table (for storing page components)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS page_content (
        id TEXT PRIMARY KEY,
        page_id TEXT NOT NULL,
        section_id TEXT,
        content_file TEXT NOT NULL,
        position INTEGER DEFAULT 0,
        is_published INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        FOREIGN KEY (page_id) REFERENCES pages (id),
        FOREIGN KEY (section_id) REFERENCES sections (id),
        FOREIGN KEY (created_by) REFERENCES users (id),
        FOREIGN KEY (updated_by) REFERENCES users (id)
      )
    `);

    // Create media table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL,
        alt_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        FOREIGN KEY (created_by) REFERENCES users (id),
        FOREIGN KEY (updated_by) REFERENCES users (id)
      )
    `);

    // Create theme_styles table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS theme_styles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        variables TEXT NOT NULL,
        is_default INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        FOREIGN KEY (created_by) REFERENCES users (id),
        FOREIGN KEY (updated_by) REFERENCES users (id)
      )
    `);

    // Create page_templates table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS page_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        structure_file TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        updated_by TEXT,
        FOREIGN KEY (created_by) REFERENCES users (id),
        FOREIGN KEY (updated_by) REFERENCES users (id)
      )
    `);

    console.log('Database tables created successfully.');

    // Insert default admin user
    const adminId = uuidv4();
    const adminEmail = 'admin@tasmancapital.com';
    const adminPassword = 'admin123'; // This should be changed in production
    const adminPasswordHash = bcrypt.hashSync(adminPassword, 10);

    const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [adminEmail]);
    if (!existingAdmin) {
      await db.run(
        'INSERT INTO users (id, email, password_hash, name, is_admin) VALUES (?, ?, ?, ?, ?)',
        [adminId, adminEmail, adminPasswordHash, 'Admin User', 1]
      );
      console.log('Default admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    // Insert default sections
    const sections = [
      { id: uuidv4(), name: 'Header', description: 'Page header section' },
      { id: uuidv4(), name: 'Hero', description: 'Hero banner section' },
      { id: uuidv4(), name: 'Content', description: 'Main content section' },
      { id: uuidv4(), name: 'Features', description: 'Features showcase section' },
      { id: uuidv4(), name: 'Team', description: 'Team members section' },
      { id: uuidv4(), name: 'Testimonials', description: 'Testimonials section' },
      { id: uuidv4(), name: 'Contact', description: 'Contact form section' },
      { id: uuidv4(), name: 'Footer', description: 'Page footer section' }
    ];

    for (const section of sections) {
      const existingSection = await db.get('SELECT * FROM sections WHERE name = ?', [section.name]);
      if (!existingSection) {
        await db.run(
          'INSERT INTO sections (id, name, description, created_by, updated_by) VALUES (?, ?, ?, ?, ?)',
          [section.id, section.name, section.description, adminId, adminId]
        );
      }
    }
    console.log('Default sections created.');

    // Insert default components
    const components = [
      {
        id: uuidv4(),
        name: 'Heading',
        description: 'Text heading component',
        category: 'Basic',
        schema: JSON.stringify({
          type: 'object',
          properties: {
            text: { type: 'string', default: 'Heading Text' },
            level: { type: 'number', enum: [1, 2, 3, 4, 5, 6], default: 2 },
            alignment: { type: 'string', enum: ['left', 'center', 'right'], default: 'left' }
          },
          defaultContent: {
            text: 'Heading Text',
            level: 2,
            alignment: 'left'
          }
        })
      },
      {
        id: uuidv4(),
        name: 'Text Block',
        description: 'Rich text content block',
        category: 'Basic',
        schema: JSON.stringify({
          type: 'object',
          properties: {
            content: { type: 'string', default: '<p>Enter your content here...</p>' }
          },
          defaultContent: {
            content: '<p>Enter your content here...</p>'
          }
        })
      },
      {
        id: uuidv4(),
        name: 'Image',
        description: 'Image component',
        category: 'Media',
        schema: JSON.stringify({
          type: 'object',
          properties: {
            src: { type: 'string', default: '/placeholder.jpg' },
            alt: { type: 'string', default: 'Image description' },
            width: { type: 'number' },
            height: { type: 'number' }
          },
          defaultContent: {
            src: '/placeholder.jpg',
            alt: 'Image description'
          }
        })
      },
      {
        id: uuidv4(),
        name: 'Button',
        description: 'Call-to-action button',
        category: 'Interactive',
        schema: JSON.stringify({
          type: 'object',
          properties: {
            text: { type: 'string', default: 'Click Me' },
            url: { type: 'string', default: '#' },
            style: { type: 'string', enum: ['primary', 'secondary', 'outline'], default: 'primary' },
            size: { type: 'string', enum: ['small', 'medium', 'large'], default: 'medium' }
          },
          defaultContent: {
            text: 'Click Me',
            url: '#',
            style: 'primary',
            size: 'medium'
          }
        })
      },
      {
        id: uuidv4(),
        name: 'Hero Banner',
        description: 'Full-width hero banner with text and CTA',
        category: 'Sections',
        schema: JSON.stringify({
          type: 'object',
          properties: {
            heading: { type: 'string', default: 'Welcome to Tasman Capital' },
            subheading: { type: 'string', default: 'Your trusted investment partner' },
            backgroundImage: { type: 'string', default: '/hero-bg.jpg' },
            buttonText: { type: 'string', default: 'Learn More' },
            buttonUrl: { type: 'string', default: '/about' }
          },
          defaultContent: {
            heading: 'Welcome to Tasman Capital',
            subheading: 'Your trusted investment partner',
            backgroundImage: '/hero-bg.jpg',
            buttonText: 'Learn More',
            buttonUrl: '/about'
          }
        })
      },
      {
        id: uuidv4(),
        name: 'Feature Card',
        description: 'Feature card with icon, title and description',
        category: 'Sections',
        schema: JSON.stringify({
          type: 'object',
          properties: {
            icon: { type: 'string', default: 'chart' },
            title: { type: 'string', default: 'Feature Title' },
            description: { type: 'string', default: 'Feature description goes here.' }
          },
          defaultContent: {
            icon: 'chart',
            title: 'Feature Title',
            description: 'Feature description goes here.'
          }
        })
      }
    ];

    for (const component of components) {
      const existingComponent = await db.get('SELECT * FROM components WHERE name = ?', [component.name]);
      if (!existingComponent) {
        await db.run(
          'INSERT INTO components (id, name, description, schema, category, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [component.id, component.name, component.description, component.schema, component.category, adminId, adminId]
        );
      }
    }
    console.log('Default components created.');

    // Insert default page templates
    const standardTemplateId = uuidv4();
    const standardTemplateFile = 'templates/standard.json';
    const standardTemplateStructure = {
      name: 'Standard Page',
      sections: [
        { name: 'Header', fixed: true },
        { name: 'Hero', optional: true },
        { name: 'Content', required: true },
        { name: 'Footer', fixed: true }
      ]
    };

    // Save template structure to file
    fs.writeFileSync(
      path.join(contentDir, standardTemplateFile),
      JSON.stringify(standardTemplateStructure, null, 2)
    );

    // Insert template into database
    const existingTemplate = await db.get('SELECT * FROM page_templates WHERE name = ?', ['Standard Page']);
    if (!existingTemplate) {
      await db.run(
        'INSERT INTO page_templates (id, name, description, structure_file, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
        [
          standardTemplateId,
          'Standard Page',
          'Standard page template with header, optional hero, content area, and footer',
          standardTemplateFile,
          adminId,
          adminId
        ]
      );
    }
    console.log('Default page template created.');

    // Insert default theme styles
    const defaultThemeId = uuidv4();
    const defaultThemeVariables = {
      light: {
        '--background': '255 255 255',
        '--foreground': '20 20 20',
        '--primary': '234 88 12',
        '--primary-foreground': '255 255 255',
        '--secondary': '245 245 245',
        '--secondary-foreground': '20 20 20',
        '--muted': '235 235 235',
        '--muted-foreground': '100 100 100',
        '--accent': '234 88 12',
        '--accent-foreground': '255 255 255',
        '--border': '225 225 225',
        '--ring': '215 215 215'
      },
      dark: {
        '--background': '2 6 23',
        '--foreground': '255 255 255',
        '--primary': '234 88 12',
        '--primary-foreground': '2 6 23',
        '--secondary': '15 15 30',
        '--secondary-foreground': '255 255 255',
        '--muted': '25 25 40',
        '--muted-foreground': '200 200 200',
        '--accent': '234 88 12',
        '--accent-foreground': '2 6 23',
        '--border': '20 20 35',
        '--ring': '30 30 45'
      }
    };

    const existingTheme = await db.get('SELECT * FROM theme_styles WHERE name = ?', ['Default Theme']);
    if (!existingTheme) {
      await db.run(
        'INSERT INTO theme_styles (id, name, description, variables, is_default, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          defaultThemeId,
          'Default Theme',
          'Default theme with light and dark mode',
          JSON.stringify(defaultThemeVariables),
          1,
          adminId,
          adminId
        ]
      );
    }
    console.log('Default theme created.');

    // Insert default pages
    const homePageId = uuidv4();
    const homePageContentId = uuidv4();
    const homePageContentFile = `pages/home/${homePageContentId}.json`;
    
    // Create directory for home page content
    fs.mkdirSync(path.join(contentDir, 'pages', 'home'), { recursive: true });
    
    // Create home page content
    const homePageContent = {
      name: 'Home Hero',
      heading: 'Welcome to Tasman Capital',
      subheading: 'Your trusted investment partner for over 20 years',
      backgroundImage: '/images/hero-bg.jpg',
      buttonText: 'Learn More',
      buttonUrl: '/about'
    };
    
    // Save home page content to file
    fs.writeFileSync(
      path.join(contentDir, homePageContentFile),
      JSON.stringify(homePageContent, null, 2)
    );
    
    // Insert home page into database
    const existingHomePage = await db.get('SELECT * FROM pages WHERE slug = ?', ['home']);
    if (!existingHomePage) {
      // Insert page
      await db.run(
        `INSERT INTO pages (
          id, slug, title, description, meta_title, meta_description, 
          template_id, is_published, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          homePageId,
          'home',
          'Home',
          'Welcome to Tasman Capital',
          'Tasman Capital - Home',
          'Tasman Capital is a leading investment firm specializing in private equity and venture capital investments.',
          standardTemplateId,
          1,
          adminId,
          adminId
        ]
      );
      
      // Insert page content
      await db.run(
        `INSERT INTO page_content (
          id, page_id, section_id, content_file, position, 
          is_published, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          homePageContentId,
          homePageId,
          (await db.get('SELECT id FROM sections WHERE name = ?', ['Hero'])).id,
          homePageContentFile,
          0,
          1,
          adminId,
          adminId
        ]
      );
    }
    console.log('Default home page created.');

    console.log('Database initialization completed successfully!');
    await db.close();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase();
