import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import {viteSingleFile} from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteSingleFile({ 
      useRecommendedBuildConfig: false,
      inlinePattern: [ "**/*.css"]
    }),
    createHtmlPlugin({
      minify: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: '../built',
    emptyOutDir: true,
    minify: 'terser',
  }
})
