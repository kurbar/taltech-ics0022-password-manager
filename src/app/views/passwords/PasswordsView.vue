<template>
  <div class="h-full bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Password Manager</h1>
            <p class="text-sm text-gray-500 mt-1">Manage your passwords securely</p>
          </div>
          <button
            @click="openAddModal"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <span class="text-xl">+</span>
            <span>Add Password</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search passwords..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <!-- Password List -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading passwords...</p>
      </div>

      <div v-else-if="filteredPasswords.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🔒</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No passwords yet</h3>
        <p class="text-gray-500 mb-4">Start by adding your first password</p>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add Password
        </button>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="password in filteredPasswords"
          :key="password.id"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
        >
          <!-- Website/Title -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 truncate">
                {{ password.website || 'No Website' }}
              </h3>
              <p class="text-sm text-gray-500 truncate">{{ password.username }}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                @click="openEditModal(password)"
                class="text-gray-400 hover:text-blue-600 transition"
                title="Edit"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(password)"
                class="text-gray-400 hover:text-red-600 transition"
                title="Delete"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Password Display -->
          <div class="mb-4">
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-200 font-mono text-sm">
                {{ visiblePasswords[password.id!] ? password.password : '••••••••••••' }}
              </div>
              <button
                @click="togglePasswordVisibility(password.id!)"
                class="p-2 text-gray-400 hover:text-gray-600 transition"
                title="Toggle visibility"
              >
                <svg v-if="!visiblePasswords[password.id!]" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
              <button
                @click="copyPassword(password.password)"
                class="p-2 text-gray-400 hover:text-green-600 transition"
                title="Copy password"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Metadata -->
          <div class="text-xs text-gray-400">
            Created {{ formatDate(password.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <PasswordModal
      v-if="showModal"
      :password="selectedPassword"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :password="passwordToDelete"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <!-- Toast Notification -->
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PasswordDto } from '@/shared/password.constants';
import PasswordModal from '../../components/PasswordModal.vue';
import DeleteConfirmModal from './DeleteConfirmModal.vue';
import Toast from '../../components/Toast.vue';

const passwords = ref<PasswordDto[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const showModal = ref(false);
const showDeleteModal = ref(false);
const selectedPassword = ref<PasswordDto | null>(null);
const passwordToDelete = ref<PasswordDto | null>(null);
const visiblePasswords = ref<Record<string, boolean>>({});
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });

const filteredPasswords = computed(() => {
  if (!searchQuery.value) return passwords.value;

  const query = searchQuery.value.toLowerCase();
  return passwords.value.filter(p =>
    p.website?.toLowerCase().includes(query) ||
    p.username.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  await loadPasswords();
});

async function loadPasswords() {
  try {
    loading.value = true;
    const api = (window as any).api;
    passwords.value = await api.password.getAll();
  } catch (error) {
    console.error('Failed to load passwords:', error);
    showToast('Failed to load passwords', 'error');
  } finally {
    loading.value = false;
  }
}

function openAddModal() {
  selectedPassword.value = null;
  showModal.value = true;
}

function openEditModal(password: PasswordDto) {
  selectedPassword.value = { ...password };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedPassword.value = null;
}

async function handleSave(password: PasswordDto) {
  try {
    const api = (window as any).api;

    if (password.id) {
      // Update existing
      await api.password.update(password.id, {
        username: password.username,
        password: password.password,
        website: password.website,
      });
      showToast('Password updated successfully', 'success');
    } else {
      // Create new
      await api.password.create({
        username: password.username,
        password: password.password,
        website: password.website,
      });
      showToast('Password added successfully', 'success');
    }

    await loadPasswords();
    closeModal();
  } catch (error) {
    console.error('Failed to save password:', error);
    showToast('Failed to save password', 'error');
  }
}

function confirmDelete(password: PasswordDto) {
  passwordToDelete.value = password;
  showDeleteModal.value = true;
}

async function handleDelete() {
  if (!passwordToDelete.value?.id) return;

  try {
    const api = (window as any).api;
    await api.password.delete(passwordToDelete.value.id);
    showToast('Password deleted successfully', 'success');
    await loadPasswords();
  } catch (error) {
    console.error('Failed to delete password:', error);
    showToast('Failed to delete password', 'error');
  } finally {
    showDeleteModal.value = false;
    passwordToDelete.value = null;
  }
}

function togglePasswordVisibility(id: string) {
  visiblePasswords.value[id] = !visiblePasswords.value[id];
}

async function copyPassword(password: string) {
  try {
    await navigator.clipboard.writeText(password);
    showToast('Password copied to clipboard', 'success');
  } catch (error) {
    console.error('Failed to copy password:', error);
    showToast('Failed to copy password', 'error');
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function showToast(message: string, type: 'success' | 'error') {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}
</script>

