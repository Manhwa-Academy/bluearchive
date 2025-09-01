// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      crypto: 'crypto-browserify', // Thay thế crypto của Node bằng crypto-browserify
    },
  },
})
