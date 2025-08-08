<template>
    <div class="min-h-screen w-full bg-gradient-to-b from-white to-secondary px-6 py-12">
      <BackButton/>
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full" />
      <div class="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/10 rounded-tr-full" />
      <div class="relative max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            Our <span class="text-primary">Community Members</span>
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Meet the amazing individuals who are making a difference in our
            environmental initiatives.
          </p>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">Loading members...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16 max-w-md mx-auto">
          <div class="text-5xl text-red-500/50 mb-4">
            <i class="bx bx-error-circle"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-700 mb-2">Failed to load members</h3>
          <p class="text-gray-500 mb-6">{{ error }}</p>
          <button 
            @click="allUserProfile" 
            class="px-6 py-3 bg-primary text-white rounded-xl hover:bg-hover transition-colors"
          >
            Try Again
          </button>
        </div>
        
        <!-- Content (when data is loaded) -->
        <template v-else>
          <!-- Search and Filter -->
          <div class="mb-8 max-w-md mx-auto">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search members..."
                class="w-full px-4 py-3 pl-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
              <i class="bx bx-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
            </div>
          </div>
          
          <!-- Users Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <!-- Decorative background -->
              <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <!-- Card content -->
              <div class="relative">
                <!-- User avatar and info -->
                <div class="flex items-center space-x-4 mb-4">
                  <div class="relative group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                    <img
                      :src="user.avatar || 'https://avatar.iran.liara.run/public'"
                      :alt="user.name"
                      class="w-14 h-14 rounded-full object-cover border-2 border-white relative z-10"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                      {{ user.name }}
                    </h3>
                    <p class="text-[10px] text-gray-500">
                      <span class="font-medium">ID:</span> {{ user.id }}
                    </p>
                  </div>
                </div>
                
                <!-- Joined date -->
                <div class="flex items-center text-sm text-gray-600 mt-2">
                  <i class="bx bx-calendar text-primary mr-2 text-lg"></i>
                  Joined {{ formatDate(user.createdAt) }}
                </div>
                
                <!-- Start Chat Button -->
                <button 
                  @click="handleStartChat(user.id)"
                  class="mt-4 w-full py-2 px-3 text-sm bg-secondary text-primary font-medium rounded-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading && activeUserId === user.id">
                    <i class="bx bx-loader-alt animate-spin mr-1"></i> Starting...
                  </span>
                  <span v-else>Start Chat</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- No Results Message -->
          <div v-if="usersExcludingCurrent.length > 0 && filteredUsers.length === 0" class="text-center py-12">
            <div class="text-5xl text-primary/30 mb-4">
              <i class="bx bx-search-alt"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-2">No members found</h3>
            <p class="text-gray-500">Try adjusting your search criteria</p>
          </div>
          
          <!-- Empty State (excluding current user) -->
          <div v-if="usersExcludingCurrent.length === 0 && !isLoading && !error" class="text-center py-16">
            <div class="text-5xl text-primary/30 mb-4">
              <i class="bx bx-user-x"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-2">No other members yet</h3>
            <p class="text-gray-500 mb-6">Invite others to join our community!</p>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { profileData, chatData } from '../helpers/composeApi';
  import { formatDate } from '../helpers/format';
  import { useRouter } from 'vue-router';
  import BackButton from '../molecules/BackButton.vue';

  const { users, isLoading, error, allUserProfile } = profileData();
  const { startChats } = chatData()
  
  const router = useRouter();
  const activeUserId = ref(null);
  const currentUserId = localStorage.getItem('userId');
  const searchQuery = ref('');

  onMounted(() => {
    allUserProfile()
  });
  
  const usersExcludingCurrent = computed(() => {
    if (!users.value || !Array.isArray(users.value)) return [];
    return users.value.filter(user => user.id !== currentUserId);
  });
  
  // Filtered users based on search query (excluding current user)
  const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    if (!query) return usersExcludingCurrent.value;
    
    return usersExcludingCurrent.value.filter(user => 
      user.name?.toLowerCase().includes(query) || 
      user.id.toLowerCase().includes(query)
    );
  });
  
  // Start chat function
    const handleStartChat = async (userId: string) => {
        const newChat = await startChats(userId);
        if (newChat) {
            router.push('/chat');
        }
    };

  </script>