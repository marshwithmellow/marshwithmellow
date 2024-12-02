<template>
  <div 
    class="search-button"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <div class="ripple-container"></div>
    <svg 
      class="arrow-icon"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
const handleMouseDown = (e?: MouseEvent) => {
  const target = e ? e.currentTarget as HTMLElement : document.querySelector('.search-button')
  if (target) {
    target.classList.add('button-pressed')
    
    // 创建涟漪效果
    if (e) {
      const ripple = document.createElement('div')
      ripple.className = 'ripple'
      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2
      
      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      
      const rippleContainer = target.querySelector('.ripple-container')
      rippleContainer?.appendChild(ripple)
      
      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
  }
}

const handleMouseUp = (e?: MouseEvent) => {
  const target = e ? e.currentTarget as HTMLElement : document.querySelector('.search-button')
  if (target) {
    target.classList.remove('button-pressed')
  }
}

defineExpose({
  triggerPress: () => handleMouseDown(),
  triggerRelease: () => handleMouseUp()
})
</script>

<style scoped>
.search-button {
  width: 36px;
  height: 36px;
  background: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ripple 0.6s linear;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #fff;
  position: relative;
  z-index: 1;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.search-button.button-pressed {
  transform: scale(0.92);
}

.search-button.button-pressed .arrow-icon {
  transform: translateX(3px) scale(0.95);
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style> 