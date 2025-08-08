<template>
  <div :class="`flex ${isMe ? 'justify-end' : 'justify-start'} items-end space-x-2`">
    <div v-if="!isMe" class="flex-shrink-0">
      <div v-if="message.avatar && !avatarError" class="w-8 h-8 rounded-full overflow-hidden">
        <img 
          :src="message.avatar" 
          :alt="message.author" 
          class="w-full h-full object-cover"
          @error="avatarError = true"
        />
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
      :class="`relative max-w-[75%] rounded-2xl shadow-sm
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
        class="text-xs font-medium block mb-1 px-4 pt-2.5"
        :style="{ color: avatarColor }"
      >
        {{ message.author }}
      </span>
      
      <!-- Content based on message type -->
      <div class="px-4 py-2.5">
        <!-- Text Message -->
        <div v-if="messageType === 'TEXT'">
          <p class="text-sm">{{ message.text }}</p>
        </div>

        <!-- Image Message -->
        <div v-else-if="messageType === 'IMAGE'" class="space-y-2">
          <div v-if="!imageError" class="relative rounded-lg overflow-hidden bg-gray-100 max-w-xs" @click="openModal('image')">
            <img 
              :src="message.text" 
              :alt="getFileName(message.text)"
              class="w-full h-auto max-h-64 object-cover"
              @error="handleImageError"
              @load="imageLoaded = true"
            />
            <!-- Loading placeholder -->
            <div v-if="!imageLoaded" class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <i class="bx bx-image text-gray-400 text-2xl"></i>
            </div>
          </div>
          <!-- Error fallback -->
          <div v-else class="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 min-w-[200px]">
            <i class="bx bx-error text-red-500 text-xl"></i>
            <div>
              <p class="text-sm text-gray-700">Failed to load image</p>
              <p class="text-xs text-gray-500">{{ getFileName(message.text) }}</p>
            </div>
          </div>
        </div>

        <!-- Video Message -->
        <div v-else-if="messageType === 'VIDEO'" class="space-y-2">
          <div v-if="!videoError" class="relative rounded-lg overflow-hidden bg-gray-100 max-w-xs" @click="openModal('video')">
            <video 
              :src="message.text"
              class="w-full h-auto max-h-64 object-cover"
              controls
              preload="metadata"
              @error="handleVideoError"
            >
              Your browser does not support video playback.
            </video>
          </div>
          <!-- Error fallback -->
          <div v-else class="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 min-w-[200px]">
            <i class="bx bx-error text-red-500 text-xl"></i>
            <div>
              <p class="text-sm text-gray-700">Failed to load video</p>
              <p class="text-xs text-gray-500">{{ getFileName(message.text) }}</p>
            </div>
          </div>
        </div>

        <!-- Audio Message -->
        <div v-else-if="messageType === 'AUDIO'" class="space-y-2">
          <div v-if="!audioError" class="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 min-w-[200px]">
            <div class="flex-shrink-0">
              <i class="bx bx-music text-2xl text-teal-500"></i>
            </div>
            <div class="flex-1">
              <audio 
                :src="message.text"
                class="w-full"
                controls
                preload="metadata"
                @error="handleAudioError"
              >
                Your browser does not support audio playback.
              </audio>
            </div>
          </div>
          <!-- Error fallback -->
          <div v-else class="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 min-w-[200px]">
            <i class="bx bx-error text-red-500 text-xl"></i>
            <div>
              <p class="text-sm text-gray-700">Failed to load audio</p>
              <p class="text-xs text-gray-500">{{ getFileName(message.text) }}</p>
            </div>
          </div>
        </div>

        <!-- File/Document Message - Just show file info, no download -->
        <div v-else-if="messageType === 'FILE'" class="space-y-2">
          <div class="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 min-w-[250px]">
            <div class="flex-shrink-0">
              <i :class="getFileIcon(message.text)" class="text-2xl text-teal-500"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ getFileName(message.text) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ getFileExtension(message.text).toUpperCase() }} File
              </p>
            </div>
          </div>
        </div>

        <div v-else>
          <p class="text-sm">{{ message.text }}</p>
        </div>
      </div>
      
      <div
        :class="`flex items-center text-xs mt-1 px-4 pb-2.5 ${isMe ? 'text-teal-100 justify-end' : 'text-gray-500'}`"
      >
        <span>{{ message.time }}</span>
        <i v-if="isMe" class="bx bx-check-double ml-1" style="font-size: 14px;"></i>
      </div>
    </div>
    
    <div v-if="isMe" class="w-8"></div>
  </div>
  <Teleport to="body">
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <!-- Close button -->
      <button 
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        @click="closeModal"
      >
        <i class="bx bx-x text-3xl"></i>
      </button>

      <!-- Image Modal -->
      <div v-if="modalType === 'image'" class="max-w-full max-h-full flex items-center justify-center" @click.stop>
        <img 
          :src="message.text" 
          :alt="getFileName(message.text)"
          class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          @click.stop
        />
      </div>

      <!-- Video Modal -->
      <div v-else-if="modalType === 'video'" class="max-w-4xl max-h-full flex items-center justify-center" @click.stop>
        <video 
          :src="message.text"
          class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          controls
          autoplay
          @click.stop
        >
          Your browser does not support video playback.
        </video>
      </div>

      <!-- File info at bottom -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
        <p class="text-lg font-medium">{{ getFileName(message.text) }}</p>
        <p class="text-sm text-gray-300">{{ message.author }} • {{ message.time }}</p>
      </div>
    </div>
  </Teleport>
