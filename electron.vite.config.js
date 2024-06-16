// electron.vite.config.js
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
export default {
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.js'),
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.js'),
          lyrics: resolve(__dirname, 'src/preload/lyrics.js')
        }
      }
    }
  },
  renderer: {
    root: 'src',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          lyricsIndex: resolve(__dirname, 'src/rendererLyrics/index.html')
        }
      }
    },
    plugins:[vue()]
  }
}
