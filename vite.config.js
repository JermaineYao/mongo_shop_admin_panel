// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: './',
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src/'),
//       '@img': path.resolve(__dirname, 'src/assets/image'),
//       '@css': path.resolve(__dirname, 'src/assets/style'),
//       '@views': path.resolve(__dirname, 'src/views'),
//       '@comp': path.resolve(__dirname, 'src/components')
//     }
//   },
//   server: {
//     cors: true,
//     host: '127.0.0.1',
//     port: 12345
//     // https: true
//   }
// })

import eslint from 'vite-plugin-eslint'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [eslint(), react(), tailwindcss()],
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
    cors: true,
    host: '127.0.0.1',
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.pem'))
    }
  }
  // server: {
  //   host: '0.0.0.0', // 允許區網訪問
  //   port: 3000,
  //   cors: {
  //     origin: '*', // 或者指定特定的來源
  //     methods: ['GET', 'POST'],
  //     allowedHeaders: ['Content-Type', 'Authorization'],
  //     credentials: true
  //   }
  // }
})
