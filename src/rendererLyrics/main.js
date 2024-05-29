import { createApp } from 'vue'
import App from './App.vue'
import './assets/fonts/iconfont.css'
import './assets/css/reset.css'
// 字节图标库
import { install } from '@icon-park/vue-next/es/all'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)
install(app)
app.mount('#lyrics')
