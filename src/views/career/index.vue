<template>
  <div class="container">
    <el-container class="body-container">
      <el-header class="top">
        <div class="top-header">
          <div class="title">YourCareer.Ai</div>
          <div class="wel">欢迎回来 小李子</div>
        </div>
        <img :src="banner" class="banner" />
        <el-divider style="--el-border-color: #535353" />
      </el-header>
      <el-main class="main-container">
        <el-container>
          <el-aside class="main-aside-container">
            <div class="aside-part check">
              <img :src="iconHomeHouse" class="part-icon" />
              <div class="text">主页</div>
            </div>
            <div class="aside-part normal">
              <img :src="iconChatLine" class="part-icon" />
              <div class="text">咨询</div>
            </div>
            <div class="aside-part normal">
              <img :src="iconUserPlus" class="part-icon" />
              <div class="text">社区</div>
            </div>
          </el-aside>
          <el-container>
            <el-header class="content-top">
              <div class="content-start-container">
                <div class="content-start-left">
                  <div class="txt">立即获取你的专属Career.AI</div>
                </div>
                <div class="content-start-right">
                  <div class="txt">开始聊天</div>
                </div>
              </div>
              <swiper
                :initialSlide="0"
                :loopedSlides="2"
                slidesPerView="auto"
                :spaceBetween="0"
                :scrollbar="false"
                style="margin-top: 10px"
                :loop="false"
                class="tags-swiper"
              >
                <swiper-slide v-for="(item, index) in tagsList" :key="index">
                  <div
                    class="tags-container"
                    :class="currentTags == index ? 'check' : 'normal'"
                    @click="currentTags = index"
                  >
                    <div class="txt">{{ item }}</div>
                  </div>
                </swiper-slide>
              </swiper>
            </el-header>
            <el-main>Main</el-main>
          </el-container>
        </el-container>
      </el-main>
    </el-container>
    <!-- <div class="chat-gpt">
      <div id="chat-dialog" class="chat-dialog" ref="chatDialogRef">
        <div id="chat-list" class="chat-list" ref="chatListRef">
          <div v-for="(item, index) in chatList" :key="index">
            <img
              v-if="item.status && index % 2 == 0"
              src="../../public/img/speak1.gif"
              alt=""
            />
            <div :class="index % 2 == 0 ? 'odd' : 'even'">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  getCurrentInstance,
  watch,
  computed,
  onUnmounted,
  onMounted,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import banner from "@/assets/images/career-banner-1.png";
