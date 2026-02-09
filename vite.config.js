import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import svgr from "vite-plugin-svgr"
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-jsx"],
      },
    }),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress' })
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // React vendor code
          'react-vendor': ['react', 'react-dom'],
          // GSAP core library
          'gsap-core': ['gsap', '@gsap/react'],
          // GSAP plugins
          'gsap-plugins': [
            'gsap/ScrollTrigger',
            'gsap/ScrollToPlugin',
            'gsap/ScrollSmoother'
          ]
        }
      }
    }
  }
})
