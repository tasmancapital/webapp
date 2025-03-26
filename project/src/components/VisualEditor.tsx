import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash, Move, Edit, LogOut, ChevronDown, ChevronUp } from 'lucide-react';

// Define component types
type ComponentData = {
  id: string;
  type: string;
  name: string;
  data: Record<string, unknown>;
};

type PageData = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  template_id?: string;
};

type VisualEditorProps = {
  isActive?: boolean;
  onClose?: () => void;
};

/**
 * Visual Editor Component
 * 
 * This component provides a drag-and-drop interface for editing page content
 * and connects to the SQLite backend via Netlify functions.
 */
const VisualEditor: React.FC<VisualEditorProps> = ({ isActive = false, onClose }) => {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [availableComponents, setAvailableComponents] = useState<Record<string, unknown>[]>([]);
  const [draggedComponent, setDraggedComponent] = useState<ComponentData | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ComponentData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch current page data when authenticated
  const fetchCurrentPage = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      // Get the current page slug from the URL
      const slug = window.location.pathname.replace(/^\//, '') || 'home';

      // First, find the page ID by slug
      const pagesResponse = await fetch('/.netlify/functions/visualEditor/pages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!pagesResponse.ok) {
        throw new Error('Failed to fetch pages');
      }

      const pagesData = await pagesResponse.json();
      const page = pagesData.pages.find((p: PageData) => p.slug === slug);

      if (!page) {
        throw new Error(`Page not found for slug: ${slug}`);
      }

      // Then fetch the specific page with its content
      const pageResponse = await fetch(`/.netlify/functions/visualEditor/pages/${page.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!pageResponse.ok) {
        throw new Error('Failed to fetch page content');
      }

      const pageData = await pageResponse.json();
      setCurrentPage(pageData.page);
      
      // Transform content into components
      const pageComponents = pageData.content.map((content: Record<string, unknown>) => ({
        id: content.id,
        type: content.section_id,
        name: content.data?.name || 'Unnamed Component',
        data: content.data || {},
      }));
      
      setComponents(pageComponents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page');
      console.error('Error fetching page:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch available components
  const fetchAvailableComponents = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/.netlify/functions/visualEditor/components', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }

      const data = await response.json();
      setAvailableComponents(data.components);
    } catch (err) {
      console.error('Error fetching components:', err);
    }
  }, [token]);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('visualEditorToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCurrentPage();
      fetchAvailableComponents();
    }
  }, [isAuthenticated, token, fetchCurrentPage, fetchAvailableComponents]);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/visualEditor/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      localStorage.setItem('visualEditorToken', data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('visualEditorToken');
  };

  // Save page changes
  const savePage = async () => {
    if (!token || !currentPage) return;

    setIsSaving(true);
    try {
      // Transform components back to content format
      const content = components.map((component, index) => ({
        id: component.id,
        section_id: component.type,
        is_published: true,
        position: index,
        data: component.data,
      }));

      const response = await fetch(`/.netlify/functions/visualEditor/pages/${currentPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...currentPage,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save page');
      }

      // Reload the page to see changes
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save page');
      console.error('Error saving page:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (component: ComponentData) => {
    setDraggedComponent(component);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedComponent) return;

    // If dropping from component library (new component)
    if (!components.find(c => c.id === draggedComponent.id)) {
      const newComponent = {
        ...draggedComponent,
        id: crypto.randomUUID(),
      };
      
      const newComponents = [...components];
      newComponents.splice(index, 0, newComponent);
      setComponents(newComponents);
    } else {
      // Reordering existing component
      const newComponents = [...components];
      const draggedIndex = components.findIndex(c => c.id === draggedComponent.id);
      
      // Remove from old position
      newComponents.splice(draggedIndex, 1);
      
      // Add at new position
      const dropIndex = index > draggedIndex ? index - 1 : index;
      newComponents.splice(dropIndex, 0, draggedComponent);
      
      setComponents(newComponents);
    }

    setDraggedComponent(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedComponent(null);
    setDragOverIndex(null);
  };

  // Component editing
  const handleEditComponent = (component: ComponentData) => {
    setEditingComponent(component);
    setIsEditing(true);
  };

  const handleSaveComponent = (updatedData: Record<string, unknown>) => {
    if (!editingComponent) return;

    const updatedComponents = components.map(c => 
      c.id === editingComponent.id 
        ? { ...c, data: updatedData } 
        : c
    );
    
    setComponents(updatedComponents);
    setIsEditing(false);
    setEditingComponent(null);
  };

  // Delete component
  const handleDeleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  // Add component from library
  const handleAddComponent = (component: any) => {
    const newComponent = {
      id: crypto.randomUUID(),
      type: component.id,
      name: component.name,
      data: JSON.parse(component.schema).defaultContent || {},
    };
    
    setComponents([...components, newComponent]);
    setShowComponentLibrary(false);
  };

  // If the editor is not active, don't render anything
  if (!isActive) return null;

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Visual Editor Login</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>,
      document.body
    );
  }

  // Render component editor
  if (isEditing && editingComponent) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Edit Component: {editingComponent.name}</h2>
            <button 
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          
          <ComponentEditor 
            component={editingComponent} 
            onSave={handleSaveComponent} 
            onCancel={() => setIsEditing(false)} 
          />
        </motion.div>
      </div>,
      document.body
    );
  }

  // Render the main visual editor
  return createPortal(
    <div className="fixed inset-0 flex z-50" ref={editorRef}>
      {/* Editor sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-bold text-lg">Visual Editor</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-2">Current Page</h3>
          {currentPage ? (
            <div>
              <p className="text-sm mb-1"><span className="font-medium">Title:</span> {currentPage.title}</p>
              <p className="text-sm mb-1"><span className="font-medium">Slug:</span> {currentPage.slug}</p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> 
                {currentPage.is_published ? 'Published' : 'Draft'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading page information...</p>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowComponentLibrary(!showComponentLibrary)}
              className="flex items-center justify-between w-full text-left font-medium"
            >
              <span>Component Library</span>
              {showComponentLibrary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showComponentLibrary && (
              <div className="mt-2 space-y-2">
                {availableComponents.map((component) => (
                  <div 
                    key={component.id}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    draggable
                    onDragStart={() => handleDragStart({
                      id: crypto.randomUUID(),
                      type: component.id,
                      name: component.name,
                      data: JSON.parse(component.schema).defaultContent || {},
                    })}
                    onClick={() => handleAddComponent(component)}
                  >
                    <div className="font-medium text-sm">{component.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{component.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={savePage}
            disabled={isSaving}
            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            <Save size={16} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-4 rounded"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </motion.div>
      
      {/* Main content area */}
      <div className="flex-grow bg-gray-100 dark:bg-gray-900 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[calc(100vh-2rem)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                {components.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No components added yet. Drag components from the library to add them to the page.
                    </p>
                    <button
                      onClick={() => setShowComponentLibrary(true)}
                      className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Component
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {components.map((component, index) => (
                      <div
                        key={component.id}
                        ref={el => componentRefs.current[index] = el}
                        className={`border rounded-lg ${
                          dragOverIndex === index ? 'border-blue-500 border-2' : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="cursor-move p-1 mr-2"
                              draggable
                              onDragStart={() => handleDragStart(component)}
                              onDragEnd={handleDragEnd}
                            >
                              <Move size={16} />
                            </div>
                            <span className="font-medium">{component.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditComponent(component)}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteComponent(component.id)}
                              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <ComponentPreview component={component} />
                        </div>
                      </div>
                    ))}
                    
                    {/* Final drop zone */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 ${
                        dragOverIndex === components.length ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onDragOver={(e) => handleDragOver(e, components.length)}
                      onDrop={(e) => handleDrop(e, components.length)}
                    >
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        Drop component here
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * Component Editor
 * 
 * Form for editing a component's properties
 */
type ComponentEditorProps = {
  component: ComponentData;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
};

const ComponentEditor: React.FC<ComponentEditorProps> = ({ component, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, unknown>>(component.data);

  const handleChange = (key: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Render form fields based on component type
  const renderFormFields = () => {
    // This is a simplified version - in a real implementation,
    // you would fetch the component schema and generate fields dynamically
    
    return Object.entries(formData).map(([key, value]) => {
      // Skip internal fields
      if (key.startsWith('_')) return null;
      
      // Determine field type based on value type
      if (typeof value === 'string') {
        if (key.toLowerCase().includes('content') || value.length > 100) {
          // Textarea for longer text
          return (
            <div key={key} className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <textarea
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={5}
              />
            </div>
          );
        }
        
        // Input for shorter text
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        );
      }
      
      if (typeof value === 'boolean') {
        return (
          <div key={key} className="mb-4">
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange(key, e.target.checked)}
                className="mr-2"
              />
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
          </div>
        );
      }
      
      if (typeof value === 'number') {
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(key, parseFloat(e.target.value))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        );
      }
      
      // For arrays and objects, we'd need more complex editors
      // This is simplified for the example
      return null;
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderFormFields()}
      
      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

/**
 * Component Preview
 * 
 * Renders a preview of a component based on its type and data
 */
type ComponentPreviewProps = {
  component: ComponentData;
};

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ component }) => {
  // This is a simplified preview - in a real implementation,
  // you would render different previews based on component type
  
  const { data } = component;
  
  // Simple text preview for most components
  return (
    <div className="component-preview">
      {data.heading && (
        <h3 className="text-xl font-bold mb-2">{data.heading}</h3>
      )}
      
      {data.subheading && (
        <h4 className="text-lg mb-2">{data.subheading}</h4>
      )}
      
      {data.content && (
        <div className="prose dark:prose-invert max-w-none">
          {/* This is unsafe but simplified for the example */}
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
      )}
      
      {data.buttonText && (
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          {data.buttonText}
        </button>
      )}
      
      {/* For more complex components, you would render custom previews */}
    </div>
  );
};

export default VisualEditor;
