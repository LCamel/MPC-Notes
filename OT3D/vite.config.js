// https://v2.vitejs.dev/guide/build.html#library-mode
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'main.js'),
      name: 'OT3D',
      fileName: (format) => `OT3D.${format}.js`
    },
  }
})
