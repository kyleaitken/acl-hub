import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
          output: {
              manualChunks: id => {
                  if (id.includes("@fluentui/react-icons")) {
                      return "fluentui-icons";
                  } else if (id.includes("@fluentui/react")) {
                      return "fluentui-react";
                  } else if (id.includes("node_modules")) {
                      return "vendor";
                  }
              }
          }
      }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // target: 'http://api:3000', // use this when running frontend in a cotainer
        target: 'http://localhost:3000', // Docker service name and port for backend API
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  }
})