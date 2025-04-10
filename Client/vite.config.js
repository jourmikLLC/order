import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://order-two-gamma.vercel.app/',
        changeOrigin: true,
        secure: true, // Set to true for HTTPS
        logLevel: 'debug',
      },
    },
    historyApiFallback: true // Ensures React Router works on refresh
  }
});
