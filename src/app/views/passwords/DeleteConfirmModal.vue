<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">Delete Password</h2>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-gray-700 mb-2">
              Are you sure you want to delete this password?
            </p>
            <div class="bg-gray-50 rounded-lg p-3 space-y-1">
              <p class="text-sm font-medium text-gray-900">{{ password?.website || 'No Website' }}</p>
              <p class="text-sm text-gray-600">{{ password?.username }}</p>
            </div>
            <p class="text-sm text-red-600 mt-3">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PasswordDto } from '@/shared/password.constants';

defineProps<{
  password: PasswordDto | null;
}>();

defineEmits<{
  close: [];
  confirm: [];
}>();
</script>

