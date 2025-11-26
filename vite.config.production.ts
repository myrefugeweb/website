import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production-optimized Vite configuration
export default defineConfig({
  plugins: [react()],
  base: '/',
  
  // Production optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for production debugging (optional)
    sourcemap: false, // Set to true if you need source maps in production
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'animation-vendor': ['framer-motion'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Target modern browsers
    target: 'es2015',
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js', 'framer-motion'],
  },
  
  // Server configuration (for preview)
  server: {
    port: 5173,
    strictPort: true,
  },
  
  preview: {
    port: 4173,
    strictPort: true,
  },
});

