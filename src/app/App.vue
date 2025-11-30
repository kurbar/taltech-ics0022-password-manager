<template>
  <div v-if="isCheckingAuth" class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-4"></div>
      <p class="text-white text-lg">Loading...</p>
    </div>
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApplicationStore } from '@/app/stores/application.store';
import { useRouter } from 'vue-router';

const router = useRouter();
const app = useApplicationStore();
const isCheckingAuth = ref(true);

async function checkApplicationConfig() {
  console.log('checkApplicationConfig started');
  const api = (window as any).api;

  if (!api) {
    console.error('API is not available!');
    throw new Error('API not available');
  }

  console.log('Checking if database is initialized...');
  // Check if master password has been set up (config file exists)
  const hasConfig = await api.database.isInitialized();
  console.log('hasConfig result:', hasConfig);

  console.log('Checking if database is connected...');
  // Check if database connection is actually active (from backend)
  const isDatabaseConnected = await api.database.isConnected();
  console.log('isDatabaseConnected result:', isDatabaseConnected);

  console.log('Config exists:', hasConfig);
  console.log('Database connected (backend):', isDatabaseConnected);

  // Update store to match backend state
  if (isDatabaseConnected) {
    console.log('Setting database as initialized in store');
    app.setDatabaseInitialized(true);
  }

  if (!hasConfig) {
    // No master password set up yet - go to setup
    console.log('No master password configured, routing to setup');
    await router.replace({ name: 'SetupView' });
    console.log('Routed to SetupView');
  } else if (!isDatabaseConnected) {
    // Master password exists but database not unlocked - go to login
    console.log('Database locked, routing to login');
    await router.replace({ name: 'LoginView' });
    console.log('Routed to LoginView');
  } else {
    // Database is unlocked - go to passwords
    console.log('Database unlocked, routing to passwords');
    await router.replace({ name: 'PasswordsView' });
    console.log('Routed to PasswordsView');
  }
  console.log('checkApplicationConfig completed');
}

onMounted(async () => {
  console.log('App.vue onMounted called');
  const api = (window as any).api;
  console.log('App mounted, window.api:', api);
  console.log('Store isDatabaseInitialized:', app.isDatabaseInitialized);

  try {
    // Route based on application state
    // Note: app.isDatabaseInitialized is false on app restart until user logs in
    await checkApplicationConfig();
  } catch (error) {
    console.error('Error during initialization:', error);
  } finally {
    // Hide loading screen
    isCheckingAuth.value = false;
    console.log('isCheckingAuth set to false');
  }

  // Signal to main process that the window is ready to show
  try {
    if (api?.appInfo?.readyToShowWindow) {
      console.log('Calling readyToShowWindow');
      await api.appInfo.readyToShowWindow();
      console.log('readyToShowWindow called successfully');
    } else {
      console.error('window.api.appInfo.readyToShowWindow is not available!');
      console.error('window.api:', api);
      console.error('Available keys:', Object.keys(api || {}));
    }
  } catch (error) {
    console.error('Failed to call readyToShowWindow:', error);
  }
});
</script>
