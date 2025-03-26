import { Handler } from '@netlify/functions';
import * as path from 'path';
import * as fs from 'fs';
import { Database } from 'sqlite3';
import { open } from 'sqlite';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { initDatabase } from './initDatabase';

// Secret for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'tasman-visual-editor-secret';

// Database connection
const getDb = async () => {
  // Check if we're in the Netlify environment
  const isNetlify = process.env.NETLIFY === 'true';
  console.log('Environment:', isNetlify ? 'Netlify' : 'Local');
  
  // Define the database path
  let dbPath;
  
  if (isNetlify) {
    // Use /tmp directory for Netlify (writable)
    dbPath = path.join('/tmp', 'visual-editor.db');
    console.log('Using Netlify database path:', dbPath);
    
    // Create the directory if it doesn't exist
    const tmpDir = path.dirname(dbPath);
    if (!fs.existsSync(tmpDir)) {
      console.log('Creating directory:', tmpDir);
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    // Check if the database file exists in /tmp
    if (!fs.existsSync(dbPath)) {
      console.log('Database file does not exist in /tmp, will be created');
    } else {
      console.log('Database file exists in /tmp:', dbPath);
      // Check file permissions
      try {
        const stats = fs.statSync(dbPath);
        console.log('File permissions:', stats.mode.toString(8));
        // Ensure the file is writable
        fs.accessSync(dbPath, fs.constants.W_OK);
        console.log('File is writable');
      } catch (error) {
        console.error('File permission error:', error);
      }
    }
  } else {
    // Use local path for development
    dbPath = path.join(__dirname, '..', '..', 'data', 'visual-editor.db');
    console.log('Using local database path:', dbPath);
  }
  
  try {
    console.log('Opening database connection...');
    // Open the database connection
    const db = await open({
      filename: dbPath,
      driver: Database
    });
    console.log('Database connection opened successfully');
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

// Helper to validate JWT token
const validateToken = (token: string): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as Record<string, unknown>);
      }
    });
  });
};

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
  console.log('Visual Editor function invoked');
  
  // Initialize the database if needed
  try {
    console.log('Initializing database...');
    await initDatabase();
    console.log('Database initialization completed');
  } catch (initError) {
    console.error('Database initialization error:', initError);
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Parse the path to determine the action
  const pathStr = event.path.replace('/.netlify/functions/visualEditor', '');
  const segments = pathStr.split('/').filter(Boolean);
  const action = segments[0] || '';

  try {
    // Authentication endpoint
    if (action === 'auth') {
      if (event.httpMethod === 'POST') {
        const { email, password } = JSON.parse(event.body || '{}');
        
        if (!email || !password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email and password are required' })
          };
        }
        
        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials' })
          };
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email, 
            isAdmin: user.is_admin 
          }, 
          JWT_SECRET, 
          { expiresIn: '24h' }
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            token,
            user: {
              id: user.id,
              email: user.email,
              isAdmin: user.is_admin
            }
          })
        };
      }
    }
    
    // All other endpoints require authentication
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }
    
    let userData;
    try {
      userData = await validateToken(token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid or expired token';
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: errorMessage })
      };
    }
    
    // Only admin users can access the visual editor
    if (!userData.isAdmin) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Admin access required' })
      };
    }
    
    const db = await getDb();
    
    // Pages endpoints
    if (action === 'pages') {
      // List all pages
      if (event.httpMethod === 'GET' && segments.length === 1) {
        const pages = await db.all('SELECT * FROM pages ORDER BY updated_at DESC');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ pages })
        };
      }
      
      // Get a specific page
      if (event.httpMethod === 'GET' && segments.length === 2) {
        const pageId = segments[1];
        const page = await db.get('SELECT * FROM pages WHERE id = ?', [pageId]);
        
        if (!page) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Page not found' })
          };
        }
        
        // Get page content
        const pageContent = await db.all(
          'SELECT * FROM page_content WHERE page_id = ? ORDER BY position',
          [pageId]
        );
        
        // Load content from files
        const contentWithData = await Promise.all(
          pageContent.map(async (content) => {
            try {
              const contentFilePath = path.join(
                __dirname, '..', '..', 'visual-editor', 'content', content.content_file
              );
              const contentData = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
              return { ...content, data: contentData };
            } catch (error) {
              console.error(`Error loading content file for ${content.id}:`, error);
              return { ...content, data: {} };
            }
          })
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            page, 
            content: contentWithData 
          })
        };
      }
      
      // Update a page
      if (event.httpMethod === 'PUT' && segments.length === 2) {
        const pageId = segments[1];
        const { title, description, meta_title, meta_description, is_published, content } = JSON.parse(event.body || '{}');
        
        // Update page details
        await db.run(
          `UPDATE pages SET 
            title = ?, 
            description = ?, 
            meta_title = ?, 
            meta_description = ?, 
            is_published = ?,
            updated_at = CURRENT_TIMESTAMP,
            updated_by = ?
          WHERE id = ?`,
          [title, description, meta_title, meta_description, is_published ? 1 : 0, userData.id, pageId]
        );
        
        // Update content if provided
        if (content && Array.isArray(content)) {
          // First, get existing content to compare
          const existingContent = await db.all(
            'SELECT * FROM page_content WHERE page_id = ?',
            [pageId]
          );
          
          // Process each content item
          for (let i = 0; i < content.length; i++) {
            const item = content[i];
            
            // Check if this is an existing or new content item
            const existingItem = existingContent.find(e => e.id === item.id);
            
            if (existingItem) {
              // Update existing content
              const contentFilePath = path.join(
                __dirname, '..', '..', 'visual-editor', 'content', existingItem.content_file
              );
              
              // Write updated content to file
              fs.writeFileSync(contentFilePath, JSON.stringify(item.data, null, 2));
              
              // Update database record
              await db.run(
                `UPDATE page_content SET
                  position = ?,
                  is_published = ?,
                  updated_at = CURRENT_TIMESTAMP,
                  updated_by = ?
                WHERE id = ?`,
                [i, item.is_published ? 1 : 0, userData.id, item.id]
              );
            } else {
              // Create new content item
              const newId = uuidv4();
              const contentFileName = `pages/${pageId}/${newId}.json`;
              const contentDirPath = path.join(
                __dirname, '..', '..', 'visual-editor', 'content', 'pages', pageId
              );
              const contentFilePath = path.join(
                __dirname, '..', '..', 'visual-editor', 'content', contentFileName
              );
              
              // Create directory if it doesn't exist
              if (!fs.existsSync(contentDirPath)) {
                fs.mkdirSync(contentDirPath, { recursive: true });
              }
              
              // Write content to file
              fs.writeFileSync(contentFilePath, JSON.stringify(item.data, null, 2));
              
              // Create database record
              await db.run(
                `INSERT INTO page_content (
                  id, page_id, section_id, content_file, position, is_published, created_by, updated_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  newId, 
                  pageId, 
                  item.section_id || null, 
                  contentFileName, 
                  i, 
                  item.is_published ? 1 : 0, 
                  userData.id, 
                  userData.id
                ]
              );
            }
          }
          
          // Remove content items that no longer exist
          const currentIds = content.map(c => c.id).filter(Boolean);
          const itemsToRemove = existingContent.filter(e => !currentIds.includes(e.id));
          
          for (const item of itemsToRemove) {
            // Delete the content file
            try {
              const contentFilePath = path.join(
                __dirname, '..', '..', 'visual-editor', 'content', item.content_file
              );
              fs.unlinkSync(contentFilePath);
            } catch (error) {
              console.error(`Error deleting content file for ${item.id}:`, error);
            }
            
            // Delete the database record
            await db.run('DELETE FROM page_content WHERE id = ?', [item.id]);
          }
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Page updated successfully' })
        };
      }
    }
    
    // Components endpoints
    if (action === 'components') {
      // List all components
      if (event.httpMethod === 'GET' && segments.length === 1) {
        const components = await db.all('SELECT * FROM components ORDER BY name');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ components })
        };
      }
    }
    
    // Templates endpoints
    if (action === 'templates') {
      // List all templates
      if (event.httpMethod === 'GET' && segments.length === 1) {
        const templates = await db.all('SELECT * FROM page_templates ORDER BY name');
        
        // Load template structures
        const templatesWithStructure = await Promise.all(
          templates.map(async (template) => {
            try {
              const structureFilePath = path.join(
                __dirname, '..', '..', 'visual-editor', 'content', template.structure_file
              );
              const structure = JSON.parse(fs.readFileSync(structureFilePath, 'utf8'));
              return { ...template, structure };
            } catch (error) {
              console.error(`Error loading template structure for ${template.id}:`, error);
              return { ...template, structure: {} };
            }
          })
        );
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ templates: templatesWithStructure })
        };
      }
    }
    
    // If we get here, the requested endpoint wasn't found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };
    
  } catch (error) {
    console.error('Error in visualEditor function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};
