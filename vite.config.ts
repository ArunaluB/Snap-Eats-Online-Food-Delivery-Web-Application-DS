import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'global': 'globalThis',
  },  
  optimizeDeps: {
    include: ['react-map-gl', 'maplibre-gl'],
  },
});
