# Tasman Capital Visual Editor Implementation Guide

## Overview

This document outlines the implementation plan for a visual editing system for the Tasman Capital website, inspired by Netlify's Visual Editor and WordPress Elementor. The goal is to create an intuitive, WYSIWYG editing experience that allows content editors to make changes directly on the page, using SQLite with a file-based approach for all content management including authentication.

## Architecture

### Core Components

1. **Content Source Interface**
   - Connects to SQLite database file
   - File-based content storage for pages and components
   - Handles content synchronization with minimal overhead

2. **Visual Editor UI**
   - Split-screen interface with live preview
   - Component library sidebar
   - Property editing panel
   - Inline editing capabilities

3. **Annotation System**
   - HTML data attributes for mapping UI elements to content
   - Component wrappers for simplified annotation

4. **Content Reload Mechanism**
   - Event-based content updates
   - Efficient DOM updates without full page reloads

5. **File-Based Authentication**
   - Simple JSON file for user credentials with hashed passwords
   - Role-based permissions stored in SQLite

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

#### SQLite Database Setup

```javascript
// SQLite database initialization
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./content/tasman-site.db');

// Create tables for content storage
db.serialize(() => {
  // Pages table
  db.run(`CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    title TEXT,
    slug TEXT UNIQUE,
    template TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  
  // Components table
  db.run(`CREATE TABLE IF NOT EXISTS components (
    id TEXT PRIMARY KEY,
    page_id TEXT,
    type TEXT,
    content TEXT, /* JSON content */
    position INTEGER,
    FOREIGN KEY (page_id) REFERENCES pages(id)
  )`);
  
  // Users table for authentication
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password_hash TEXT,
    role TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});
```

#### File-Based Content Storage

```javascript
// File system utilities for content management
const fs = require('fs');
const path = require('path');

// Content directory structure
const CONTENT_DIR = './content';
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');
const MEDIA_DIR = path.join(CONTENT_DIR, 'media');
const TEMPLATES_DIR = path.join(CONTENT_DIR, 'templates');

// Ensure directories exist
[CONTENT_DIR, PAGES_DIR, MEDIA_DIR, TEMPLATES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Save page content to both SQLite and file system
const savePage = async (pageId, pageData) => {
  // Save to SQLite for querying and relationships
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO pages (id, title, slug, template, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  stmt.run(pageId, pageData.title, pageData.slug, pageData.template);
  stmt.finalize();
  
  // Save full content to file system for easy access
  const pageFilePath = path.join(PAGES_DIR, `${pageData.slug}.json`);
  fs.writeFileSync(pageFilePath, JSON.stringify(pageData, null, 2));
  
  return { id: pageId, ...pageData };
};
```

#### Content Schema Definition

```javascript
// Example schema for a page component
const heroSchema = {
  type: 'object',
  name: 'hero',
  label: 'Hero Section',
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true
    },
    {
      type: 'string',
      name: 'subtitle',
      label: 'Subtitle'
    },
    {
      type: 'image',
      name: 'backgroundImage',
      label: 'Background Image'
    }
  ]
};
```

#### Component Annotation System

```jsx
// Higher-order component for annotating elements
const Editable = ({ content, fieldPath, children, objectId }) => {
  const elementProps = objectId 
    ? { 'data-sb-object-id': objectId } 
    : {};
  
  if (fieldPath) {
    elementProps['data-sb-field-path'] = fieldPath;
  }
  
  return (
    <div {...elementProps}>
      {children || content}
    </div>
  );
};

// Usage example
<Editable objectId={section.id} fieldPath="title">
  <h1>{section.title}</h1>
</Editable>
```

#### SQLite Content Source Adapter

```typescript
// Interface for content sources
interface ContentSource {
  getContent(objectId: string): Promise<any>;
  saveContent(objectId: string, fieldPath: string, value: any): Promise<void>;
  listenForChanges(callback: (changes: any) => void): () => void;
}

// SQLite implementation
class SQLiteContentSource implements ContentSource {
  private db: any;
  private changeListeners: Set<Function> = new Set();
  
  constructor() {
    const sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('./content/tasman-site.db');
  }
  