import iconUserPlus from "@/assets/images/career-user-plus.png";
import iconChatLine from "@/assets/images/career-chat-line.png";
import iconHomeHouse from "@/assets/images/career-home-house.png";
import { House, ChatLineSquare, User } from "@element-plus/icons-vue";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
const textCount = ref(0);
const timer = ref();
const chatBaseList = ref<Array<string>>([
  "以今日5辆满电无人车，运输5小时能运完50吨货物的标准，已知每辆无人车运输1小时耗电10%，运输效率是多少，每辆无人车耗电多少？花费多长时间？",
  "运输效率：50吨/5小时=10顿/小时，每辆无人车耗电：10%×5小时=50%，需花费5小时。",
  "以现有运输效率前提下，再增加5辆无人运输车，完成共计150吨物资的运输任务，整体效率会提高到多少？每辆无人车耗电又是多少？共花费多长时间？",
  "增加到10辆无人车，完成共计150吨物资运输任务，整体效率会提高到15顿/小时，每辆无人车耗电百分比是15%。运完150吨的话，总共要耗用1.5小时。",
  "我来想想是否确认执行此调配操作？",
  "您好，请您慎重考虑。我们将根据您的确认来决定是否执行此调配操作。",
  "是",
]);
const currentTags = ref(0);
const tagsList = ref<Array<string>>([
  "互联网",
  "大数据",
  "元宇宙",
  "游戏",
  "重工机械",
  "服装纺织",
]);
type chatItem = {
  content: string;
  status: boolean;
};
const chatList = ref<Array<chatItem>>([]);
onMounted(() => {
  //   initGPT();
});
// 延时函数
const sleep = (delayTime = 10000) => {
  return new Promise((resolve) => setTimeout(resolve, delayTime));
};
// 同步遍历，自定义延时时间
const delayDo = async (
  iterList: Array<string>,
  callback = (item: string, i: number) => console.log(`数据：${item}`),
  delayTimeList: Array<number>
) => {
  let len = iterList.length;
  for (let i = 0; i < len; i++) {
    callback(iterList[i], i);
    await sleep(delayTimeList[i]);
  }
};
// 逐字显示内容
const getChatContent = (text: string, index: number) => {
  timer.value = setInterval(() => {
    textCount.value++;
    if (textCount.value == text.length + 1) {
      textCount.value = 0;
      chatList.value.splice(index, 1, { content: text, status: false });
      clearInterval(timer.value);
      return;
    }

    // 取字符串子串
    let nowStr = text.substring(0, textCount.value);
    chatList.value.splice(index, 1, { content: nowStr, status: true });
  }, 200);
};
// 点击开始聊天
const initGPT = () => {
  // const delayTimeList = [11000, 8000, 6000, 15000, 4000];
  const delayTimeList = [16000, 11000, 16000, 16000, 5000, 7000];
  delayDo(
    chatBaseList.value,
    (item: string, i: number) => {
      getChatContent(item, i);
    },
    delayTimeList
  );
};
</script>
<style lang="scss" scoped>
.container {
  min-height: 100vh;
  min-width: 100vw;
  background: #282828;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .body-container {
    width: 1080px;
    height: 896px;
    background: #252525;
    flex: none;
    box-shadow: 50px 50px 100px 10px rgba(0, 0, 0, 0.1);
    .top {
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      height: 380px;
      .top-header {
        width: 1080px;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        .title {
          color: #ffffff;
          font-size: 1.5rem;
        }
        .wel {
          color: #838389;
          font-size: 1.2rem;
        }
      }
      .banner {
        width: 1080px;
        height: 290px;
      }
    }
  }
  .main-container {
    background: #2c2d2f;
    padding: 40px 46px;
    display: flex;
    .main-aside-container {
      width: 120px;
      background: #373938;
      border-radius: 5px;
      .aside-part {
        width: 120px;
        height: 108px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &.check {
          background: #1b1f23;
        }
        &.normal {
          &:hover {
            background: rgba(27, 31, 35, 0.5);
          }
          &:active {
            background: #1b1f23;
          }
        }
        .text {
          font-size: 1rem;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(246, 228, 183, 1) 100%
          );
          color: #f6e4b7;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-top: 5px;
        }
        .part-icon {
          width: 36px;
          height: 36px;
        }
      }
    }
    .content-top {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      height: 110px;
      .content-start-container {
        width: 100%;
        height: 52px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        .content-start-left {
          flex: 1;
          height: 52px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          background: #373938;
          border-radius: 5px;
          padding-left: 18px;
          cursor: pointer;
          &:active {
            background: #1b1f23;
          }
          .txt {
            font-size: 1.5rem;
            color: #565957;
          }
        }
        .content-start-right {
          width: 154px;
          height: 52px;
          margin-left: 10px;
          background: #1b1f23;
          border-radius: 5px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover {
            background: rgba(27, 31, 35, 0.5);
          }
          &:active {
            background: #1b1f23;
          }
          .txt {
            font-size: 1.5rem;
            color: #ffffff;
          }
        }
      }
      .tags-container {
        width: 125px;
        height: 45px;
        background: #373938;
        border-radius: 10px;
        opacity: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &.check {
          background: #1b1f23;
        }
        &.normal {
          &:hover {
            background: rgba(27, 31, 35, 0.5);
          }
          &:active {
            background: #1b1f23;
          }
        }
        .txt {
          font-size: 1rem;
          color: #f9fefb;
        }
      }
    }
  }
  //   .chat-gpt {
  //     width: 33rem;
  //     height: 43rem;

  //     .chat-dialog {
  //       position: relative;
  //       height: 43rem;
  //         background: 0/33rem url("../../public/img/chat-bg.png") no-repeat;
  //       overflow: hidden;

  //       .close-icon {
  //         position: absolute;
  //         top: 1rem;
  //         right: 1rem;
  //         width: 3.4rem;
  //         height: 3.4rem;

  //         img {
  //           width: 100%;
  //           height: 100%;
  //         }
  //       }

  //       .chat-list {
  //         display: flex;
  //         flex-direction: column;
  //         width: 90%;
  //         margin: 0 auto;
  //         margin-top: 2rem;
  //         overflow: auto;

  //         > div {
  //           display: flex;
  //           margin-top: 1rem;

  //           > div {
  //             max-width: 19rem;
  //             padding: 0.6rem;
  //             opacity: 0.8;

  //             font-size: 0.9rem;
  //             font-family: FZLanTingHei-L-GBK;
  //             font-weight: 400;
  //             color: #c5e7ff;
  //             text-align: start;
  //           }

  //           .odd {
  //             align-self: flex-start;
  //             background: #435e6f;
  //             border-radius: 0px 16px 16px 16px;
  //           }

  //           .even {
  //             align-self: flex-end;
  //             background: #31b8c8;
  //             border-radius: 16px 0px 16px 16px;
  //           }

  //           img {
  //             width: 2rem;
  //             height: 2rem;
  //             margin-right: 1rem;
  //           }
  //         }

  //         > div:nth-of-type(odd) {
  //           align-self: flex-start;
  //         }

  //         > div:nth-of-type(even) {
  //           align-self: flex-end;
  //         }
  //       }
  //     }

  //     .chat-tips {
  //       display: flex;
  //       height: 5.82rem;
  //       margin-top: 1rem;

  //       .gpt-icon {
  //         height: 100%;

  //         img {
  //           height: 100%;
  //         }
  //       }
  //     }
  //   }
  .tags-swiper {
    margin-left: 0;
    margin-right: 0;
    :deep(.swiper-slide) {
      width: 135px !important;
      height: 45px !important;
      display: flex;
      justify-items: flex-start;
      align-items: flex-start;
    }
  }
}
</style>
