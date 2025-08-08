<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Loading chats</p>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-center p-6 bg-red-50 rounded-xl max-w-md">
        <i class="bx bx-error-circle text-4xl text-red-500 mb-2"></i>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="allUserChats" class="bg-primary text-white px-4 py-2 rounded-lg">
          Try refresh the page
        </button>
      </div>
    </div>

    <!-- Unauthorized state (rare) -->
    <div v-else-if="error === 'Unauthorized. Please log in again.'" class="flex-1 flex items-center justify-center">
      <div class="text-center p-6 bg-red-50 rounded-xl max-w-md">
        <i class="bx bx-error-circle text-4xl text-red-500 mb-2"></i>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="$router.push('/login')" class="bg-primary text-white px-4 py-2 rounded-lg">
          Log in again
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Mobile and Desktop Layout -->
      <div class="flex w-full h-full relative">
        <!-- Sidebar - Always visible on desktop, conditionally on mobile -->
        <div 
          :class="[
            'bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out',
            isMobile ? 'absolute z-20 h-full w-full transform' : 'w-80',
            isMobile && mobileView !== 'sidebar' ? 'translate-x-[-100%]' : 'translate-x-0'
          ]"
        >
          <Sidebar
            :currentChatId="currentChat?.id"
            :chats="conversations"
            @setCurrent="setCurrentChat"
            @startNewChat="handleStartChat"
            @createGroup="handleCreateGroup"
          />
        </div>
        
        <!-- Chat Area - Always visible on desktop, conditionally on mobile -->
        <div 
          :class="[
            'flex-1 flex flex-col transition-all duration-300 ease-in-out',
            isMobile ? 'absolute z-10 h-full w-full transform' : '',
            isMobile && mobileView !== 'chat' ? 'translate-x-[100%]' : 'translate-x-0'
          ]"
        >
          <!-- Chat Header -->
          <div class="h-16 bg-white/80 backdrop-blur-md border-b border-teal-100 flex items-center px-6">
            <!-- Back button (mobile only) -->
            <button
              v-if="isMobile && currentChat" 
              @click="mobileView = 'sidebar'"
              class="mr-3 p-2 rounded-full hover:bg-teal-50 text-teal-600"
            >
              <i class="bx bx-chevron-left text-xl"></i>
            </button>
            
            <div v-if="currentChat"
              class="flex items-center cursor-pointer"
              @click="showChatDetail"
            >
              <div class="relative">
                <img
                  :src="currentChat?.isGroup ? currentChat.image ? currentChat.image : 'https://avatar.iran.liara.run/public' : otherUserInfo(currentChat).avatar"
                  :alt="currentChat?.name"
                  class="w-10 h-10 rounded-2xl object-cover ring-2 ring-teal-300"
                />
              </div>
              <div class="ml-3">
                <h3 class="font-semibold text-gray-800">
                  {{ currentChat?.isGroup ? currentChat.name : otherUserInfo(currentChat).name }}
                </h3>
                <p class="text-xs text-teal-600">
                  {{ currentChat?.isGroup ? 'Click here for group info' : 'Click here for user info' }}
                </p>
              </div>
            </div>
            <div v-else></div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto bg-gradient-to-br from-teal-50/50 via-emerald-50/50 to-cyan-50/50">
            <!-- Loading messages state -->
            <div v-if="isLoading" class="h-full flex items-center justify-center">
              <div class="text-center">
                <div class="w-8 h-8 border-2 border-teal-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p class="text-sm text-gray-500">Loading messages...</p>
              </div>
            </div>

            <!-- Error state for messages -->
            <div v-else-if="error" class="h-full flex items-center justify-center">
              <div class="text-center p-4">
                <p class="text-red-500">{{ messages }}</p>
                <button @click="loadMessages" class="mt-2 text-sm text-teal-500 hover:underline">
                  Try again
                </button>
              </div>
            </div>

            <div v-else-if="!currentChat" class="h-full flex items-center justify-center">
              <div class="text-center p-6">
                <p class="text-gray-500">Select a chat!</p>
              </div>
            </div>

            <!-- Empty messages state -->
            <div v-else-if="!messages || messages.length === 0" class="h-full flex items-center justify-center">
              <div class="text-center p-6">
                <p class="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            </div>

            <!-- Messages content -->
            <ChatWindow 
              v-else
              :messages="mappedMessages"
              :typingUsers="typingUsers"
            />
          </div>
          
          <!-- Input Area -->
          <div v-if="currentChat" class="bg-white/80 backdrop-blur-md p-4">
            <MessageInput 
              @sendMessage="handleSendMessage"
              @sendFile="handleSendFile"
              @typing="handleTyping"
              :disabled="isUploadingFile" 
            />
          </div>
        </div>
      </div>
      
      <!-- User Detail Sidebar -->
      <Detail
        v-if="showDetail && currentChat"
        :user="currentChat"
        @close="handleDetailClose"
        @roleUpdated="handleRoleUpdated"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import ChatWindow from '../components/ChatWindow.vue'
