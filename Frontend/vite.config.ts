import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Ensure lucide-react is pre-bundled by Vite to avoid runtime requests
    // to /node_modules/... for individual icon modules which can fail in some setups.
    include: ['lucide-react'],
  },
});
