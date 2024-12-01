<template>
  <div class="carousel">
    <div class="carousel-track" :style="trackStyle">
      <div v-for="(slide, index) in slides" :key="index" class="carousel-slide">
        <img :src="slide.image" :alt="slide.title" class="carousel-image" />
      </div>
    </div>
    <div class="indicators">
      <span 
        v-for="(slide, index) in slides" 
        :key="index" 
        :class="{ active: index === currentIndex }" 
        class="indicator"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import image2 from '@/assets/images/2025mbmP2.png'
import image3 from '@/assets/images/2025mbmP3.png'

const slides = [
  { image: image2, title: 'Slide 2' },
  { image: image3, title: 'Slide 3' }
]

const currentIndex = ref(0)

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`
}))

const goToSlide = (index) => {
  currentIndex.value = index
}
</script>

<style scoped>
.carousel {
  overflow: hidden;
  position: relative;
  width: 100%;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
  transition: transform 0.5s ease;
}

.carousel-image {
  width: 100%;
  height: auto;
  display: block;
}

.indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.indicator.active {
  background: #fff;
}
</style> 