import MessageInput from '../molecules/MessageInput.vue'
import Detail from '../components/Detail.vue'
import { chatData } from '../helpers/composeApi.ts'
import { otherUserInfo } from '../helpers/service.ts'
import type { Conversation, ConversationForm } from '../utils/interface.ts'
import { useNotification } from '../helpers/notification.ts'

const { 
  isLoading, 
  error, 
  messages,
  mappedMessages, 
  conversations, 
  currentChat,
  typingUsers,
  allUserChats, 
  startChats, 
  createGroup,
  loadMessages,
  sendMessage,
  uploadFileAndSend,
  setTypingStatus 
} = chatData()

const isMobile = ref(window.innerWidth < 768)
const mobileView = ref('sidebar') 
const showDetail = ref(false)
const isUploadingFile = ref(false)

const getFileTypeFromMime = (mimeType: string): 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' => {
  if (mimeType.startsWith('image/')) return 'IMAGE'
  if (mimeType.startsWith('video/')) return 'VIDEO'
  if (mimeType.startsWith('audio/')) return 'AUDIO'
  return 'FILE'
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  
  if (!isMobile.value) {
    mobileView.value = 'sidebar'
  }
}

onMounted(() => {
  allUserChats()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const handleRoleUpdated = async (conversationId: string) => {
  await allUserChats();

  if (currentChat.value?.id === conversationId) {
    currentChat.value = conversations.value.length > 0 ? conversations.value[0] : null;
    
    if (currentChat.value) {
      await loadMessages();
    } else {
      messages.value = [];
      mappedMessages.value = [];
    }
  }
};

const showChatDetail = () => {
  showDetail.value = true
  if (isMobile.value) {
    mobileView.value = 'detail'
  }
}

const handleDetailClose = () => {
  showDetail.value = false
  if (isMobile.value) {
    mobileView.value = 'chat'
  }
}

const setCurrentChat = async (chat: Conversation) => {
  showDetail.value = false
  currentChat.value = chat
  
  if (isMobile.value) {
    mobileView.value = 'chat'
  }
  
  messages.value = []
  
  await loadMessages()
}

watch(() => currentChat.value?.id, (newId, oldId) => {
  if (newId !== oldId) {
    loadMessages()
  }
})

const handleStartChat = async (userId: string) => {
  try {
    await startChats(userId)
  } catch (err) {
    useNotification().error(err instanceof Error ? err.message : String(err));
  }
}

const handleSendFile = async (file: File) => {
  if (isUploadingFile.value) return 
  
  try {
    isUploadingFile.value = true
    showDetail.value = false
    
    const uploadResult = await uploadFileAndSend(file)
    
    if (uploadResult) {
      const fileType = getFileTypeFromMime(file.type)
      
      await sendMessage(uploadResult.fileUrl, fileType)
      
      useNotification().success(`${fileType.toLowerCase()} sent successfully!`)
    }
  } catch (err) {
    useNotification().error('Failed to send file')
    console.error('Send file error:', err)
  } finally {
    isUploadingFile.value = false
  }
};

const handleSendMessage = async (content: string) => {
  showDetail.value = false
  await sendMessage(content)
  setTypingStatus(false)
};

const handleTyping = (isTyping: boolean) => {
  setTypingStatus(isTyping)
};

const handleCreateGroup = async (groupData: ConversationForm) => {
  try {
    const newGroup = await createGroup(groupData)
    if (newGroup) {
      useNotification().success('Group successfully created!')
      await loadMessages()
    }
  } catch (err) {
    useNotification().error(err instanceof Error ? err.message : String(err));
  }
};
</script>
