import { createMemoryHistory, createRouter } from 'vue-router'

import AppLayout from "./views/layouts/AppLayout.vue";
import SetupView from "./views/setup/SetupView.vue";
import LoginView from "./views/login/LoginView.vue";
import PasswordsView from "./views/passwords/PasswordsView.vue";

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        redirect: '/login', // Default fallback if no routing logic runs
      },
      {
        path: 'setup',
        name: 'SetupView',
        component: SetupView,
      },
      {
        path: 'login',
        name: 'LoginView',
        component: LoginView,
      },
      {
        path: 'passwords',
        name: 'PasswordsView',
        component: PasswordsView,
      },
    ]
  },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
