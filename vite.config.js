import eslint from 'vite-plugin-eslint'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [eslint(), react()],
  base: '/', // 部署時視需求修改
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@img': path.resolve(__dirname, 'src/assets/image'),
      '@css': path.resolve(__dirname, 'src/assets/style'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@comp': path.resolve(__dirname, 'src/components')
    }
  }
})
