<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-secondary px-6">
      <BackButton/>
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full" />
      <div class="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/10 rounded-tr-full" />
      <div class="relative w-full max-w-2xl">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 md:p-10">
          <!-- Loading State -->
          <div v-if="isLoading && !isEditMode" class="flex flex-col items-center justify-center py-8">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p class="mt-4 text-gray-600">Loading your profile...</p>
          </div>
  
          <!-- Error State -->
          <div v-else-if="error" class="flex flex-col items-center justify-center py-8">
            <div class="text-red-500 text-center mb-4">
              <i class="bx bx-error-circle text-5xl"></i>
              <p class="mt-2">{{ error }}</p>
            </div>
            <button 
              @click="loadUserProfile" 
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-hover transition-colors"
            >
              Try Again
            </button>
          </div>
  
          <!-- View Mode -->
          <div v-else-if="!isEditMode && user" class="flex flex-col items-center">
            <!-- Profile Image -->
            <div class="relative group">
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-hover animate-pulse blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative">
                <img
                  :src="user.avatar || 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400&h=400&fit=crop'"
                  alt="Profile"
                  class="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
            </div>
            <!-- User Info -->
            <div class="mt-6 text-center">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ user.name }}
              </h1>
              <div class="flex items-center justify-center mt-2 text-gray-600">
                <i class="bx bx-envelope mr-2 text-base"></i>
                <span>{{ user.email }}</span>
              </div>
            </div>
            <!-- Additional Info -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                <!-- ntar jangan lupa ini  -->
              <!-- <div class="bg-secondary rounded-2xl p-4 flex items-center">
                <i class="bx bx-map text-primary mr-3 text-xl"></i>
                <div>
                  <p class="text-sm text-gray-500">Location</p>
                  <p class="font-medium text-gray-900">{{ user.location || 'Not specified' }}</p>
                </div>
              </div> -->
              <div class="bg-secondary rounded-2xl p-4 flex items-center">
                <i class="bx bx-calendar text-primary mr-3 text-xl"></i>
                <div>
                  <p class="text-sm text-gray-500">Joined</p>
                  <p class="font-medium text-gray-900">{{ formatDate(user.createdAt) }}</p>
                </div>
              </div>
            </div>
            <!-- Action Buttons -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
              <button @click="enableEditMode" class="flex-1 bg-primary text-white px-6 py-3 rounded-xl hover:bg-hover transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
  
          <!-- Edit Mode -->
          <div v-else-if="isEditMode && user" class="flex flex-col">
            <h2 class="text-2xl font-bold text-center mb-6">Edit Profile</h2>
            
            <!-- Profile Image Preview and Input -->
            <div class="flex flex-col items-center mb-6">
              <img 
                :src="formData.avatar || 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400&h=400&fit=crop'" 
                alt="Profile Preview" 
                class="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mb-4"
              />
              <div class="w-full max-w-lg">
                <label for="avatar" class="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                <div class="relative">
                  <i class="bx bx-image absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                  <input
                    id="avatar"
                    v-model="formData.avatar"
                    type="text"
                    placeholder="Enter image URL"
                    class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
            
            <!-- Form Fields -->
            <div class="space-y-4 w-full max-w-lg mx-auto">
              <!-- Name Input -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div class="relative">
                  <i class="bx bx-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    placeholder="Your name"
                    class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <!-- Email Input -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div class="relative">
                  <i class="bx bx-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    placeholder="Your email"
                    class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <!-- Location Input -->
              <!-- <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div class="relative">
                  <i class="bx bx-map absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                  <input
                    id="location"
                    v-model="formData.location"
                    type="text"
                    placeholder="Your location"
                    class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div> -->
              
              <!-- Error message -->
              <div v-if="error" class="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
                {{ error }}
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  @click="handleSaveProfile"
                  class="flex-1 bg-primary text-white px-6 py-3 rounded-xl hover:bg-hover transition-colors flex items-center justify-center"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
                <button
                  @click="cancelEdit"
                  class="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Decorative Circles -->
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { profileData } from '../helpers/composeApi';
  import { formatDate } from '../helpers/format';
  import { useNotification } from '../helpers/notification'
  import BackButton from '../molecules/BackButton.vue';

  const { user, isLoading, error, clearError, loadUserProfile, saveProfile } = profileData();
  
  const isEditMode = ref(false);

  const formData = ref({
    name: '',
    email: '',
    // location: '',
    avatar: ''
  });
  
  onMounted(() => {
    loadUserProfile();
  });
  
  const initFormData = () => {
    if (!user.value) return;
    
    formData.value = {
      name: user.value.name || '',
      email: user.value.email || '',
    //   location: user.value.location || '',
      avatar: user.value.avatar || ''
    };
  };
  
  const enableEditMode = () => {
    initFormData(); 
    isEditMode.value = true;
    clearError()
  };
  
  const cancelEdit = () => {
    isEditMode.value = false;
    clearError()
  };

  const handleSaveProfile = async () => {
    const confirmed = await useNotification().confirm(
    'Confirm Update',
    'Are you sure you want to update yout profile ?',
    'Yes',
    'No'
  )
  if (confirmed) {
    const updatedUser = await saveProfile(formData.value);
    if (updatedUser) {
      isEditMode.value = false;
      loadUserProfile()
      useNotification().success('Your profile has been updated !')
    }
  } else {
    useNotification().error('Failed to update profile')
  }
};
  </script>