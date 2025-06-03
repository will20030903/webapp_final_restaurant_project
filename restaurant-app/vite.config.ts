import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 設定開發伺服器的端口
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 後端API的地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 重寫路徑
      }
    },
    host: '163.25.107.227',
  }
})
