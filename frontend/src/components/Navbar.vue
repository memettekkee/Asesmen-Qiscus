
<template>
    <header class="w-full py-4 px-6 md:px-16 flex justify-between items-center sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div class="flex">
            <img class="h-12" src="/public/image/main-logo.png"/>
            <img class="h-6" src="/public/image/second-logo.png"/>
        </div>
        <nav class="hidden md:flex items-center space-x-8">
            <a
            href="#features"
            class="text-gray-700 hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#communities"
            class="text-gray-700 hover:text-primary transition-colors"
          >
            Communities
          </a>
          <a
            href="#how-it-works"
            class="text-gray-700 hover:text-primary transition-colors"
          >
            How It Works
          </a>
          <div v-if="user != null" class="flex gap-8 text-gray-700 ">
            <a 
              @click="$router.push('/members')" 
              class="hover:text-primary transition-colors"
            >
              A Friends !
            </a>
            <Menu as="div" class="relative">
              <MenuButton class="hover:text-primary transition-colors flex items-center gap-2">
                <img class="w-5 h-5 rounded-full border border-black hover:border-primary transition-colors" :src="user.avatar || 'https://avatar.iran.liara.run/public'"/>
                {{ user.name }}
              </MenuButton>
              <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg">
                  <div class="">
                    <MenuItem v-slot="{ active }">
                      <a 
                        @click="handleLogout"
                        :class="[
                          active ? 'bg-primary text-accent-2' : 'text-gray-700', 
                          'block rounded-md px-4 py-2 text-sm'
                        ]"
                      >
                        Logout
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a 
                        @click="$router.push('/chat')"
                        :class="[
                          active ? 'bg-primary text-accent-2' : 'text-gray-700', 
                          'block rounded-md px-4 py-2 text-sm'
                        ]"
                      >
                        Chat's
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a 
                        @click="$router.push('/profile')"
                        :class="[
                          active ? 'bg-primary text-accent-2' : 'text-gray-700', 
                          'block rounded-md px-4 py-2 text-sm'
                        ]"
                      >
                        Profile
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div v-else class="flex gap-4 justify-center">
            <button @click="$router.push('/login')"  class="bg-white border-2 border-primary text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
              Log In
            </button>
            <button @click="$router.push('/register')"  class="bg-primary text-white px-6 py-2 rounded-full hover:bg-hover transition-colors">
              Sign Up Free
            </button>
          </div>
        </nav>
        
        <!-- Mobile  -->
         <button class="md:hidden" @click="isMenuOpen = !isMenuOpen">
            <AnimationWrapper
              type="fadeIn"
              :custom-delay="0.5"
              threshold="1"  
              v-if="isMenuOpen"
            >
              <i class="bx bx-x text-xl hover:text-primary transition-colors"/>  
            </AnimationWrapper>
            <AnimationWrapper         
              type="fadeIn"
              :custom-delay="0.5"
              threshold="1"  
              v-else
            >
              <i class="bx bx-menu text-xl hover:text-primary transition-colors"/>
            </AnimationWrapper>
         </button>
         <AnimationWrapper
         type="slideDown"
         :custom-delay="0.5"
         threshold="1" 
          v-if="isMenuOpen" class="absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 md:hidden">
            <nav class="flex flex-col space-y-4">
              <a
                href="#features"
                class="text-gray-700 hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#communities"
                class="text-gray-700 hover:text-primary transition-colors"
              >
                Communities
              </a>
              <a
                href="#how-it-works"
                class="text-gray-700 hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <div v-if="user != null" class="flex flex-col gap-4 text-gray-700 ">
                <a 
                @click="$router.push('/members')" 
                class="hover:text-primary transition-colors"
              >
                A Friends !
              </a>
                <Menu as="div" class="relative">
                  <MenuButton class="hover:text-primary transition-colors flex items-center gap-2">
                    <img class="w-5 h-5 rounded-full border border-black hover:border-primary transition-colors" :src="user.avatar || 'https://avatar.iran.liara.run/public'"/>
                    {{ user.name }}
                  </MenuButton>
                  <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems class="absolute left-0 z-10 mt-2 w-20 origin-top-left rounded-md bg-white shadow-lg">
                      <div class="">
                        <MenuItem v-slot="{ active }">
                          <a 
                            @click="handleLogout"
                            :class="[
                              active ? 'bg-primary text-accent-2' : 'text-gray-700', 
                              'block rounded-md px-4 py-2 text-sm'
                            ]"
                          >
                            Logout
                          </a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <a 
                            @click="$router.push('/chat')"
                            :class="[
                              active ? 'bg-primary text-accent-2' : 'text-gray-700', 
                              'block rounded-md px-4 py-2 text-sm'
                            ]"
                          >
                            Chat's
                          </a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <a 
                            @click="$router.push('/profile')"
                            :class="[
                              active ? 'bg-primary text-accent-2' : 'text-gray-700', 
                              'block rounded-md px-4 py-2 text-sm'
                            ]"
                          >
                            Profile
                          </a>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
              <div v-else class="flex flex-col gap-4">
                <button @click="$router.push('/login')" class="bg-white border-2 border-primary text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                  Log In
                </button>
                <button @click="$router.push('/register')" class="bg-primary text-white px-6 py-2 rounded-full hover:bg-[#0AB391] transition-colors">
                  Sign Up Free
                </button>
              </div>
            </nav>
          </AnimationWrapper>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { getUserProfile } from '../utils/fetchApi';
import type { User } from '../utils/interface';
import AnimationWrapper from '../molecules/AnimationWrapper.vue';
import { useNotification } from '../helpers/notification'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const router = useRouter()
const user = ref<User | null>(null);
const isMenuOpen = ref(false)

onMounted(async () => {
  try {
    const userData = await getUserProfile()
    user.value = userData
  } catch (err) {
    console.error(err)
  }
})

const handleLogout = async () => {

  const confirmed = await useNotification().confirm(
    'Confirm Logout',
    'Are you sure you want to logout from your account?',
    'Yes',
    'No'
  )

  if (confirmed) {
    useNotification().success('Logout successfully !')
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    user.value = null
    setTimeout(() => {
      router.go(0)
    }, 2000) 
  } else {
    useNotification().error('Failed to logout')
  }
}

</script>