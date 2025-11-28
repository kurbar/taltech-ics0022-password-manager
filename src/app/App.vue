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
  const api = (window as any).api;

  // Check if master password has been set up (config file exists)
  const hasConfig = await api.database.isInitialized();

  // Check if database connection is actually active (from backend)
  const isDatabaseConnected = await api.database.isConnected();

  console.log('Config exists:', hasConfig);
  console.log('Database connected (backend):', isDatabaseConnected);

  // Update store to match backend state
  if (isDatabaseConnected) {
    app.setDatabaseInitialized(true);
  }

  if (!hasConfig) {
    // No master password set up yet - go to setup
    console.log('No master password configured, routing to setup');
    router.replace({ name: 'SetupView' });
  } else if (!isDatabaseConnected) {
    // Master password exists but database not unlocked - go to login
    console.log('Database locked, routing to login');
    router.replace({ name: 'LoginView' });
  } else {
    // Database is unlocked - go to passwords
    console.log('Database unlocked, routing to passwords');
    router.replace({ name: 'PasswordsView' });
  }
}

onMounted(async () => {
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
  }

  // Signal to main process that the window is ready to show
  if (api?.appInfo?.readyToShowWindow) {
    console.log('Calling readyToShowWindow');
    await api.appInfo.readyToShowWindow();
  } else {
    console.error('window.api.appInfo.readyToShowWindow is not available!');
    console.error('window.api:', api);
  }
});
</script>
