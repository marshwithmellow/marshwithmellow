<template>
  <div>
    <div class="px-common-layout" v-if="!agent">
      <el-image
        class="bg"
        src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/loading.jpg"
        fit="cover"
      />
      <el-image
        class="logo"
        src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
      />
      <div class="txt">我们正在更新，稍后回来</div>
    </div>
    <div v-else class="phone-container">
      <el-image
        class="logo"
        src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
      />
      <div class="txt">我们正在更新，稍后回来</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
// import loading from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/loading.jpg";
// import logo from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png";
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
</script>
<style lang="scss" scoped>
.px-common-layout {
  height: 100vh;
  background: #fff;
  width: 100vw;
  position: relative;
  .bg {
    position: absolute;
    right: 0;
    top: 0;
    width: 50vw;
    height: 100vh;
  }
  .logo {
    position: absolute;
    left: calc(50vw - 50px);
    top: 50vh;
    height: 40px;
  }
  .txt {
    font-size: 16px;
    font-weight: bold;
    line-height: 13px;
    color: #ffffff;
    opacity: 1;
    position: absolute;
    left: 68vw;
    top: calc(50vh + 20px);
  }
}
.phone-container {
  height: 100vh;
  background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png/loading.jpg")
    center / auto 100% no-repeat;
  width: 100vw;
  position: relative;
  .logo {
    position: absolute;
    left: calc(50vw - 70px);
    top: 10vh;
    height: 40px;
  }
  .txt {
    font-size: 20px;
    font-weight: bold;
    line-height: 13px;
    color: #ffffff;
    opacity: 1;
    position: absolute;
    left: calc(50vw - 100px);
    top: calc(50vh + 20px);
  }
}
</style>
