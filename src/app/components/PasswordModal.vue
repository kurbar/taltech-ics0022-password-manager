<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">
            {{ isEditing ? 'Edit Password' : 'Add Password' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Website -->
        <div>
          <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
            Website / Service
          </label>
          <input
            id="website"
            v-model="form.website"
            type="text"
            placeholder="e.g., github.com, Netflix"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username / Email <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="username or email@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Enter password"
              class="w-full px-4 py-2 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="p-1 text-gray-400 hover:text-gray-600"
                title="Toggle visibility"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
              <button
                type="button"
                @click="openGenerator"
                class="p-1 text-gray-400 hover:text-blue-600"
                title="Generate password"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Password Generator -->
        <div v-if="showGenerator" class="bg-gray-50 rounded-lg p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Password Generator</span>
            <button
              type="button"
              @click="showGenerator = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Length Slider -->
          <div>
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Length</span>
              <span class="font-medium">{{ generatorOptions.length }}</span>
            </div>
            <input
              v-model.number="generatorOptions.length"
              type="range"
              min="8"
              max="32"
              class="w-full"
            />
          </div>

          <!-- Options -->
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="generatorOptions.includeUppercase"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Uppercase (A-Z)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="generatorOptions.includeLowercase"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Lowercase (a-z)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="generatorOptions.includeNumbers"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Numbers (0-9)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="generatorOptions.includeSymbols"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Symbols (!@#$%...)</span>
            </label>
          </div>

          <button
            type="button"
            @click="generatePassword"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Generate Password
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-sm text-red-800">{{ errorMessage }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PasswordDto, PasswordGeneratorOptions } from '@/shared/password.constants';

const props = defineProps<{
  password: PasswordDto | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [password: PasswordDto];
}>();

const form = ref<PasswordDto>({
  id: props.password?.id,
  website: props.password?.website || null,
  username: props.password?.username || '',
  password: props.password?.password || '',
});

const showPassword = ref(false);
const showGenerator = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

const generatorOptions = ref<PasswordGeneratorOptions>({
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
});

const isEditing = computed(() => !!props.password?.id);

function openGenerator() {
  showGenerator.value = !showGenerator.value;
}

async function generatePassword() {
  try {
    const api = (window as any).api;
    // Convert to plain object to avoid Vue reactivity wrapper issues with IPC
    const options = {
      length: generatorOptions.value.length,
      includeUppercase: generatorOptions.value.includeUppercase,
      includeLowercase: generatorOptions.value.includeLowercase,
      includeNumbers: generatorOptions.value.includeNumbers,
      includeSymbols: generatorOptions.value.includeSymbols,
    };
    const generated = await api.password.generate(options);
    form.value.password = generated;
    showPassword.value = true;
    errorMessage.value = '';
  } catch (error) {
    console.error('Failed to generate password:', error);
    errorMessage.value = 'Failed to generate password';
  }
}

function handleSubmit() {
  if (!form.value.username || !form.value.password) {
    errorMessage.value = 'Username and password are required';
    return;
  }

  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    emit('save', form.value);
  } finally {
    isSubmitting.value = false;
  }
}

watch(() => props.password, (newPassword) => {
  if (newPassword) {
    form.value = {
      id: newPassword.id,
      website: newPassword.website,
      username: newPassword.username,
      password: newPassword.password,
    };
  }
});
</script>

