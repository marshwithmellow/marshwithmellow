<template>
  <div 
    class="arrow-button"
    @mousedown.stop="handleMouseDown"
    @mouseup.stop="handleMouseUp"
    @dblclick.stop
  >
    <el-icon class="arrow-icon">
      <ArrowRight />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'

const handleMouseDown = (event) => {
  event.preventDefault() // 阻止默认行为
}

const handleMouseUp = (event) => {
  event.preventDefault() // 阻止默认行为
}
</script>

<style lang="scss" scoped>
.arrow-button {
  user-select: none; // 禁用文本选择
  // 其他样式保持不变
}
</style> 