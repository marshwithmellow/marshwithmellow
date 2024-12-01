<template>
  <div class="custom-slider">
    <div class="scale">
      <div
        v-for="(item, index) in scaleItems"
        :key="index"
        :class="{ 'scale-item': index != 0 && index != maxValue }"
      >
        <span v-if="item.numbered" class="scale-number">{{ item.number }}</span>
      </div>
    </div>
    <div class="slider-container">
      <el-slider
        :model-value="props.modelValue"
        :max="maxValue"
        :step="stepValue"
        :show-tooltip="false"
        size="large"
        @input="updateValue"
      />
      <div class="blue-line" :style="{ width: amount + '%' }"></div>
    </div>
    <div class="slider-labels">
      <div class="interval" style="width: 20%">
        <span class="label-text">日常使用</span>
      </div>
      <div class="interval" style="width: 40%">
        <div class="vertical-line"></div>
        <div class="horizontal-line"></div>
        <!-- <div class="vertical-line"></div> -->
        <span class="label-text" :class="modelValue <= 2 ? 'disabled' : ''">
          创意思维、学习辅导、编程辅导
        </span>
      </div>
      <div class="interval" style="width: 30%">
        <div class="vertical-line"></div>
        <div class="horizontal-line"></div>
        <!-- <div class="vertical-line"></div> -->
        <span class="label-text" :class="modelValue <= 6 ? 'disabled' : ''"
          >业务分析与建议</span
        >
      </div>
      <div class="interval" style="width: 10%">
        <div class="vertical-line"></div>
        <div class="horizontal-line"></div>
        <div class="vertical-line-end"></div>
        <span class="label-text" :class="modelValue <= 9 ? 'disabled' : ''">
          客户支持
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Number,
    default: 2,
  },
  remainAmount: {
    type: Number,
    default: 0,
  },
});
const amount = computed(() => {
  if (props.remainAmount <= 0) {
    return 0;
  }
  if (props.remainAmount >= 50) {
    return 100;
  }
  return parseFloat((props.remainAmount / 50).toFixed(4)) * 100;
});
const maxValue = 10;
const stepValue = 1;
const scaleItems = Array.from({ length: maxValue + 1 }, (_, index) => ({
  numbered: index != 0 && index % 3 === 0,
  number: index * 5,
}));
const updateValue = (e: any) => {
  if (e < 2) {
    return;
  }
  emits("update:modelValue", e);
};
</script>

<style lang="scss" scoped>
.custom-slider {
  position: relative;
  width: 100%;
}
.slider-container {
  position: relative;
  width: 100%;
  .blue-line {
    height: 12px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    position: absolute;
    left: 0;
    top: 14px;
    background-color: #4383ea;
  }
}

.scale {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.scale-item {
  position: relative;
  width: 1px;
  height: 10px;
  background-color: grey;
}

.scale-number {
  position: absolute;
  font-size: 12px;
  color: gray;
  bottom: 20px;
  transform: translateX(-50%);
  font-family: Gotham-Rounded;
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -50px;
  width: 100%;
}

.interval {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.vertical-line {
  position: absolute;
  left: 0;
  top: -10px;
  width: 1px;
  height: 10px;
  background-color: #484747;
}

.vertical-line-end {
  position: absolute;
  right: 0;
  top: -10px;
  width: 1px;
  height: 10px;
  background-color: #484747;
}
.horizontal-line {
  width: 100%;
  height: 1px;
  background-color: #484747;
}

.label-text {
  margin-top: 5px;
  text-align: center;
  font-size: 0.6rem;
  font-weight: bold;
  color: #c9c9c9;
  font-family: Gotham-Rounded;
  &.disabled {
    font-size: 6px;
    font-family: Gotham-Rounded;
    font-weight: bold;
    color: #676767;
    opacity: 1;
  }
}
:global(.el-slider__runway) {
  height: 12px;
  border-radius: 6px;
  background-color: #676767;
}
:global(.el-slider__bar) {
  height: 12px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background-color: #292828;
}
:global(.el-slider__button-wrapper) {
  height: 42px;
  width: 42px;
}
:global(.el-slider__button) {
  width: 26px;
  height: 26px;
  border: 1px solid #707070;
  background-color: #1a1717;
}
</style>
