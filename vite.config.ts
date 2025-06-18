import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base: '/manager/',
  // server: {
  //   port: 3000
  // },
  server: {
    proxy: {
      '/v1': {
        target: 'http://172.16.5.100:8082',
        changeOrigin: true,
        // Không cần rewrite nếu không đổi path
        // rewrite: (path) => path.replace(/^\/v1/, '/v1')
      }
    }
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          let extType = assetInfo?.name?.split('.').at(1);

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || 'js')) {
            extType = 'img';
          }

          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: `assets/js/[name]-[hash].js`,
        entryFileNames: `assets/js/[name]-[hash].js`,
      },
    },
  },
})
