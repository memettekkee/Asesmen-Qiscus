<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="h-16 flex items-center justify-between px-6">
      <div class="flex items-center">
        <button @click="$router.push('/')">
          <i class="bx bx-left-arrow-alt w-6 h-6 text-teal-600 text-xl"></i>
        </button>
        <div class="flex ml-3">
          <img class="h-10" src="/public/image/main-logo.png"/>
          <img class="h-5" src="/public/image/second-logo.png"/>
      </div>
      </div>
    </div>
    
    <!-- Contact List -->
    <div class="flex-1 overflow-y-auto py-4">
      <div
        v-for="chat in chats"
        :key="chat.id"
        :class="`group flex items-center px-4 py-3 mx-2 cursor-pointer transition-all rounded-2xl
          ${currentChatId === chat.id ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10' : 'hover:bg-gradient-to-r hover:from-teal-500/5 hover:to-emerald-500/5'}`"
        @click="$emit('setCurrent', chat)"
      >
        <div class="relative">
          <img
            :src="chat.isGroup ? chat.image ? chat.image : 'https://avatar.iran.liara.run/public' : otherUserInfo(chat).avatar"
            :alt="chat.name"
            class="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-100 group-hover:ring-teal-200 transition-all"
          />
          <div 
            v-if="chat.isGroup" 
            class="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-400 rounded-lg flex items-center justify-center ring-2 ring-white"
          >
            <i class="bx bxs-group text-[10px] font-medium text-white"/>
          </div>
          <!-- <div 
            v-if="!chat. (user online)" 
            class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-lg ring-2 ring-white"
          ></div> -->
        </div>
        <div class="ml-3 flex-1 min-w-0">
          <div class="flex justify-between items-baseline">
            <h3 class="font-medium text-gray-800 truncate">
              {{ chat.isGroup ? chat.name : otherUserInfo(chat).name }}
            </h3>
            <span class="text-xs text-gray-500 ml-2 flex-shrink-0">
              {{ formatMessageTime(chat.lastMessage?.updatedAt) || '' }}
            </span>
          </div>
          <p class="text-sm text-gray-500 truncate">
            {{ chat.lastMessage?.content || '' }}
          </p>
        </div>
      </div>
    </div>

    <!-- New Chat Form / Make Group Form & Button -->
    <AnimationWrapper
    type="fadeIn"
    threshold="1"
    v-if="showMenuOptions && !showAddContactForm && !showCreateGroupForm"
    class="fixed bottom-20 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ease-in-out"
    >
    <div class="flex flex-col w-48">
      <button 
        @click="showAddContactForm = true; showMenuOptions = false;"
        class="flex items-center py-3 px-4 hover:bg-gray-50 transition-colors"
      >
        <i class="bx bx-user-plus text-teal-500 text-xl mr-3"></i>
        <span class="font-medium text-gray-700">Add Friend</span>
      </button>
      <button 
        @click="showCreateGroupForm = true; showMenuOptions = false;"
        class="flex items-center py-3 px-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
      >
        <i class="bx bx-group text-teal-500 text-xl mr-3"></i>
        <span class="font-medium text-gray-700">Make a Group</span>
      </button>
    </div>
    </AnimationWrapper>

    <!-- Add Friend Form (existing) -->
    <AnimationWrapper
    type="fadeIn"
    threshold="1"  
    v-if="showAddContactForm" 
    class="fixed bottom-6 left-6 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 transform transition-all duration-300 ease-in-out"
    >
    <div class="flex justify-between items-center mb-3">
      <label for="contactId" class="font-medium text-gray-700">User ID</label>
      <button 
        @click="showAddContactForm = false" 
        class="p-1 rounded-lg hover:bg-teal-50 text-gray-500"
      >
        <i class="bx bx-x text-xl"></i>
      </button>
    </div>

    <div class="space-y-3">
      <input
        id="contactId"
        v-model="contactId"
        type="text"
        placeholder="Enter user ID"
        class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-colors"
      />
      
      <button 
        @click="addNewChat"
        class="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 px-4 rounded-xl hover:shadow-md transition-all"
      >
        Start Chat
      </button>
    </div>
    </AnimationWrapper>

    <!-- Create Group Form (new) -->
    <AnimationWrapper
    type="fadeIn"
    threshold="1"  
    v-if="showCreateGroupForm" 
    class="fixed bottom-6 left-6 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 transform transition-all duration-300 ease-in-out"
    >
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-medium text-gray-700">Create Group</h3>
      <button 
        @click="showCreateGroupForm = false" 
        class="p-1 rounded-lg hover:bg-teal-50 text-gray-500"
      >
        <i class="bx bx-x text-xl"></i>
      </button>
    </div>

    <div class="space-y-3">
      <div>
        <label for="groupName" class="text-sm text-gray-600 mb-1 block">Group Name</label>
        <input
          id="groupName"
          v-model="groupName"
          type="text"
          placeholder="Enter group name"
          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-colors"
        />
      </div>
      
      <div>
        <label for="groupImage" class="text-sm text-gray-600 mb-1 block">Image URL (optional)</label>
        <input
          id="groupImage"
          v-model="groupImage"
          type="text"
          placeholder="Enter image link"
          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-colors"
        />
      </div>
      
      <button 
        @click="createGroup"
        class="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 px-4 rounded-xl hover:shadow-md transition-all"
      >
        Create Group
      </button>
    </div>
    </AnimationWrapper>

    <!-- Main Action Button (toggles menu) -->
    <button 
    v-if="!showAddContactForm && !showCreateGroupForm"
    @click="showMenuOptions = !showMenuOptions" 
    class="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:rotate-12"
    >
    <i class="bx bx-plus text-2xl"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AnimationWrapper from '../molecules/AnimationWrapper.vue'
import { useNotification } from '../helpers/notification';
import { formatMessageTime } from '../helpers/format'
import { otherUserInfo } from '../helpers/service';
import type { Conversation } from '../utils/interface';

defineProps<{
  currentChatId: string | undefined;
  chats: Conversation[];
}>();

const emit = defineEmits(['setCurrent', 'startNewChat', 'createGroup'])

const showMenuOptions = ref(false)
const showAddContactForm = ref(false)
const showCreateGroupForm = ref(false)

const contactId = ref('')
const groupName = ref('')
const groupImage = ref('')

const addNewChat = async () => {
  if (contactId.value.trim()) {
    const confirmed = await useNotification().confirm(
      'Start a new chat',
      'Are you sure you want to start chat with this ID ?',
      'Yes',
      'No'
    )
    if (confirmed) {
        emit('startNewChat', contactId.value)
        
        contactId.value = ''
        showAddContactForm.value = false
    } else (
      useNotification().error('Failed to start the chat'),
      showAddContactForm.value = false
    )
  } else {
    useNotification().warning('Fill the ID !')
  }
}

const createGroup = async () => {
  if (groupName.value.trim()) {
    const confirmed = await useNotification().confirm(
      'Make a group',
      'Are you sure you want to make a group ?',
      'Yes',
      'No'
    )
    if (confirmed) {
      emit('createGroup', {
        name: groupName.value,
        image: groupImage.value
      })
      
      groupName.value = ''
      groupImage.value = ''
      showCreateGroupForm.value = false
    } else {
      useNotification().error('Failed to make a group !')
    }
  } else {
    useNotification().warning('Fill the group credential !')
  }
}

</script>