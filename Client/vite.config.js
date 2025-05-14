import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
        '@': resolve(__dirname, 'src'),  
        '@components': resolve(__dirname, 'src/components'),  
        '@utils': resolve(__dirname, 'src/utils'),  
    },
},
server: {
  host: '0.0.0.0',  // This allows connections from any device on the network
  port: 5173,        // Optionally change this port to whatever you need
  strictPort: true,  // If you want to make sure the server fails if the port is taken
},
});