</template>
  
<script setup lang="ts">
import { ref, computed,onMounted, onBeforeUnmount } from 'vue'
  
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const imageError = ref(false)
const videoError = ref(false)
const audioError = ref(false)
const avatarError = ref(false)
const imageLoaded = ref(false)
  
const isMe = computed(() => props.message.sender === 'me')
const showModal = ref(false)
const modalType = ref<'image' | 'video' | null>(null)

const openModal = (type: 'image' | 'video') => {
  modalType.value = type
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  modalType.value = null
  document.body.style.overflow = 'auto'
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

const messageType = computed(() => {
  if (props.message.type) {
    return props.message.type
  }
  
  const text = props.message.text || ''
  
  if (isImageUrl(text)) return 'IMAGE'
  if (isVideoUrl(text)) return 'VIDEO'
  if (isAudioUrl(text)) return 'AUDIO'
  if (isFileUrl(text)) return 'FILE'
  
  return 'TEXT'
})

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

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})

const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']
  return imageExtensions.some(ext => url.toLowerCase().includes(ext))
}

const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv']
  return videoExtensions.some(ext => url.toLowerCase().includes(ext))
}

const isAudioUrl = (url: string): boolean => {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac']
  return audioExtensions.some(ext => url.toLowerCase().includes(ext))
}

const isFileUrl = (url: string): boolean => {
  return url.includes('/uploads/') || url.startsWith('http') && !isImageUrl(url) && !isVideoUrl(url) && !isAudioUrl(url)
}

const getFileName = (url: string): string => {
  const parts = url.split('/')
  const fileName = parts[parts.length - 1]
  try {
    const decoded = decodeURIComponent(fileName)
    return decoded.replace(/^[a-f0-9-]{36}\./, '') || 'Unknown File'
  } catch {
    return fileName.replace(/^[a-f0-9-]{36}\./, '') || 'Unknown File'
  }
}

const getFileExtension = (url: string): string => {
  const fileName = getFileName(url)
  const parts = fileName.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

const getFileIcon = (url: string): string => {
  const extension = getFileExtension(url).toLowerCase()
  
  const iconMap: Record<string, string> = {
    'pdf': 'bx bxs-file-pdf',
    'doc': 'bx bxs-file-doc',
    'docx': 'bx bxs-file-doc',
    'xls': 'bx bx-spreadsheet',
    'xlsx': 'bx bx-spreadsheet',
    'ppt': 'bx bx-slideshow',
    'pptx': 'bx bx-slideshow',
    'txt': 'bx bx-file-blank',
    'zip': 'bx bx-archive',
    'rar': 'bx bx-archive'
  }
  
  return iconMap[extension] || 'bx bx-file'
}

const handleImageError = () => {
  imageError.value = true
}

const handleVideoError = () => {
  videoError.value = true
}

const handleAudioError = () => {
  audioError.value = true
}
</script>