  async getContent(objectId: string) {
    return new Promise((resolve, reject) => {
      // First check if it's a component
      this.db.get(
        'SELECT * FROM components WHERE id = ?',
        [objectId],
        (err, component) => {
          if (err) return reject(err);
          
          if (component) {
            // Parse JSON content
            component.content = JSON.parse(component.content);
            return resolve(component);
          }
          
          // If not a component, check if it's a page
          this.db.get(
            'SELECT * FROM pages WHERE id = ?',
            [objectId],
            (err, page) => {
              if (err) return reject(err);
              
              if (page) {
                // Load full page content from file
                const pageFilePath = path.join(PAGES_DIR, `${page.slug}.json`);
                if (fs.existsSync(pageFilePath)) {
                  const pageContent = JSON.parse(fs.readFileSync(pageFilePath, 'utf8'));
                  return resolve(pageContent);
                }
                
                return resolve(page);
              }
              
              reject(new Error(`Content with ID ${objectId} not found`));
            }
          );
        }
      );
    });
  }
  
  async saveContent(objectId: string, fieldPath: string, value: any) {
    // First determine if we're updating a page or component
    const content = await this.getContent(objectId);
    
    // Parse the field path to determine the content structure
    const [field, ...subFields] = fieldPath.split('.');
    
    // Update the content
    let updatedContent;
    
    if (content.content) {
      // It's a component
      updatedContent = { ...content };
      
      if (subFields.length === 0) {
        updatedContent.content[field] = value;
      } else {
        let current = updatedContent.content;
        for (let i = 0; i < subFields.length - 1; i++) {
          if (!current[subFields[i]]) current[subFields[i]] = {};
          current = current[subFields[i]];
        }
        current[subFields[subFields.length - 1]] = value;
      }
      
      // Save back to SQLite
      return new Promise((resolve, reject) => {
        this.db.run(
          'UPDATE components SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [JSON.stringify(updatedContent.content), objectId],
          (err) => {
            if (err) return reject(err);
            
            // Notify listeners
            this.notifyChangeListeners({ 
              type: 'component', 
              id: objectId, 
              fieldPath, 
              value 
            });
            
            resolve();
          }
        );
      });
    } else {
      // It's a page
      updatedContent = { ...content };
      
      if (subFields.length === 0) {
        updatedContent[field] = value;
      } else {
        let current = updatedContent;
        for (let i = 0; i < subFields.length - 1; i++) {
          if (!current[subFields[i]]) current[subFields[i]] = {};
          current = current[subFields[i]];
        }
        current[subFields[subFields.length - 1]] = value;
      }
      
      // Save to file system
      const pageFilePath = path.join(PAGES_DIR, `${updatedContent.slug}.json`);
      fs.writeFileSync(pageFilePath, JSON.stringify(updatedContent, null, 2));
      
      // Update SQLite with basic metadata
      return new Promise((resolve, reject) => {
        this.db.run(
          'UPDATE pages SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [updatedContent.title, objectId],
          (err) => {
            if (err) return reject(err);
            
            // Notify listeners
            this.notifyChangeListeners({ 
              type: 'page', 
              id: objectId, 
              fieldPath, 
              value 
            });
            
            resolve();
          }
        );
      });
    }
  }
  
  listenForChanges(callback) {
    this.changeListeners.add(callback);
    return () => {
      this.changeListeners.delete(callback);
    };
  }
  
  private notifyChangeListeners(payload) {
    // Emit content change event to DOM
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('contentChanged', {
        detail: payload
      }));
    }
    
    // Call all registered listeners
    this.changeListeners.forEach(listener => {
      listener(payload);
    });
  }
}
```

#### File-Based Authentication System

```typescript
// Simple file-based authentication
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

class FileBasedAuth {
  private usersDbPath: string;
  
  constructor() {
    this.usersDbPath = path.join(CONTENT_DIR, 'users.json');
    
    // Initialize users file if it doesn't exist
    if (!fs.existsSync(this.usersDbPath)) {
      // Create with default admin user
      const defaultAdmin = {
        id: 'admin-' + Date.now(),
        username: 'admin@tasman',
        // Default password: Tasman!!2025
        password_hash: '$2b$10$XYZ...', // This would be an actual bcrypt hash
        role: 'admin'
      };
      
      fs.writeFileSync(
        this.usersDbPath, 
        JSON.stringify({ users: [defaultAdmin] }, null, 2)
      );
    }
  }
  
