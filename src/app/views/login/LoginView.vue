<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
    <div class="p-8 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🔒</div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Enter your master password to unlock your vault</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Master Password -->
        <div>
          <label for="masterPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Master Password
          </label>
          <input
            id="masterPassword"
            v-model="masterPassword"
            type="password"
            required
            autofocus
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Enter your master password"
            @input="errorMessage = ''"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isSubmitting || !masterPassword"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          {{ isSubmitting ? 'Unlocking...' : 'Unlock Vault' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/app/stores/application.store';

const router = useRouter();
const appStore = useApplicationStore();

const masterPassword = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

async function handleSubmit() {
  if (!masterPassword.value) {
    errorMessage.value = 'Please enter your master password';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    console.log('Attempting to unlock database...');

    const api = (window as any).api;
    const result = await api.database.verifyPassword(masterPassword.value);

    if (!result.success) {
      errorMessage.value = result.error || 'Incorrect password';
      masterPassword.value = '';
      return;
    }

    console.log('Database unlocked successfully');

    // Update store
    appStore.setDatabaseInitialized(true);

    // Navigate to passwords view
    router.push({ name: 'PasswordsView' });
  } catch (error) {
    console.error('Failed to unlock database:', error);
    errorMessage.value = 'Failed to unlock database. Please try again.';
    masterPassword.value = '';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

