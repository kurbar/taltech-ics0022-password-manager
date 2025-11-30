import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app/App.vue';
import {router} from "./app/router";
import './app/styles/index.css';

console.log('Renderer script loading...');

try {
  const pinia = createPinia();
  console.log('Pinia created');

  const app = createApp(App);
  console.log('App created');

  app.use(pinia);
  console.log('Pinia installed');

  app.use(router);
  console.log('Router installed');

  app.mount('#app');
  console.log('App mounted successfully');
} catch (error) {
  console.error('Failed to initialize renderer:', error);
  // Show error to user in the window
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">Application Failed to Load</h1>
      <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
      <p>Please check the console for more details.</p>
    </div>
  `;
}
