<template>
  <div class="wrap">
    <span class="chat-gpt-typewriter">{{ visibleText }}</span>
    <span v-if="showPoint" id="cursor">|</span>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
const emits = defineEmits(["complete"]);
const props = defineProps({
  exampleText: {
    type: String,
    default: "",
  },
  autoStart: {
    type: Boolean,
    default: false,
  },
});
const visibleText = ref("");
const showPoint = ref(false);
onMounted(() => {
  if (props.autoStart) {
    showPoint.value = true;
    setTimeout(() => {
      typeCharacters();
    }, 800);
  }
});
const start = () => {
  showPoint.value = true;
  setTimeout(() => {
    typeCharacters();
  }, 800);
};
const typeCharacters = () => {
  visibleText.value = "";
  let index = 0;
  const intervalId = setInterval(() => {
    visibleText.value += props.exampleText[index];
    index++;
    if (index === props.exampleText.length) {
      clearInterval(intervalId);
      showPoint.value = false;
      emits("complete");
    }
  }, 100);
};
defineExpose({
  start,
});
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 99;
  .chat-gpt-typewriter {
    height: 100%;
    font-size: 1rem;
    font-family: FZZCHJW;
    font-weight: 400;
    color: #fff;
    letter-spacing: 2px;
    mix-blend-mode: multiply;
    background-blend-mode: multiply;
    position: relative;
    white-space: nowrap;
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
    font-size: 1rem;
    height: 30px;
    line-height: 30px;
    color: #ffffff;
    animation: cursor 0.5s infinite;
    // margin-top: -9px;
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
