import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index:     resolve(__dirname, 'src/index.html'),
        nosotros:  resolve(__dirname, 'src/nosotros.html'),
        servicios: resolve(__dirname, 'src/servicios.html'),
        menu:      resolve(__dirname, 'src/menu.html'),
        blog:      resolve(__dirname, 'src/blog.html'),
        contacto:  resolve(__dirname, 'src/contacto.html'),
      },
    },
  },
})
