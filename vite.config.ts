import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Added React plugin for Vite
  define: {
    'global': 'globalThis', // Preserve your existing global definition
  },
  optimizeDeps: {
    include: ['react-map-gl', 'maplibre-gl'], // Preserve your existing dependency optimization
  },
  server: {
    proxy: {
      '/stripe': {
        target: 'https://r.stripe.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/stripe/, ''),
        headers: {
          'Origin': 'https://js.stripe.com',
          'Referer': 'https://js.stripe.com/v3/',
        },
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error for r.stripe.com:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying request to:', proxyReq.path);
          });
        },
      },
    },
  },
});