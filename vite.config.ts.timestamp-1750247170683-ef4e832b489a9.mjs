// vite.config.ts
import { defineConfig } from "file:///app/code/node_modules/vite/dist/node/index.js";
import react from "file:///app/code/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  // base: '/manager/',
  // server: {
  //   port: 3000
  // },
  server: {
    proxy: {
      "/v1": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
        // Không cần rewrite nếu không đổi path
        // rewrite: (path) => path.replace(/^\/v1/, '/v1')
      }
    }
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          var _a;
          let extType = (_a = assetInfo == null ? void 0 : assetInfo.name) == null ? void 0 : _a.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || "js")) {
            extType = "img";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: `assets/js/[name]-[hash].js`,
        entryFileNames: `assets/js/[name]-[hash].js`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBiYXNlOiAnL21hbmFnZXIvJyxcbiAgLy8gc2VydmVyOiB7XG4gIC8vICAgcG9ydDogMzAwMFxuICAvLyB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgXCIvdjFcIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwXCIsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgLy8gS2hcdTAwRjRuZyBjXHUxRUE3biByZXdyaXRlIG5cdTFFQkZ1IGtoXHUwMEY0bmcgXHUwMTExXHUxRUQ1aSBwYXRoXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC92MS8sICcvdjEnKVxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgbGV0IGV4dFR5cGUgPSBhc3NldEluZm8/Lm5hbWU/LnNwbGl0KFwiLlwiKS5hdCgxKTtcblxuICAgICAgICAgIGlmICgvcG5nfGpwZT9nfHN2Z3xnaWZ8dGlmZnxibXB8aWNvL2kudGVzdChleHRUeXBlIHx8IFwianNcIikpIHtcbiAgICAgICAgICAgIGV4dFR5cGUgPSBcImltZ1wiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7ZXh0VHlwZX0vW25hbWVdLVtoYXNoXVtleHRuYW1lXWA7XG4gICAgICAgIH0sXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiBgYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanNgLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogYGFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzYCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2TSxTQUFTLG9CQUFvQjtBQUMxTyxPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUsxQixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUE7QUFBQTtBQUFBLE1BR1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGdCQUFnQixDQUFDLGNBQWM7QUF2QnZDO0FBd0JVLGNBQUksV0FBVSw0Q0FBVyxTQUFYLG1CQUFpQixNQUFNLEtBQUssR0FBRztBQUU3QyxjQUFJLGtDQUFrQyxLQUFLLFdBQVcsSUFBSSxHQUFHO0FBQzNELHNCQUFVO0FBQUEsVUFDWjtBQUVBLGlCQUFPLFVBQVUsT0FBTztBQUFBLFFBQzFCO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
