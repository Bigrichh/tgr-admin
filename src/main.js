import './tailwind/tailwind.css'

import { auth } from './firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

let app;
onAuthStateChanged(auth, () => {
    if (!app) {
        app = createApp(App);
        app.use(createPinia())
        app.use(router);
        app.mount('#app');
    }
})
