<template>
    <footer class="w-full px-6 md:px-12 py-12 bg-white border-t border-gray-200">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
          <div class="flex mb-4">
            <img class="h-12" src="/public/image/main-logo.png"/>
            <img class="h-6" src="/public/image/second-logo.png"/>
        </div>
            <p class="text-gray-600 mb-4">
              Connecting friends through fun and interactive messaging.
            </p>
            <div class="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/muhammad-met/"
                target="_blank"
                class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <i class="bx bxl-linkedin text-primary text-xl"></i>
              </a>
              <a
                href="https://github.com/memettekkee"
                target="_blank"
                class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <i class="bx bxl-github text-primary text-xl"></i>
              </a>
              <a
                href="https://www.instagram.com/mhmmad_23_/"
                target="_blank"
                class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <i class="bx bxl-instagram text-primary text-xl"></i>
              </a>
            </div>
          </div>
          
        </div>
        <div class="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-600 text-sm">
            &copy; {{ new Date().getFullYear() }} ChatKuy. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="https://muhammadmet.biz.id/" target="_blank" class="text-gray-600 hover:text-primary text-sm">
              Product by Muhammad
            </a>
          </div>
        </div>
      </div>
    </footer>
  </template>