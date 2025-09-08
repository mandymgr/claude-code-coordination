import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: process.env.VERCEL ? 'dist' : '../../../dist/dev-system'
  },
  define: {
    'import.meta.env': JSON.stringify({
      MODE: process.env.NODE_ENV || 'development',
      PROD: process.env.NODE_ENV === 'production',
      DEV: process.env.NODE_ENV !== 'production'
    })
  }
})