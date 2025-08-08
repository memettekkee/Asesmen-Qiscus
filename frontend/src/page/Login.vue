<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-secondary px-6">
      <BackButton/>
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full" />
      <div class="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/10 rounded-tr-full" />
      <div class="relative w-full max-w-md">
        <!-- Login Container -->
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 md:p-10">
          <!-- Logo -->
        <div class="flex justify-center mb-8">
            <img class="h-16" src="/public/image/main-logo.png"/>
            <img class="h-8" src="/public/image/second-logo.png"/>
        </div>
          <h2 class="text-2xl font-bold text-center mb-2">Welcome Back!</h2>
          <p class="text-gray-600 text-center mb-8">
            Continue your journey with friends and experiences
          </p>
          <!-- Login Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-4">
              <div class="relative">
                <i class="bx bx-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                <input
                  type="email"
                  v-model="email"
                  placeholder="Email address"
                  class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div class="relative">
                <i class="bx bx-lock-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                <input
                  type="password"
                  v-model="password"
                  placeholder="Password"
                  class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>
            
            <!-- Error message -->
            <div v-if="error" class="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
              {{ error }}
            </div>         
            <!-- <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span class="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" class="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div> -->
            <button
              type="submit"
              class="w-full bg-primary text-white px-6 py-3 rounded-xl hover:bg-hover transition-colors flex items-center justify-center group"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Signing in...</span>
              <span v-else>Sign In</span>
              <i v-if="!isLoading" class="bx bx-right-arrow-alt ml-2 group-hover:translate-x-1 transition-transform text-xl"></i>
            </button>
            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
            </div>
            
          </form>
          <!-- Sign Up Link -->
          <p class="mt-8 text-center text-gray-600">
            Don't have an account?
            <button @click="$router.push('/register')" class="text-primary hover:underline font-medium">
              Sign up for free
            </button>
          </p>
        </div>
        <!-- Decorative Circles -->
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { profileData } from '../helpers/composeApi'
  import { useNotification } from '../helpers/notification'
import BackButton from '../molecules/BackButton.vue'


  onMounted(() => {
  const registerSuccess = localStorage.getItem('register_success')
  if (registerSuccess === 'true') {
    useNotification().success('Account successfully registered !')
    localStorage.removeItem('register_success')
  }
})
  
  const router = useRouter()
  const { isLoading, error, loginUserProfile } = profileData();

  const email = ref('')
  const password = ref('')
  
  const handleSubmit = async () => {
    const formData = {
      email: email.value,
      password: password.value
    };
    const response = await loginUserProfile(formData);

    if (response) {
      localStorage.setItem('login_success', 'true')
      router.push('/'); 
    }
  }
  </script>