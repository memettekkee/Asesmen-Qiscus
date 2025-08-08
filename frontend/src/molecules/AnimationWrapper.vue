<template>
    <motion.div
      :initial="animations[type].initial"
      :animate="animations[type].animate"
      :transition="{
      ...animations[type].transition,
      delay: customDelay || 0
      }"
      :class="customClass"
    >
      <slot></slot>
    </motion.div>
  </template>
  
  <script setup lang="ts">
  import { motion } from 'motion-v'

  type AnimationType = 'slideRight' | 'slideLeft' | 'slideDown' | 'slideUp' | 'fadeIn' | 'fadeUp' | 'scaleUp';
  
  defineProps({
    type: {
      type: String as () => AnimationType,
      default: 'fadeIn'
    },
    customClass: {
      type: String,
      default: ''
    },
    customDelay: {
      type: Number,
      default: 0
    }
  })
  
  // Preset animations
  const animations = {
    slideRight: {
      initial: { x: -100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    },
    slideLeft: {
      initial: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    },
    slideDown: {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    },
    slideUp: {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.8 }
    },
    fadeUp: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    },
    scaleUp: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.5 }
    },
    // Other animation presets...
  }
  </script>

  