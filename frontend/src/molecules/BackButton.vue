<template>
    <button 
      @click="goBack" 
      class="fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary hover:bg-hover transition-colors shadow-md group"
      aria-label="Go back"
    >
      <div class="relative w-6 h-6 text-white">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="3" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          class="group-hover:-translate-x-1 transition-transform duration-300 ease-in-out"
        >
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </svg>
      </div>
    </button>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goBack = () => {
    router.push('/');
  };
  </script>
  