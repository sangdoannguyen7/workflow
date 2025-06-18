import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base: '/manager/',
  // server: {
  //   port: 3000
  // },
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
