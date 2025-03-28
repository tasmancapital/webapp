/**
 * Netlify Visual Editor integration
 * 
 * This file sets up content reload support for Netlify Visual Editor.
 * It listens for content change events from the Visual Editor and
 * reloads the page to reflect the changes.
 */

export function setupContentReload() {
  // Only initialize in development or on Netlify domains
  if (import.meta.env.DEV || window.location.hostname.includes('netlify')) {
    console.log('Initializing Netlify Visual Editor content reload listener');
    
    window.addEventListener('message', (event) => {
      // Check if the message is from Netlify Visual Editor
      if (
        event.data && 
        typeof event.data === 'object' && 
        (
          event.data.type === 'stackbit:contentChange' || 
          event.data.type === 'stackbit:modelChange'
        )
      ) {
        console.log('Content change detected, reloading page...');
        window.location.reload();
      }
    });
    
    // Notify parent window that we're ready to receive content change events
    if (window.parent !== window) {
      try {
        window.parent.postMessage({ type: 'stackbit:ready' }, '*');
        console.log('Sent ready signal to Netlify Visual Editor');
      } catch (error) {
        console.error('Failed to send ready signal to parent window:', error);
      }
    }
  }
}
