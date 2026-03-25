import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/n8n-api': {
        target: 'https://pleasing-bluebird-randomly.ngrok-free.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n-api/, ''),
      },
      '/webhook': {
        target: 'https://pleasing-bluebird-randomly.ngrok-free.app',
        changeOrigin: true,
      },
    },
  },
})
