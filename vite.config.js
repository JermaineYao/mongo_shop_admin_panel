import eslint from 'vite-plugin-eslint'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const apiUrl = switchDevBaseUrl(env.VITE_EXCUTION_MODE)

  function switchDevBaseUrl(devMode) {
    switch (devMode) {
      case 'DEV':
        return env.VITE_DEV_URL

      case 'PROD':
        return null
    }
  }

  return defineConfig({
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
    },
    server: {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.pem'))
      },
      port: '3000',
      proxy: {
        '/api/v1': {
          target: apiUrl,
          changeOrigin: true,
          pathRewrite: {
            '^/api/v1': ''
          }
        }
      }
    }
  })
}
