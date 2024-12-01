<template>
  <div class="wrap">
    <span class="chat-gpt-typewriter">{{ visibleText }}</span>
    <span v-if="showPoint" id="cursor">|</span>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
const props = defineProps<{
  exampleText: string;
}>();
const visibleText = ref("");
const showPoint = ref(true);
onMounted(() => {
  setTimeout(() => {
    typeCharacters();
  }, 800);
});
const typeCharacters = () => {
  let index = 0;
  const intervalId = setInterval(() => {
    visibleText.value += props.exampleText[index];
    index++;
    if (index === props.exampleText.length) {
      clearInterval(intervalId);
      showPoint.value = false;
    }
  }, 100);
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 99;
  .chat-gpt-typewriter {
    height: 100%;
    font-size: 36px;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    line-height: 25px;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: 2px;
    mix-blend-mode: multiply;
    background-blend-mode: multiply;
    position: relative;
  }
  .chat-gpt-typewriter::after {
    position: absolute;
    top: 2px;
    left: 2px;
    color: #ffffff;
    mix-blend-mode: screen;
    background-blend-mode: screen;
  }
  .chat-gpt-typewriter::before {
    position: absolute;
    top: 0;
    left: 0;
    color: #000000;
    mix-blend-mode: multiply;
    background-blend-mode: multiply;
  }
  #cursor {
    font-size: 36px;
    height: 25px;
    line-height: 25px;
    color: #ffffff;
    animation: cursor 0.5s infinite;
    margin-top: -9px;
  }
  @keyframes cursor {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
