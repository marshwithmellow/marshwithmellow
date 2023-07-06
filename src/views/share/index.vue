<template>
  <swiper
    :direction="'vertical'"
    :slidesPerView="1"
    :spaceBetween="0"
    :scrollbar="true"
    :mousewheel="true"
    :modules="[Mousewheel]"
    @swiper="onSwiper"
    :allowTouchMove="!!agent"
    :speed="1000"
  >
    <swiper-slide>
      <div class="welcome" v-if="!agent">
        <img
          class="logo"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
          alt=""
          fit="scale-down"
          @click="navHome"
        />
        <img
          @click="spliderNext"
          class="down"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-down.png"
          alt=""
          fit="scale-down"
        />
        <img
          class="hand"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-hand.png"
          alt=""
          fit="scale-down"
          v-if="showHands"
        />
        <div v-else style="width: 64px; height: 60px"></div>
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            margin-left: 20px;
            width: 700px;
          "
        >
          <share-writer
            ref="writer1"
            :exampleText="`Hello，我是${nickName}`"
            autoStart
            @complete="writerComplete"
          ></share-writer>
          <share-writer
            ref="writer2"
            exampleText="邀请你和我一起进入 AI 世界。"
            @complete="writerComplete2"
          ></share-writer>
        </div>
      </div>
      <div class="phone-welcome" v-else>
        <img
          class="logo"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
          alt=""
          fit="scale-down"
          @click="navHome"
        />
        <img
          @click="spliderNext"
          class="down"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-down.png"
          alt=""
          fit="scale-down"
        />
        <img
          class="hand"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-hand.png"
          alt=""
          fit="scale-down"
          v-if="showHands"
        />
        <div v-else style="width: 64px; height: 60px"></div>
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            margin-left: 20px;
            width: 70vw;
          "
        >
          <share-writer-small
            ref="writer1"
            :exampleText="`Hello，我是${nickName}`"
            autoStart
            @complete="writerComplete"
          ></share-writer-small>
          <share-writer-small
            ref="writer2"
            exampleText="邀请你和我一起进入 AI 世界。"
            @complete="writerComplete2"
          ></share-writer-small>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>
      <el-scrollbar
        height="100vh"
        class="swiper-no-mousewheel swiper-no-swiping"
        @scroll="scrollHandler"
        @wheel="wheelHandler"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        v-if="!agent"
      >
        <div class="content">
          <div class="title">新用户注册并完成首充获得专属权益礼包</div>
          <div class="desc">
            2023 年 7 月 1 日至 7 月 30
            日期间，使用引荐链接注册成为新用户并完成首笔充值 MBM OpenAI
            服务，即可加赠 30% 充值金额专属优惠，更可受邀免费参加由 MBM OpenAI
            于中国大陆线下举办的 AI 分享沙龙活动。期待与你碰面。
          </div>
          <img
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-slider1.png"
            class="slider"
            fit="scale-down"
            @click="navSlider(0)"
          />
          <img
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-slider2.png"
            class="slider"
            fit="scale-down"
            @click="navSlider(1)"
          />
          <img
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-slider3.png"
            class="slider"
            fit="scale-down"
            @click="navSlider(2)"
          />
          <div class="bottom">
            {{ `通过${nickName}的引荐链接注册享受充值加赠权益` }}
          </div>
          <div class="button" @click="nav(0)">
            <div class="text">现在开启你的 AI 时刻</div>
          </div>
          <div class="button" @click="nav(1)">
            <div class="text">了解更多</div>
          </div>
          <div class="foot">
            <div class="small">MBM © 2023</div>
            <div class="small">沪ICP备17030457号-1</div>
            <div class="big" @click="nav(1)">MBM OpenAI GPT4 服务</div>
            <div class="small">
              <a href="mailto:help@mustlisten.com" target="_top">
                help@mustlisten.com
              </a>
            </div>
            <div class="small">4008316028</div>
          </div>
        </div>
      </el-scrollbar>
      <el-scrollbar
        height="100vh"
        @scroll="scrollHandler"
        class="swiper-no-mousewheel swiper-no-swiping phone"
        @wheel="wheelHandler"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        ref="scrollView"
        v-else
      >
        <div class="phone-content">
          <div class="title">新用户注册并完成首充获得专属权益礼包</div>
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              flex-direction: column;
            "
          >
            <div class="desc">2023 年 7 月 1 日至 7 月 30 日期间，</div>
            <div class="desc">
              使用引荐链接注册成为新用户并完成首笔充值 MBM OpenAI 服务，即可加赠
              30% 充值金额专属优惠
            </div>
            <div class="desc">
              更可受邀免费参加由 MBM OpenAI 于中国大陆线下举办的 AI 分享沙龙活动
            </div>
            <div class="desc">期待与你碰面</div>
          </div>
          <img
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-slider1.png"
            class="slider"
            fit="scale-down"
            @click="navSlider(0)"
          />
          <img
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-slider2.png"
            class="slider"
            fit="scale-down"
            @click="navSlider(1)"
          />
          <img
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/share-slider3.png"
            class="slider"
            fit="scale-down"
            @click="navSlider(2)"
          />
          <div class="bottom">
            {{ `通过${nickName}的引荐链接注册享受充值加赠权益` }}
          </div>
          <div class="button" @click="nav(0)">
            <div class="text">现在开启你的 AI 时刻</div>
          </div>
          <div class="button" @click="nav(1)">
            <div class="text">了解更多</div>
          </div>
          <div class="foot">
            <div class="foot-row">
              <div class="row-part">
                <div class="big" @click="nav(1)">MBM OpenAI GPT4 服务</div>
              </div>
            </div>
            <div class="foot-row">
              <div class="row-part">
                <div class="small">MBM © 2023</div>
              </div>
              <div class="row-part">
                <div class="small">
                  <a href="mailto:help@mustlisten.com" target="_top">
                    help@mustlisten.com
                  </a>
                </div>
              </div>
            </div>
            <div class="foot-row">
              <div class="row-part">
                <div class="small">沪ICP备17030457号-1</div>
              </div>
              <div class="row-part">
                <div class="small">4008316028</div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </swiper-slide>
  </swiper>
