import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Cualquier petición que comience con /api será redirigida
      // string shorthand: http://localhost:5173/api -> http://localhost:3000/api
      '/api': 'http://localhost:3001' // Change 3000 to your backend's port
    },
  },
})