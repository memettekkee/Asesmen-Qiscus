<template>
  <div class="flex items-center">
    <input 
      ref="fileInput"
      type="file" 
      @change="handleFileSelect"
      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      class="hidden"
    />
    
    <button
      @click="triggerFileInput"
      class="p-3 mr-2 rounded-xl bg-teal-50/50 text-teal-500 hover:bg-teal-100 transition-all"
    >
      <i class="bx bx-paperclip text-xl"></i>
    </button>

    <div v-if="selectedFile" class="flex-1 mx-2">
      <div class="bg-teal-50 p-2 rounded-lg border border-teal-200">
        <div class="flex items-center justify-between">
          <span class="text-sm text-teal-700">📎 {{ selectedFile.name }}</span>
          <button @click="clearFile" class="text-red-500 hover:text-red-700">
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Text Input -->
    <div v-else class="flex-1 relative mx-2">
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

    <!-- Send Button -->
    <button
      @click="sendMessage"
      :disabled="!canSend"
      :class="`p-3 rounded-xl transition-all transform hover:scale-105 active:scale-95
        ${canSend ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md hover:shadow-lg' : 'bg-teal-50/50 text-teal-300'}`"
    >
      <i class="bx bx-send text-xl"></i>
    </button>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, computed,onMounted, onBeforeUnmount } from 'vue'

  type TimeoutID = ReturnType<typeof setTimeout> | null;
  
  const emit = defineEmits(['sendMessage', 'sendFile', 'typing'])
  const message = ref('')
  const selectedFile = ref<File | null>(null)
  const inputField = ref<HTMLTextAreaElement | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)
  const typingTimeout = ref<TimeoutID>(null)

  const canSend = computed(() => {
    return message.value.trim() || selectedFile.value !== null
  })

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    message.value = '' 
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const clearFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const sendMessage = async () => {
  if (selectedFile.value) {
    emit('sendFile', selectedFile.value)
    clearFile()
  } else if (message.value.trim()) {
    emit('sendMessage', message.value)
    message.value = ''
  }
  
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
    typingTimeout.value = null
  }
  emit('typing', false)
}
  
const handleInput = () => {
  if (selectedFile.value) return 
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
