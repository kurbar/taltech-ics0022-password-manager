import {defineStore} from "pinia";
import {ref, computed} from "vue";

export const useApplicationStore = defineStore('application', () => {
  // Tracks whether the database connection is active (unlocked)
  const isDatabaseInitialized = ref(false);

  const isConfigured = computed(() => {
    return isDatabaseInitialized.value;
  });

  function setDatabaseInitialized(value: boolean) {
    console.log('Setting isDatabaseInitialized to:', value);
    isDatabaseInitialized.value = value;
  }

  return {
    isConfigured,
    isDatabaseInitialized,
    setDatabaseInitialized,
  };
})
