// https://v2.vitejs.dev/guide/build.html#library-mode
// https://github.com/search?q=repo%3Avitejs%2Fvite+path%3A**vite.config.js+%22path%22&type=code
// https://vitejs.dev/guide/troubleshooting#cjs

import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'main.js'),
      name: 'OT3D',
      formats: ['es'],
      fileName: (format) => `OT3D.${format}.js`
    },
  }
})
