import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import jwtGuard from './jwt-guard'

router.beforeEach((to, from, next) => jwtGuard(to, from, next))

createApp(App).use(router).mount('#app')
