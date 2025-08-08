<template>
    <div class="min-h-screen flex flex-col bg-accent-2">
      <Navbar />
      
      <main class="flex-grow flex items-center justify-center p-4">
        <div class="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="md:flex">
            <div class="md:w-1/2 bg-primary p-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-40 w-40 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div class="md:w-1/2 p-8 bg-secondary">
              <div class="text-center">
                <h1 class="text-5xl font-bold text-primary mb-2">404</h1>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                <p class="text-gray-600 mb-6">Oops! The page you're looking for doesn't exist or has been moved.</p>
                
                <router-link 
                  to="/" 
                  class="inline-block px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-hover transition-colors duration-300"
                >
                  Return Home
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
</script>