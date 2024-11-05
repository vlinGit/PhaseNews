import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import VueGtag from "vue-gtag";

const app = createApp(App)

app.use(router)
app.use(PrimeVue);
app.use(ToastService);
app.use(VueGtag, {
    config: { id: "G-6FHDG5L3H4"}
})
app.component('Toast', Toast);

app.mount('#app')