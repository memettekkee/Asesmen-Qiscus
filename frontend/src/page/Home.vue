<template>
  <main class="w-full">
    <Navbar/>
    <section class="w-full px-6 md:px-16 py-16 md:py-32 flex flex-col md:flex-row items-center justify-between bg-accent-2">
      <div class="w-full md:w-1/2 mb-10 md:mb-0">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span class="text-primary">Connect</span> with Friends in a 
          <span class="text-primary">Fun</span> New Way
        </h1>
        <p class="text-lg md:text-xl mb-8 text-gray-700">
          ChatKuy brings friends together through playful, location-based messaging. Share moments, track adventures, and stay connected with the people who matter most.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button @click="$router.push('/chat')" class="bg-primary text-white px-8 py-3 rounded-full hover:bg-hover transition-colors flex items-center justify-center">
            Start Chatting Now
            <ArrowRight class="ml-2" size={18} />
          </button>
          <a href="#features" class="bg-white border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-secondary transition-colors">
            Discover Features
          </a>
        </div>
      </div>
      <AnimationWrapper 
        type="slideLeft"
        :custom-delay="0.5"
        threshold="1" 
        customClass="md:px-16"
      >
        <img class="md:h-96 rounded-2xl shadow-2xl shadow-gray-300" src="/public/image/chat-preview.png"/>
      </AnimationWrapper>
    </section>
    <section
      id="features"
      class="w-full px-6 md:px-12 py-16 md:py-32 bg-white"
    >
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span class="text-primary">ChatKuy</span>?
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            Our platform brings friends together with enjoyful messaging 
            for fun social experiences and meaningful connections.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            v-animateonscroll="{ 
              enterClass: `animate-enter ${index % 2 === 0 ? 'slide-in-from-u-8' : 'slide-in-from-d-8'} animate-duration-1500`,
            }"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div class="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <i :class="feature.icon" class="text-primary text-3xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
    <section id="communities" class="w-full px-6 md:px-12 py-16 md:py-32 bg-secondary">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Join Thriving <span class="text-primary">Communities</span>
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            Connect with thousands of chat enthusiasts and friend groups sharing moments every day.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(community, index) in communities"
            :key="index"
            v-animateonscroll="{ 
              enterClass: `animate-enter ${index % 2 === 0 ? 'zoom-out-50' : 'zoom-in-50'} animate-duration-1000`,
            }"
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="h-40 overflow-hidden">
              <img
                :src="community.image"
                :alt="community.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-1">{{ community.name }}</h3>
              <p class="text-sm text-gray-600">
                {{ community.members.toLocaleString() }} members
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      id="how-it-works"
      class="w-full px-6 md:px-12 py-16 md:py-32 bg-white"
      >
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            How <span class="text-primary">ChatKuy</span> Works
          </h2>
          <p class="text-lg text-gray-700 max-w-2xl mx-auto">
            Getting started is easy. Follow these simple steps to begin connecting with friends.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="(step, index) in steps" 
            :key="index" 
            class="relative"
            v-animateonscroll="{ 
              enterClass: `animate-enter slide-in-from-l-8 animate-duration-${(index + 1) * 500}`,
              delay: index * 150
            }"
          >
            <div class="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <span class="text-primary text-xl font-bold">
                {{ step.number }}
              </span>
            </div>
            <div 
              v-if="index < steps.length - 1" 
              class="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-secondary"
            ></div>
            <h3 class="text-xl font-semibold mb-2">{{ step.title }}</h3>
            <p class="text-gray-600">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import AnimationWrapper from '../molecules/AnimationWrapper.vue'
import { features, communities, steps } from '../utils/data'
import { useNotification } from '../helpers/notification'


onMounted(() => {
  const loginSuccess = localStorage.getItem('login_success')
  if (loginSuccess === 'true') {
    useNotification().success('Login successfully !')
    localStorage.removeItem('login_success')
  }
})

</script>


