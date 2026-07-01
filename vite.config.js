import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Katı CSP (script-src 'self') ile uyum için satır-içi modulepreload
    // polyfill'ini kapatıyoruz — modern tarayıcılar modulepreload'u destekler.
    modulePreload: { polyfill: false },
  },
})
