import { Handler } from '@netlify/functions';
import * as path from 'path';
import * as fs from 'fs';
import { Database } from 'sqlite3';
import { open } from 'sqlite';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Secret for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'tasman-visual-editor-secret';

// Hardcoded admin credentials for simplicity
// In a production environment, these should be stored in environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tasmancapital.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

// Database connection
const getDb = async () => {
  // Check if we're in the Netlify environment
  const isNetlify = process.env.NETLIFY === 'true';
  console.log('Environment:', isNetlify ? 'Netlify' : 'Local');
  console.log('Environment variables:', {
    NETLIFY: process.env.NETLIFY,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET ? 'Set (value hidden)' : 'Not set'
  });
  
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
      console.log('Database file does not exist in /tmp, copying from pre-built file');
      
      // Path to the pre-built database file
      const sourceDbPath = path.join(__dirname, '..', '..', 'data', 'visual-editor.db');
      console.log('Source database path:', sourceDbPath);
      
      try {
        // Check if source file exists
        const sourceExists = fs.existsSync(sourceDbPath);
        console.log('Source database exists:', sourceExists);
        
        if (sourceExists) {
          // Get source file stats
          const sourceStats = fs.statSync(sourceDbPath);
          console.log('Source database stats:', {
            size: sourceStats.size,
            permissions: sourceStats.mode.toString(8),
            isFile: sourceStats.isFile()
          });
          
          // Copy the pre-built database file to /tmp
          fs.copyFileSync(sourceDbPath, dbPath);
          console.log('Pre-built database file copied to /tmp successfully');
          
          // Set permissions on the copied file
          fs.chmodSync(dbPath, 0o666);
          console.log('File permissions set to 666 (readable and writable)');
          
          // Verify the copied file
          const destExists = fs.existsSync(dbPath);
          console.log('Destination database exists:', destExists);
          
          if (destExists) {
            const destStats = fs.statSync(dbPath);
            console.log('Destination database stats:', {
              size: destStats.size,
              permissions: destStats.mode.toString(8),
              isFile: destStats.isFile()
            });
          }
        } else {
          console.error('Source database file does not exist');
        }
      } catch (copyError) {
        console.error('Error copying pre-built database file:', copyError);
      }
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
        // Try to fix permissions
        try {
          fs.chmodSync(dbPath, 0o666);
          console.log('Updated file permissions to 666');
        } catch (chmodError) {
          console.error('Failed to update file permissions:', chmodError);
        }
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
const validateToken = async (token: string): Promise<Record<string, unknown>> => {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch (error) {
    console.error('Token validation error:', error);
    throw new Error('Invalid token');
  }
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }
  
  try {
    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { action, data } = body;
    
    // Login endpoint
    if (action === 'login') {
      const { email, password } = data;
      
      console.log('Login attempt:', { email });
      
      if (!email || !password) {
        console.log('Login failed: Email or password missing');
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: 'Email and password are required'
          })
        };
      }
      
      // Simple credential check against hardcoded values
      if (email !== ADMIN_EMAIL) {
        console.log('Login failed: User not found');
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          })
        };
      }
      
      const passwordMatch = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
      console.log('Password check result:', passwordMatch ? 'Password matches' : 'Password does not match');
      
      if (!passwordMatch) {
        console.log('Login failed: Password does not match');
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          })
        };
      }
      
      // Generate JWT token
      console.log('Generating JWT token...');
      const token = jwt.sign(
        { id: 'admin-user', email: ADMIN_EMAIL, isAdmin: true },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          token,
          user: {
            id: 'admin-user',
            email: ADMIN_EMAIL,
            name: 'Admin User',
            isAdmin: true
          }
        })
      };
    }
    
    // All other endpoints require authentication
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    
    if (!token) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Authentication required'
        })
      };
    }
    
    try {
      // Validate token but we don't need to use the decoded value directly
      await validateToken(token);
    } catch (error) {
      // Token validation failed
      console.error('Token validation failed:', error);
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Invalid or expired token'
        })
      };
    }
    
    const db = await getDb();
    
    // Pages endpoints
    if (action === 'pages') {
      const subAction = data?.subAction;
      
      if (subAction === 'list') {
        const pages = await db.all('SELECT * FROM pages ORDER BY updated_at DESC');
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            pages
          })
        };
      }
      
      if (subAction === 'get') {
        const { id, slug } = data;
        let page;
        
        if (id) {
          page = await db.get('SELECT * FROM pages WHERE id = ?', [id]);
        } else if (slug) {
          page = await db.get('SELECT * FROM pages WHERE slug = ?', [slug]);
        }
        
        if (!page) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'Page not found'
            })
          };
        }
        
        // Get components for this page
        const components = await db.all(
          'SELECT * FROM components WHERE page_id = ? ORDER BY sort_order ASC',
          [page.id]
        );
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            page: {
              ...page,
              components
            }
          })
        };
      }
      
      if (subAction === 'create') {
        const { title, slug, description, metaTitle, metaDescription, isPublished, templateId } = data;
        
        // Check if slug already exists
        const existingPage = await db.get('SELECT * FROM pages WHERE slug = ?', [slug]);
        if (existingPage) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'A page with this slug already exists'
            })
          };
        }
        
        const pageId = uuidv4();
        await db.run(
          `INSERT INTO pages (
            id, slug, title, description, meta_title, meta_description, is_published, template_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pageId,
            slug,
            title,
            description || null,
            metaTitle || null,
            metaDescription || null,
            isPublished ? 1 : 0,
            templateId || null
          ]
        );
        
        const newPage = await db.get('SELECT * FROM pages WHERE id = ?', [pageId]);
        
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            page: newPage
          })
        };
      }
      
      if (subAction === 'update') {
        const { id, title, slug, description, metaTitle, metaDescription, isPublished, templateId } = data;
        
        // Check if page exists
        const existingPage = await db.get('SELECT * FROM pages WHERE id = ?', [id]);
        if (!existingPage) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'Page not found'
            })
          };
        }
        
        // Check if slug is being changed and if it already exists
        if (slug !== existingPage.slug) {
          const slugExists = await db.get('SELECT * FROM pages WHERE slug = ? AND id != ?', [slug, id]);
          if (slugExists) {
            return {
              statusCode: 400,
              headers: corsHeaders,
              body: JSON.stringify({
                success: false,
                message: 'A page with this slug already exists'
              })
            };
          }
        }
        
        await db.run(
          `UPDATE pages SET
            slug = ?,
            title = ?,
            description = ?,
            meta_title = ?,
            meta_description = ?,
            is_published = ?,
            template_id = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [
            slug,
            title,
            description || null,
            metaTitle || null,
            metaDescription || null,
            isPublished ? 1 : 0,
            templateId || null,
            id
          ]
        );
        
        const updatedPage = await db.get('SELECT * FROM pages WHERE id = ?', [id]);
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            page: updatedPage
          })
        };
      }
      
      if (subAction === 'delete') {
        const { id } = data;
        
        // Check if page exists
        const existingPage = await db.get('SELECT * FROM pages WHERE id = ?', [id]);
        if (!existingPage) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'Page not found'
            })
          };
        }
        
        // Delete components first (foreign key constraint)
        await db.run('DELETE FROM components WHERE page_id = ?', [id]);
        
        // Delete the page
        await db.run('DELETE FROM pages WHERE id = ?', [id]);
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            message: 'Page deleted successfully'
          })
        };
      }
    }
    
    // Components endpoints
    if (action === 'components') {
      const subAction = data?.subAction;
      
      if (subAction === 'create') {
        const { pageId, sectionId, sortOrder, componentData } = data;
        
        // Check if page exists
        const existingPage = await db.get('SELECT * FROM pages WHERE id = ?', [pageId]);
        if (!existingPage) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'Page not found'
            })
          };
        }
        
        // Check if section exists
        const existingSection = await db.get('SELECT * FROM sections WHERE id = ?', [sectionId]);
        if (!existingSection) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'Section not found'
            })
          };
        }
        
        const componentId = uuidv4();
        await db.run(
          `INSERT INTO components (
            id, section_id, page_id, sort_order, data
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            componentId,
            sectionId,
            pageId,
            sortOrder,
            componentData ? JSON.stringify(componentData) : null
          ]
        );
        
        const newComponent = await db.get('SELECT * FROM components WHERE id = ?', [componentId]);
        
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            component: newComponent
          })
        };
      }
      
      if (subAction === 'update') {
        const { id, sortOrder, componentData } = data;
        
        // Check if component exists
        const existingComponent = await db.get('SELECT * FROM components WHERE id = ?', [id]);
        if (!existingComponent) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'Component not found'
            })
          };
        }
        
        await db.run(
          `UPDATE components SET
            sort_order = ?,
            data = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [
            sortOrder !== undefined ? sortOrder : existingComponent.sort_order,
            componentData ? JSON.stringify(componentData) : existingComponent.data,
            id
          ]
        );
        
        const updatedComponent = await db.get('SELECT * FROM components WHERE id = ?', [id]);
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            component: updatedComponent
          })
        };
      }
      
      if (subAction === 'delete') {
        const { id } = data;
        
        // Check if component exists
        const existingComponent = await db.get('SELECT * FROM components WHERE id = ?', [id]);
        if (!existingComponent) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'Component not found'
            })
          };
        }
        
        // Delete the component
        await db.run('DELETE FROM components WHERE id = ?', [id]);
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            message: 'Component deleted successfully'
          })
        };
      }
      
      if (subAction === 'reorder') {
        const { pageId, components } = data;
        
        // Check if page exists
        const existingPage = await db.get('SELECT * FROM pages WHERE id = ?', [pageId]);
        if (!existingPage) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              message: 'Page not found'
            })
          };
        }
        
        // Update sort order for each component
        for (const component of components) {
          await db.run(
            'UPDATE components SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [component.sortOrder, component.id]
          );
        }
        
        // Get updated components
        const updatedComponents = await db.all(
          'SELECT * FROM components WHERE page_id = ? ORDER BY sort_order ASC',
          [pageId]
        );
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            components: updatedComponents
          })
        };
      }
    }
    
    // Sections endpoints
    if (action === 'sections') {
      const subAction = data?.subAction;
      
      if (subAction === 'list') {
        const sections = await db.all('SELECT * FROM sections ORDER BY name ASC');
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            sections
          })
        };
      }
    }
    
    // If we get here, the action was not recognized
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Invalid action'
      })
    };
  } catch (error) {
    console.error('Error in visual editor function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error'
      })
    };
  }
};
