import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/route'
import PrimeVue from 'primevue/config'
import AnimateOnScroll from 'primevue/animateonscroll'
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast'

import 'sweetalert2/dist/sweetalert2.min.css'
import './assets/alert.css'

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.use(ToastService);
app.directive('animateonscroll', AnimateOnScroll)
app.component('Toast', Toast)
app.mount('#app')

