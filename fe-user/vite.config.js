import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Giữ nguyên các file tĩnh trong public, không bị Vite inject JS
      input: {
        main: 'index.html',
      },
    },
  },
  publicDir: 'public', // đảm bảo Vite copy toàn bộ file trong public
})

