<template>
    <div class="p-4 space-y-4">
      <!-- Messages -->
      <MessageBubble 
        v-for="message in messages" 
        :key="message.id" 
        :message="message"
        v-animateonscroll="{ 
          enterClass: `animate-enter slide-in-from-d-v2-8 animate-duration-500`,
        }" 
      />

    <!-- Typing indicator -->
    <div v-if="typingUsers && Object.keys(typingUsers).length > 0" class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
      <div class="bg-white text-gray-500 text-sm py-2 px-4 rounded-xl shadow-sm max-w-[75%]">
        <span class="inline-flex">
          <span class="animate-bounce mx-0.5">•</span>
          <span class="animate-bounce animation-delay-200 mx-0.5">•</span>
          <span class="animate-bounce animation-delay-400 mx-0.5">•</span>
        </span>
      </div>
    </div>
      
      <div ref="messagesEndRef"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import MessageBubble from '../molecules/MessageBubble.vue'
  import type { MappedMessage, TypingUsers } from '../utils/interface'
  
  // Define props
  const props = defineProps({
    messages: {
      type: Array as () => MappedMessage[],
      required: true
    },
    typingUsers: {
      type: Object as () => TypingUsers,
      default: () => ({})
    }
  })
  
  const messagesEndRef = ref<HTMLDivElement | null>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.value?.scrollIntoView({
      behavior: 'smooth'
    })
  }
  
  watch(() => props.messages, () => {
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  }, { deep: true })

watch(() => Object.keys(props.typingUsers).length, () => {
  setTimeout(() => {
    scrollToBottom()
  }, 100)
})
  
  onMounted(() => {
    scrollToBottom()
  })
  </script>