</template>
<script setup lang="ts">
import {
  onBeforeMount,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
} from "vue";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
// import required modules
import { Mousewheel, FreeMode, Scrollbar } from "swiper";
import ShareWriter from "@/components/ChatGptSharewriter.vue";
import ShareWriterSmall from "@/components/ChatGptSharewriterSmall.vue";
import { isHashMode, debounce } from "@/utils/utils";
import { useRouter } from "vue-router";
const showHands = ref(false);
const $router = useRouter();
let swiperLock = false;
let debounceOpen = false;
let oldDeltaY = 1;
let oldScrollTop = 0;
let isMouseDown = false;
let startY = 0;
let useSwiper: any = null;
const nickName = ref<any>("");
const inviteCode = ref<any>("");
const proxy: any = getCurrentInstance()?.proxy ?? null;
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
onBeforeMount(() => {
  if ($router.currentRoute.value.query.nickName) {
    nickName.value = $router.currentRoute.value.query.nickName;
  }
  if ($router.currentRoute.value.query.inviteCode) {
    inviteCode.value = $router.currentRoute.value.query.inviteCode;
  }
});
const writerComplete = () => {
  proxy?.$refs["writer2"].start();
};
const writerComplete2 = () => {
  showHands.value = true;
};
const onSwiper = (swiper: any) => {
  useSwiper = swiper;
};
const scrollHandler = ({ scrollTop }: { scrollTop: number }) => {
  oldScrollTop = scrollTop;
  if (scrollTop > 0) {
    debounceOpen = true;
  }
  if (swiperLock) return;
  if (oldScrollTop === 0 && scrollTop === 0) {
    if (agent) {
      setTimeout(() => {
        swiperLock = true;
        useSwiper.slidePrev(1000);
        setTimeout(() => {
          swiperLock = false;
          oldScrollTop = 0;
        }, 1000);
      }, 500);
    } else {
      if (debounceOpen) {
        debounce(() => {
          debounceOpen = false;
        }, 300);
      } else {
        swiperLock = true;
        useSwiper.slidePrev(1000);
        setTimeout(() => {
          swiperLock = false;
          oldScrollTop = 0;
        }, 1000);
      }
    }
  }
};
const wheelHandler = ({ deltaY }: { deltaY: number }) => {
  oldDeltaY = deltaY;
  if (deltaY > 0) {
    debounceOpen = true;
  }
  if (swiperLock) return;
  if (oldDeltaY < 0 && deltaY < 0) {
    if (debounceOpen) {
      debounce(() => {
        debounceOpen = false;
      }, 300);
    } else {
      swiperLock = true;
      useSwiper.slidePrev(1000);
      setTimeout(() => {
        swiperLock = false;
        oldDeltaY = 1;
      }, 1000);
    }
  }
};
const handleMouseDown = (event: MouseEvent) => {
  isMouseDown = true;
  startY = event.clientY;
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isMouseDown) return;
  const currentY = event.clientY;
  if (currentY > startY && !swiperLock && oldScrollTop === 0) {
    swiperLock = true;
    useSwiper.slidePrev(1000);
    setTimeout(() => {
      swiperLock = false;
    }, 1000);
  }
  startY = currentY;
};

