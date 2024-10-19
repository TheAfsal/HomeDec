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
});
