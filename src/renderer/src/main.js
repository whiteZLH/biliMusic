// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import './assets/fonts/iconfont.css'
import './assets/css/reset.css'
// 字节图标库
import { install } from '@icon-park/vue-next/es/all'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)
install(app)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(router)
app.mount('#app')
