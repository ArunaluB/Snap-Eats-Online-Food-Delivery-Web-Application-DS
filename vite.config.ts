import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: {},
  },
  optimizeDeps: {
    include: ['react-map-gl', 'maplibre-gl'],
  },
});