const handleMouseUp = () => {
  isMouseDown = false;
};
const nav = (index: number) => {
  switch (index) {
    case 0:
      if (isHashMode($router.options.history.base)) {
        skip(
          `${
            window.location.origin + import.meta.env.VITE_PUBLIC_BASE
          }/#/singleLogin?inviteCode=${inviteCode.value}&redirectUrl=${
            window.location.origin + import.meta.env.VITE_PUBLIC_BASE
          }/#/`,
          false
        );
      } else {
        skip(
          `${
            window.location.origin + import.meta.env.VITE_PUBLIC_BASE
          }/singleLogin?inviteCode=${inviteCode.value}&redirectUrl=${
            window.location.origin + import.meta.env.VITE_PUBLIC_BASE
          }`,
          false
        );
      }
      break;
    default:
      if (isHashMode($router.options.history.base)) {
        skip(
          `${
            window.location.origin + import.meta.env.VITE_PUBLIC_BASE
          }/#/?inviteCode=${inviteCode.value}&redirectUrl=${
            window.location.origin + import.meta.env.VITE_PUBLIC_BASE
          }/#/`,
          false
        );
      } else {
        skip(
          (window.location.href = `${
            window.location.origin + import.meta.env.VITE_PUBLIC_BASE
          }?inviteCode=${inviteCode.value}&redirectUrl=${
            window.location.origin + import.meta.env.VITE_PUBLIC_BASE
          }`),
          false
        );
      }
      break;
  }
};
const spliderNext = () => {
  useSwiper.slideNext(1000);
};
const navSlider = (index: number) => {
  switch (index) {
    case 0:
      skip("https://mchat.mbmzone.com", true);
      break;
    case 1:
      skip("http://visus.ai", true);
      break;
    default:
      skip("https://autogpt.mbmzone.com", true);
      break;
  }
};
const skip = (url: string, openNew = false) => {
  if (openNew) {
    window.open(url);
  } else {
    window.location.href = url;
  }
};
const navHome = () => {
  if (isHashMode($router.options.history.base)) {
    skip(`${window.location.href.split("#")[0]}#/`);
  } else {
    skip(`${$router.options.history.base}`);
  }
};
</script>
<style lang="scss" scoped>
@keyframes moveUpDown {
  0%,
  100% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(10px);
  }
}
@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(10deg);
  }
}
.swiper {
  width: 100vw;
  height: 100vh;
}
.swiper-slide {
  min-height: 100vh;
}
.welcome {
  min-height: 100vh;
  background: #07070d;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: relative;
  .logo {
    position: absolute;
    left: 40px;
    top: 30px;
    height: 40px;
    cursor: pointer;
  }
  .down {
    position: absolute;
    left: calc(50vw - 34px);
    bottom: 50px;
    height: 20px;
    animation: moveUpDown 2s linear infinite;
    cursor: pointer;
  }
  .hand {
    height: 60px;
    animation: wave 1s infinite ease-in-out;
  }
  .title {
    font-size: 3rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    color: #ffffff;
    opacity: 1;
    display: flex;
    flex-direction: row;
  }
}
.content {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 60px 0 50px;
  .title {
    font-size: 2rem;
    font-family: Gotham-Rounded;
    font-weight: bold;
    color: #07070d;
    opacity: 1;
  }
  .desc {
    max-width: 1000px;
    text-align: center;
    font-size: 1rem;
    font-family: Gotham-Rounded;
    font-weight: 500;
    line-height: 1.2rem;
    color: #07070d;
    opacity: 1;
  }
  .slider {
    width: 70vw;
    margin-top: 40px;
    cursor: pointer;
  }
  .bottom {
    margin-top: 60px;
    font-size: 2rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    color: #111113;
    opacity: 1;
  }
  .button {
    margin-top: 30px;
    border: 2px solid #000000;
    color: #000000;
    background-color: #fff;
    height: 50px;
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    &:hover {
      background-color: #000000;
      color: #fff;
    }
    &:active {
      background-color: #000000;
      color: rgba(255, 255, 255, 0.6);
    }
    .text {
      font-size: 1rem;
      font-family: Gotham-Rounded;
      font-weight: bold;
    }
  }
  .foot {
    width: 60vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin-top: 120px;
    .small {
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #111113;
      opacity: 1;
      a {
        color: #111113;
        &:hover {
          background: #fff;
        }
      }
    }
    .big {
      font-size: 1.5rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #111113;
      text-decoration: underline;
      opacity: 1;
      cursor: pointer;
    }
  }
}
.phone-welcome {
  min-height: 100vh;
  background: #07070d;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: relative;
  padding: 0 20px;
  .logo {
    position: absolute;
    left: 40px;
    top: 30px;
    height: 40px;
    cursor: pointer;
  }
  .down {
    position: absolute;
    left: calc(50vw - 34px);
    bottom: 50px;
    height: 20px;
    animation: moveUpDown 2s linear infinite;
    cursor: pointer;
  }
  .hand {
    height: 60px;
    animation: wave 1s infinite ease-in-out;
  }
  .title {
    font-size: 3rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    color: #ffffff;
    opacity: 1;
    display: flex;
    flex-direction: row;
  }
}

