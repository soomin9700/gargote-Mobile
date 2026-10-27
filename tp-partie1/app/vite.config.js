import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // permet d'écrire  import api from '@/services/api'
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 8100, host: true },
});
