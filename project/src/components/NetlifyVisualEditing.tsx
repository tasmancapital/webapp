import React, { useState, useEffect } from 'react';
import VisualEditor from './VisualEditor';

/**
 * NetlifyVisualEditing Component
 * 
 * This component integrates with Netlify's visual editing capabilities
 * and provides a bridge to our custom SQLite-based visual editor.
 */
const NetlifyVisualEditing: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Check if we're in Netlify's visual editing mode
    const checkNetlifyEditing = () => {
      // Netlify adds a special query parameter when in visual editing mode
      const urlParams = new URLSearchParams(window.location.search);
      const isNetlifyEditing = urlParams.has('netlify-editor') || 
                               urlParams.has('nf-edit') || 
                               window.location.hostname.includes('netlify-builder');
      
      if (isNetlifyEditing) {
        setIsEditing(true);
      }
    };
    
    // Check on initial load
    checkNetlifyEditing();
    
    // Also listen for Netlify's custom events
    const handleNetlifyEvent = (event: any) => {
      if (event.type === 'netlify:editor:open') {
        setIsEditing(true);
      } else if (event.type === 'netlify:editor:close') {
        setIsEditing(false);
      }
    };
    
    window.addEventListener('netlify:editor:open', handleNetlifyEvent);
    window.addEventListener('netlify:editor:close', handleNetlifyEvent);
    
    // Add Netlify editor button if not already present
    if (!document.getElementById('netlify-visual-edit-button') && !isEditing) {
      const button = document.createElement('button');
      button.id = 'netlify-visual-edit-button';
      button.innerHTML = 'Edit in Netlify';
      button.style.position = 'fixed';
      button.style.bottom = '20px';
      button.style.right = '20px';
      button.style.zIndex = '1000';
      button.style.padding = '10px 15px';
      button.style.backgroundColor = 'var(--primary, rgb(234, 88, 12))';
      button.style.color = 'var(--primary-foreground, white)';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      button.style.cursor = 'pointer';
      button.style.fontWeight = 'bold';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      
      // Add edit icon
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Edit in Netlify
      `;
      
      button.addEventListener('click', () => {
        setIsEditing(true);
      });
      
      document.body.appendChild(button);
    }
    
    return () => {
      window.removeEventListener('netlify:editor:open', handleNetlifyEvent);
      window.removeEventListener('netlify:editor:close', handleNetlifyEvent);
      
      // Remove button on unmount
      const button = document.getElementById('netlify-visual-edit-button');
      if (button) {
        button.remove();
      }
    };
  }, []);
  
  return (
    <>
      <VisualEditor 
        isActive={isEditing} 
        onClose={() => setIsEditing(false)} 
      />
      
      {/* Add Netlify CMS script if in editing mode */}
      {isEditing && (
        <script 
          src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js" 
          async 
        />
      )}
    </>
  );
};

export default NetlifyVisualEditing;