.phone-content {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 60px 20px 50px;
  .title {
    font-size: 1rem;
    font-family: Gotham-Rounded;
    font-weight: bold;
    color: #07070d;
    opacity: 1;
  }
  .desc {
    max-width: 1000px;
    text-align: left;
    font-size: 1rem;
    font-family: Gotham-Rounded;
    font-weight: 500;
    line-height: 1.2rem;
    color: #07070d;
    opacity: 1;
  }
  .slider {
    width: 70vw;
    margin-top: 40px;
    cursor: pointer;
  }
  .bottom {
    margin-top: 60px;
    font-size: 1rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    color: #111113;
    opacity: 1;
  }
  .button {
    margin-top: 30px;
    border: 2px solid #000000;
    color: #000000;
    background-color: #fff;
    height: 50px;
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    &:hover {
      background-color: #000000;
      color: #fff;
    }
    &:active {
      background-color: #000000;
      color: rgba(255, 255, 255, 0.6);
    }
    .text {
      font-size: 1rem;
      font-family: Gotham-Rounded;
      font-weight: bold;
    }
  }
  .foot {
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 50px;
    .small {
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #111113;
      opacity: 1;
      a {
        color: #111113;
        &:hover {
          background: #fff;
        }
      }
    }
    .big {
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #111113;
      text-decoration: underline;
      opacity: 1;
      cursor: pointer;
    }
    .foot-row {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      height: 50px;
      .row-part {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
      }
    }
  }
}
</style>
