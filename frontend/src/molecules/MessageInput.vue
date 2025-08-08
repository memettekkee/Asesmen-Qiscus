<template>
    <div class="flex items-center">
      <div class="flex-1 relative mx-2">
        <input
          ref="inputField"
          type="text"
          v-model="message"
          @input="handleInput"
          @keydown.enter.prevent="sendMessage"
          placeholder="Send a message..."
          class="w-full py-3 px-4 bg-teal-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all placeholder-teal-400"
        />
      </div>
      <button
      @click="sendMessage"
        :disabled="!message.trim()"
        :class="`p-3 rounded-xl transition-all transform hover:scale-105 active:scale-95
          ${message.trim() ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md hover:shadow-lg' : 'bg-teal-50/50 text-teal-300'}`"
      >
        <i class="bx bx-send text-xl"></i>
      </button>
    </div>
</template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'

  type TimeoutID = ReturnType<typeof setTimeout> | null;
  
  const emit = defineEmits(['sendMessage', 'typing'])
  const message = ref('')
  const inputField = ref<HTMLTextAreaElement | null>(null)
  const typingTimeout = ref<TimeoutID>(null)

const sendMessage = () => {
  if (message.value.trim()) {
    emit('sendMessage', message.value)
    message.value = ''
    
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value)
      typingTimeout.value = null
    }
    emit('typing', false)
  }
}
  
const handleInput = () => {
  emit('typing', true)
  
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
  
  typingTimeout.value = setTimeout(() => {
    emit('typing', false)
  }, 3000)
}

onMounted(() => {
  inputField.value?.focus()
})

onBeforeUnmount(() => {
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
})
  </script>
