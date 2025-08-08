<template>
  <div :class="`flex ${isMe ? 'justify-end' : 'justify-start'} items-end space-x-2`">
    <div v-if="!isMe" class="flex-shrink-0">
      <div v-if="message.avatar" class="w-8 h-8 rounded-full overflow-hidden">
        <img :src="message.avatar" :alt="message.author" class="w-full h-full object-cover" />
      </div>
      <div 
        v-else 
        class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
        :style="{ backgroundColor: avatarColor }"
      >
        {{ getInitial(message.author) }}
      </div>
    </div>
    
    <div
      :class="`relative max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm
        ${isMe ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-br-lg transform hover:scale-[1.02] transition-transform' : 'bg-white text-gray-800 rounded-bl-none transform hover:scale-[1.02] transition-transform'}`"
    >
      <div 
        v-if="!isMe" 
        class="absolute -left-2 bottom-0 w-4 h-4 overflow-hidden"
      >
        <div class="absolute bg-white transform rotate-45 w-3 h-3 -right-1.5 bottom-0"></div>
      </div>
      
      <span 
        v-if="!isMe && message.author" 
        class="text-xs font-medium block mb-1"
        :style="{ color: avatarColor }"
      >
        {{ message.author }}
      </span>
      
      <p class="text-sm">{{ message.text }}</p>
      
      <div
        :class="`flex items-center text-xs mt-1 ${isMe ? 'text-teal-100 justify-end' : 'text-gray-500'}`"
      >
        <span>{{ message.time }}</span>
        <i v-if="isMe" class="bx bx-check-double ml-1" style="font-size: 14px;"></i>
      </div>
    </div>
    
    <div v-if="isMe" class="w-8"></div>
  </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue'
  
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})
  
const isMe = computed(() => props.message.sender === 'me')

const avatarColors = [
  '#FF6B6B', 
  '#48CFAD', 
  '#FFCE54', 
  '#5D9CEC', 
  '#AC92EC', 
  '#EC87C0', 
  '#FC6E51', 
  '#A0D468', 
  '#4FC1E9', 
  '#FFA726' 
]

const getInitial = (name: string) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

const avatarColor = computed(() => {
  const name = props.message.author || '';
  if (!name) return avatarColors[0];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
});
</script>
