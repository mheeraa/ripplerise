import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // This is the port your frontend runs on
    proxy: {
      // This tells Vite to redirect any requests starting with '/api'
      // to your backend server on port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false, // Set to true for HTTPS backends
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Correct rewrite path
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})