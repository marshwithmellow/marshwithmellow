<template>
  <div 
    class="search-button"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
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
    target.style.transform = 'scale(0.95)'
    const arrow = target.querySelector('.arrow-icon') as HTMLElement
    arrow.classList.add('arrow-pressed')
  }
}

const handleMouseUp = (e?: MouseEvent) => {
  const target = e ? e.currentTarget as HTMLElement : document.querySelector('.search-button')
  if (target) {
    target.style.transform = ''
    const arrow = target.querySelector('.arrow-icon') as HTMLElement
    arrow.classList.remove('arrow-pressed')
  }
}

// 暴露方法给父组件使用
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
  transition: all 0.2s ease;
  will-change: transform;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #fff;
  transition: transform 0.2s ease;
}

.arrow-icon.arrow-pressed {
  transform: translateX(2px);
}

.search-button:hover {
  transform: scale(1.02);
  background: rgba(0, 0, 0, 0.8);
}

.search-button:active {
  background: #000;
}
</style> 