import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
;export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://order-two-gamma.vercel.app',
        changeOrigin: true, // For handling CORS issues
        secure: true, // Ensure it's true if you're using HTTPS
        logLevel: 'debug', // Log proxy actions for debugging
      },
    },
  },
});

