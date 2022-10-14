import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue';

import App from './App.vue'
import router from './router/index'

const pinia = createPinia()
const app = createApp(App)

app.use(
    createAuth0({
        domain: "dev-djm6hoiw.us.auth0.com",
        client_id: "SxrozmXqzNnaaE08Os4m7PC8bwBLA9E0",
        audience: "https://vue-web2-api.com",
        redirect_uri: window.location.origin
    })
);

app.use(router);
app.use(pinia)
app.mount('#app')
