import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app/App.vue';
import {router} from "./app/router";
import './app/styles/index.css';

const pinia = createPinia();

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app');
