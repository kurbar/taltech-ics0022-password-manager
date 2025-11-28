<template>
  <div class="fixed top-4 right-4 z-50 animate-slide-in">
    <div
      :class="[
        'px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]',
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      ]"
    >
      <!-- Icon -->
      <div class="flex-shrink-0">
        <svg v-if="type === 'success'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Message -->
      <p class="flex-1 text-white font-medium">{{ message }}</p>

      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="flex-shrink-0 text-white hover:text-gray-200 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
  type: 'success' | 'error';
}>();

defineEmits<{
  close: [];
}>();
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>