  async authenticate(username: string, password: string) {
    const users = JSON.parse(fs.readFileSync(this.usersDbPath, 'utf8')).users;
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return null;
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (passwordMatch) {
      // Don't return the password hash
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }
  
  async createUser(username: string, password: string, role: string = 'editor') {
    const users = JSON.parse(fs.readFileSync(this.usersDbPath, 'utf8')).users;
    
    // Check if user already exists
    if (users.some(u => u.username === username)) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: 'user-' + Date.now(),
      username,
      password_hash,
      role
    };
    
    // Add to users file
    users.push(newUser);
    fs.writeFileSync(
      this.usersDbPath,
      JSON.stringify({ users }, null, 2)
    );
    
    // Don't return the password hash
    const { password_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
```

### Phase 2: Visual Editor UI (Weeks 3-4)

#### Editor Layout Component

```jsx
const VisualEditor = ({ pageId }) => {
  const [activeTab, setActiveTab] = useState('components');
  const [previewMode, setPreviewMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('tasman_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, []);
  
  // If not authenticated, show login
  if (!isAuthenticated) {
    return <LoginScreen onLogin={(user) => {
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('tasman_user', JSON.stringify(user));
    }} />;
  }
  
  return (
    <div className="visual-editor">
      <header className="visual-editor-header">
        <div className="visual-editor-logo">
          <img src="/logo.svg" alt="Tasman Capital" />
        </div>
        <div className="visual-editor-user">
          {user.username} ({user.role})
          <button onClick={() => {
            localStorage.removeItem('tasman_user');
            setIsAuthenticated(false);
            setUser(null);
          }}>Logout</button>
        </div>
        <div className="visual-editor-actions">
          <button onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button className="primary">Publish</button>
        </div>
      </header>
      
      <div className="visual-editor-body">
        <aside className="visual-editor-sidebar">
          <div className="visual-editor-tabs">
            <button 
              className={activeTab === 'components' ? 'active' : ''}
              onClick={() => setActiveTab('components')}
            >
              Components
            </button>
            <button 
              className={activeTab === 'styles' ? 'active' : ''}
              onClick={() => setActiveTab('styles')}
            >
              Styles
            </button>
            <button 
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
          
          <div className="visual-editor-tab-content">
            {activeTab === 'components' && (
              <ComponentLibrary onAddComponent={(component) => {
                // Add component logic
              }} />
            )}
            
            {activeTab === 'styles' && (
              <StyleControls selectedElement={/* selected element */} />
            )}
            
            {activeTab === 'settings' && (
              <PageSettings pageId={pageId} />
            )}
          </div>
        </aside>
        
        <main className="visual-editor-canvas">
          <EditablePreview 
            pageId={pageId} 
            previewMode={previewMode} 
          />
        </main>
        
        <aside className="visual-editor-properties">
          <PropertyEditor selectedElement={/* selected element */} />
        </aside>
      </div>
    </div>
  );
};
```

#### Login Screen Component

```jsx
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-logo">
          <img src="/logo.svg" alt="Tasman Capital" />
        </div>
        
        <h2>Visual Editor Login</h2>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
```

#### Component Library

```jsx
const ComponentLibrary = ({ onAddComponent }) => {
  // Load component templates from file system
  const [templates, setTemplates] = useState([]);
  
  useEffect(() => {
    const loadTemplates = async () => {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data.templates);
    };
    
    loadTemplates();
  }, []);
  
  return (
    <div className="component-library">
      <h3>Add Components</h3>
      
      <div className="component-categories">
        <button className="active">All</button>
        <button>Headers</button>
        <button>Content</button>
        <button>Media</button>
        <button>Forms</button>
      </div>
      
      <div className="component-grid">
        {templates.map(template => (
          <div 
            key={template.id} 
            className="component-item"
            onClick={() => onAddComponent(template)}
          >
            <div className="component-preview">
              <img src={template.thumbnail} alt={template.name} />
            </div>
            <div className="component-name">{template.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Phase 3: Drag-and-Drop Interface (Weeks 5-6)

#### Draggable Component Implementation

```jsx
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

const DraggableComponent = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="draggable-component"
    >
      {children}
      <div className="component-controls">
        <button className="move-up">↑</button>
        <button className="move-down">↓</button>
        <button className="delete">×</button>
      </div>
    </div>
  );
};

const DroppableZone = ({ id, children, onDrop }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  
  return (
    <div 
      ref={setNodeRef} 
      className={`droppable-zone ${isOver ? 'is-over' : ''}`}
    >
      {children}
    </div>
  );
};

const EditablePreview = ({ pageId }) => {
  const [content, setContent] = useState(null);
  const contentSource = useContentSource();
  
  useEffect(() => {
    const loadContent = async () => {
      const pageContent = await contentSource.getContent(pageId);
      setContent(pageContent);
    };
    
    loadContent();
  }, [pageId]);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Handle component reordering or placement
      // Update the content structure
      // Save changes to SQLite
    }
  };
  
  if (!content) {
    return <div className="loading">Loading content...</div>;
  }
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="editable-preview">
        {content.components.map((component, index) => (
          <DroppableZone 
            key={`drop-${index}`} 
            id={`drop-${index}`}
            onDrop={(item) => {
              // Handle drop logic
            }}
          >
            <DraggableComponent id={component.id}>
              <Editable 
                objectId={component.id} 
                fieldPath="content"
              >
                <ComponentRenderer 
                  type={component.type} 
                  content={component.content} 
                />
              </Editable>
            </DraggableComponent>
          </DroppableZone>
        ))}
        
        <DroppableZone 
          id="drop-end" 
          onDrop={(item) => {
            // Handle drop at end
          }}
        >
          <div className="drop-placeholder">Drop components here</div>
        </DroppableZone>
      </div>
    </DndContext>
  );
};
```

### Phase 4: Inline Editing (Weeks 7-8)

#### Rich Text Editor Integration

```jsx
import { Editor, EditorState, ContentState, RichUtils } from 'draft-js';

const InlineTextEditor = ({ content, onSave }) => {
  const [editorState, setEditorState] = useState(() => 
    EditorState.createWithContent(
      ContentState.createFromText(content || '')
    )
  );
  const [editing, setEditing] = useState(false);
  
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };
  
  const startEditing = () => {
    setEditing(true);
  };
  
  const saveChanges = () => {
    const contentText = editorState.getCurrentContent().getPlainText();
    onSave(contentText);
    setEditing(false);
  };
  
  if (!editing) {
    return (
      <div className="inline-editor-display" onClick={startEditing}>
        {content}
        <div className="edit-indicator">Click to edit</div>
      </div>
    );
  }
  
  return (
    <div className="inline-editor-container">
      <div className="toolbar">
        <button onClick={() => {
          setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
        }}>Bold</button>
        <button onClick={() => {
          setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
        }}>Italic</button>
        <button onClick={() => {
          setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
        }}>Underline</button>
      </div>
      
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
      />
      
      <div className="editor-actions">
        <button onClick={() => setEditing(false)}>Cancel</button>
        <button onClick={saveChanges}>Save</button>
      </div>
    </div>
  );
};

// Usage within components
const EditableText = ({ objectId, fieldPath, initialContent }) => {
  const contentSource = useContentSource();
  
  const handleSave = async (newContent) => {
    await contentSource.saveContent(objectId, fieldPath, newContent);
  };
  
  return (
    <InlineTextEditor 
      content={initialContent} 
      onSave={handleSave} 
    />
  );
};
```

## Deployment Strategy

1. **Development Phase**
   - Implement core features locally
   - Test with sample content
   - Create SQLite database schema and file structure

2. **Testing Phase**
   - Deploy to staging environment
   - Populate with real content
   - Test authentication and permissions
   - Verify file-based storage works correctly

3. **Production Deployment**
   - Set up proper file permissions for content directories
   - Configure backup system for SQLite database and content files
   - Implement content versioning for rollbacks
   - Deploy with proper security measures

## Security Considerations

1. **Authentication**
   - Securely hash passwords with bcrypt
   - Implement proper session management
   - Rate limit login attempts

2. **Content Security**
   - Validate and sanitize all user inputs
   - Implement proper file upload restrictions
   - Set appropriate file permissions

3. **Backup Strategy**
   - Regular backups of SQLite database
   - Version control for content files
   - Disaster recovery plan
