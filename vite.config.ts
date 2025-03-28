import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import crypto from 'crypto';

// Use a safer approach for crypto polyfill
const ensureCrypto = () => {
  if (typeof globalThis.crypto === 'undefined') {
    // @ts-expect-error - Assigning crypto polyfill
    globalThis.crypto = crypto.webcrypto;
  }
};

// Call the function to ensure crypto is available
ensureCrypto();

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    // Allow connections from Netlify Visual Editor
    cors: true,
    hmr: {
      // Enable HMR for content changes
      overlay: true
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});