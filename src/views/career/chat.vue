<template>
  <div class="container">
    <el-container class="body-container">
      <el-header class="top">
        <el-icon class="top-back"><ArrowLeft /></el-icon>
        <div class="title">（职业规划家）linda</div>
      </el-header>
      <el-main class="main-container">
        <el-container>
          <el-main class="main">
            <div class="chat-container">
              <div class="chat-dialog">
                <el-scrollbar ref="scrollbarRef" class="chat-list">
                  <div
                    class="chat-ai"
                    :class="index % 2 == 0 ? '' : 'user'"
                    v-for="(item, index) in chatList"
                    :key="index"
                  >
                    <img
                      :src="index % 2 == 0 ? iconLindaAvatar : iconUserAvatar"
                      alt=""
                      :style="{
                        margin: index % 2 == 0 ? '0 10px 0 0' : '0 0 0 10px',
                      }"
                    />
                    <div
                      class="chat-layout"
                      :class="index % 2 == 0 ? 'odd' : 'even'"
                    >
                      {{ item.content }}
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
            <div class="input-container">
              <div class="input">
                <el-input v-model="inputValue" placeholder="请输入消息" />
              </div>
              <div class="btn">
                <div class="txt">发送</div>
              </div>
            </div>
          </el-main>
          <el-aside class="main-aside-container">
            <div class="aside-figure">
              <div class="box">
                <img class="tags" :src="iconDataTag" />
                <div class="title">Kevin</div>
                <!-- <div class="desc">
                  专家简介：Kevin
                  多年从事人工智能、深度学习、大数据、区块链、云计算、物联网研发工作经验,资深软件架构师,数学博士,北航移动云计算硕士
                </div> -->
                <TextClamp
                  class="desc"
                  text="专家简介：Kevin
                  多年从事人工智能、深度学习、大数据、区块链、云计算、物联网研发工作经验，资深软件架构师，数学博士，北航移动云计算硕士"
                  :buttonType="'oneLine'"
                  :maxLines="2"
                >
                  <template #textExpandButton="props">
                    <!-- v-if="!props.isExpanded" -->
                    <div
                      :style="{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                      }"
                    >
                      <img
                        @click="props.toggle"
                        :src="iconArrowDown"
                        class="arrow-down"
                      />
                    </div>
                  </template>
                </TextClamp>
              </div>
            </div>
            <div class="aside-recommend-container">
              <img :src="iconRecommendTitle" class="recommend-title" />
              <el-scrollbar height="260px">
                <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
                  {{ item }}
                </p>
              </el-scrollbar>
              <el-icon class="arrow-down"><ArrowDown /></el-icon>
            </div>
          </el-aside>
        </el-container>
      </el-main>
    </el-container>
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
import iconDataTag from "@/assets/images/career-data-tag.png";
import iconArrowDown from "@/assets/images/career-arrow-down.png";
import iconRecommendTitle from "@/assets/images/career-recommend-title.png";
import iconLindaAvatar from "@/assets/images/career-linda-avatar.png";
import iconUserAvatar from "@/assets/images/career-user-avatar.png";
import { ArrowLeft, ArrowDown } from "@element-plus/icons-vue";
const inputValue = ref("");
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
type chatItem = {
  content: string;
  status: boolean;
};
const chatList = ref<Array<chatItem>>([]);
onMounted(() => {
  initGPT();
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
    padding: 0 20px;
    .top {
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .top-back {
        font-size: 2rem;
        color: #ffffff;
        cursor: pointer;
      }
      .title {
        font-size: 1.4rem;
        color: #ffffff;
      }
    }
    .main-container {
      padding: 0;
      display: flex;
      .main {
        padding: 0 20px 20px 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        .chat-container {
          background: rgba(55, 57, 56, 0.38);
          width: 100%;
          flex: 1;
          .chat-dialog {
            position: relative;
            height: 100%;
            overflow: hidden;

            .chat-list {
              display: flex;
              flex-direction: column;
              width: 90%;
              margin: 0 auto;
              padding: 20px 0;
              overflow: auto;

              .chat-ai {
                display: flex;
                margin-top: 1rem;
                &.user {
                  flex-direction: row-reverse;
                }

                .chat-layout {
                  max-width: 19rem;
                  padding: 0.6rem;
                  opacity: 0.8;
                  font-size: 0.9rem;
                  font-weight: 400;
                  color: #c5e7ff;
                  text-align: start;
                }

                .odd {
                  align-self: flex-start;
                  background: #435e6f;
                  border-radius: 0px 16px 16px 16px;
                }

                .even {
                  align-self: flex-end;
                  background: #31b8c8;
                  border-radius: 16px 0px 16px 16px;
                }

                img {
                  width: 64px;
                  height: 64px;
                }
              }

              > div:nth-of-type(odd) {
                align-self: flex-start;
              }

              > div:nth-of-type(even) {
                align-self: flex-end;
              }
            }
          }
        }
        .input-container {
          width: 100%;
          height: 56px;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: flex-start;
          margin-top: 20px;
          .input {
            flex: 1;
            height: 56px;
            background: rgba(55, 57, 56, 0.38);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            :deep(.el-input__wrapper) {
              background-color: transparent;
              box-shadow: none;
            }
            :deep(.el-input__inner) {
              color: #ffffff;
              font-size: 1.5rem;
              --el-input-placeholder-color: #565957;
            }
          }
          .btn {
            width: 88px;
            height: 56px;
            background: #1b1f23;
            opacity: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
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
      }
      .main-aside-container {
        width: 346px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        .aside-figure {
          width: 346px;
          height: 435px;
          position: relative;
          background-image: url("@/assets/images/career-kevin.png");
          background-repeat: no-repeat;
          background-size: contain;
          margin-bottom: 50px;
          .box {
            position: absolute;
            top: 319px;
            width: 246px;
            min-height: 92px;
            left: 50px;
            background: #212121;
            box-shadow: 5px 5px 10px 5px #241a0c;
            opacity: 0.89;
            border: 1px solid #b28850;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            .tags {
              position: absolute;
              top: 5px;
              left: 0px;
              width: 91px;
              height: 16px;
            }
            .title {
              font-size: 1.2rem;
              color: #ffffff;
              background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 1) 0%,
                rgba(246, 228, 183, 1) 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .desc {
              font-size: 0.8rem;
              color: #ffffff;
              max-width: 226px;
              margin-bottom: 10px;
              .arrow-down {
                width: 12px;
                height: 6px;
              }
            }
          }
        }
        .aside-recommend-container {
          background: #2c2d2c;
          width: 346px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 10px 0;
          .recommend-title {
            width: 206px;
            height: 39px;
            margin-bottom: 10px;
          }
          .arrow-down {
            color: #ffffff;
            font-size: 2rem;
          }
        }
      }
    }
  }
}
</style>
