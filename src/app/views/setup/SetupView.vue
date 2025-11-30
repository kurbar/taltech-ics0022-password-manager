<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
    <div class="p-8 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-2 text-gray-800">Welcome to Password Manager</h1>
        <p class="text-gray-600">Create a master password to secure your vault</p>
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Enter your master password"
            @input="validatePassword"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Master Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Confirm your master password"
            @input="validatePasswordMatch"
          />
          <p v-if="confirmPassword && !passwordsMatch" class="mt-1 text-sm text-red-600">
            Passwords do not match
          </p>
        </div>

        <!-- Password Strength Indicator -->
        <div v-if="masterPassword" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Password Strength:</span>
            <span :class="strengthColor" class="font-medium">{{ strengthText }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              :class="strengthColor"
              class="h-2 rounded-full transition-all duration-300"
              :style="{ width: strengthPercentage + '%' }"
            ></div>
          </div>
        </div>

        <!-- Password Requirements -->
        <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <p class="font-medium text-gray-700">Password must contain:</p>
          <ul class="space-y-1">
            <li :class="hasMinLength ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
              <span class="mr-2">{{ hasMinLength ? '✓' : '○' }}</span>
              At least 12 characters
            </li>
            <li :class="hasUpperCase ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
              <span class="mr-2">{{ hasUpperCase ? '✓' : '○' }}</span>
              One uppercase letter
            </li>
            <li :class="hasLowerCase ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
              <span class="mr-2">{{ hasLowerCase ? '✓' : '○' }}</span>
              One lowercase letter
            </li>
            <li :class="hasNumber ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
              <span class="mr-2">{{ hasNumber ? '✓' : '○' }}</span>
              One number
            </li>
            <li :class="hasSpecial ? 'text-green-600' : 'text-gray-500'" class="flex items-center">
              <span class="mr-2">{{ hasSpecial ? '✓' : '○' }}</span>
              One special character
            </li>
          </ul>
        </div>

        <!-- Warning Message -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex">
            <span class="text-yellow-600 text-xl mr-2">⚠️</span>
            <div class="text-sm text-yellow-800">
              <p class="font-medium mb-1">Important:</p>
              <p>If you forget your master password, your data cannot be recovered. Please store it securely.</p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-sm text-red-800">{{ errorMessage }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          {{ isSubmitting ? 'Creating Secure Vault...' : 'Create Secure Vault' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/app/stores/application.store';

const router = useRouter();
const appStore = useApplicationStore();

// Form state
const masterPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

// Password validation
const hasMinLength = computed(() => masterPassword.value.length >= 12);
const hasUpperCase = computed(() => /[A-Z]/.test(masterPassword.value));
const hasLowerCase = computed(() => /[a-z]/.test(masterPassword.value));
const hasNumber = computed(() => /[0-9]/.test(masterPassword.value));
const hasSpecial = computed(() => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(masterPassword.value));

const passwordRequirementsMet = computed(() =>
  hasMinLength.value &&
  hasUpperCase.value &&
  hasLowerCase.value &&
  hasNumber.value &&
  hasSpecial.value
);

const passwordsMatch = computed(() =>
  confirmPassword.value === masterPassword.value
);

const isFormValid = computed(() =>
  passwordRequirementsMet.value &&
  passwordsMatch.value &&
  masterPassword.value.length > 0
);

// Password strength calculation
const passwordStrength = computed(() => {
  let strength = 0;
  if (hasMinLength.value) strength += 20;
  if (hasUpperCase.value) strength += 20;
  if (hasLowerCase.value) strength += 20;
  if (hasNumber.value) strength += 20;
  if (hasSpecial.value) strength += 20;

  // Bonus for length
  if (masterPassword.value.length >= 16) strength += 10;
  if (masterPassword.value.length >= 20) strength += 10;

  return Math.min(strength, 100);
});

const strengthPercentage = computed(() => passwordStrength.value);

const strengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  if (strength < 100) return 'Strong';
  return 'Very Strong';
});

const strengthColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return 'text-red-600 bg-red-600';
  if (strength < 60) return 'text-orange-600 bg-orange-600';
  if (strength < 80) return 'text-yellow-600 bg-yellow-600';
  if (strength < 100) return 'text-green-600 bg-green-600';
  return 'text-emerald-600 bg-emerald-600';
});

function validatePassword() {
  errorMessage.value = '';
}

function validatePasswordMatch() {
  errorMessage.value = '';
}

async function handleSubmit() {
  if (!isFormValid.value) {
    errorMessage.value = 'Please meet all password requirements';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    console.log('Master password set, initializing encrypted database...');

    // Call backend API to initialize database with master password
    const result = await (window as any).api.database.initializeWithPassword(masterPassword.value);

    if (!result.success) {
      errorMessage.value = result.error || 'Failed to create secure vault';
      return;
    }

    console.log('Database initialized successfully with SQLCipher encryption');

    // Update store
    appStore.setDatabaseInitialized(true);

    // Navigate to passwords view
    router.push({ name: 'PasswordsView' });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    errorMessage.value = 'Failed to create secure vault. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

// Clear sensitive data on component unmount
onUnmounted(() => {
  masterPassword.value = '';
  confirmPassword.value = '';
  errorMessage.value = '';
});
</script>
