import { createApp } from 'vue'
import App from './App.vue'
// 字节图标库
import { install } from '@icon-park/vue-next/es/all'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)
install(app)
app.mount('#lyrics')
