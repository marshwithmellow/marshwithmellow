<template>
  <div class="container">
    <el-container class="body-container">
      <el-header class="top">
        <div class="top-header">
          <div class="title">YourCareer.Ai</div>
          <div class="wel">欢迎回来 {{ userInfo.name }}</div>
        </div>
        <img :src="banner" class="banner" @click="navChat" />
        <el-divider style="--el-border-color: #535353" />
      </el-header>
      <el-main class="main-container">
        <el-container>
          <el-aside class="main-aside-container">
            <div class="aside-part check">
              <img :src="iconHomeHouse" class="part-icon" />
              <div class="text">主页</div>
            </div>
            <div class="aside-part normal" @click="navChat">
              <img :src="iconChatLine" class="part-icon" />
              <div class="text">咨询</div>
            </div>
            <div
              class="aside-part normal"
              @click="ElMessage('暂未开放，敬请期待！')"
            >
              <img :src="iconUserPlus" class="part-icon" />
              <div class="text">社区</div>
            </div>
          </el-aside>
          <el-container>
            <el-header class="content-top">
              <div class="content-start-container">
                <div class="content-start-left" @click="navChat">
                  <div class="txt">立即获取你的专属Career.AI</div>
                </div>
                <div class="content-start-right" @click="navChat">
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
            <el-main style="padding: 10px 20px 0">
              <swiper
                :initialSlide="0"
                :loopedSlides="2"
                slidesPerView="auto"
                :spaceBetween="0"
                :scrollbar="false"
                :loop="false"
                class="expert-swiper"
              >
                <swiper-slide v-for="(item, index) in expertList" :key="index">
                  <div class="expert-container" @click="navChat">
                    <img :src="item.headImg" class="avatar" />
                    <div class="name">{{ item.name }}</div>
                    <el-tooltip
                      placement="left"
                      :disabled="
                        item.desc && item.desc.length > 32 ? false : true
                      "
                    >
                      <template #content>{{ item.desc }}</template>
                      <div class="desc">{{ item.desc }}</div>
                    </el-tooltip>
                  </div>
                </swiper-slide>
              </swiper>
            </el-main>
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
import avatarLina from "@/assets/images/career-linda-avatar2.png";
import avatarExpert from "@/assets/images/career-expert-avatar.png";
import avatarJoo from "@/assets/images/career-joo-avatar.png";
import avatarGame from "@/assets/images/career-game-avatar.png";
import { useRouter } from "vue-router";
import { House, ChatLineSquare, User } from "@element-plus/icons-vue";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import { doGetInfo } from "@/api/index";
const $router = useRouter();
const currentTags = ref(0);
const tagsList = ref<Array<string>>([
  "互联网",
  "大数据",
  "元宇宙",
  "游戏",
  "重工机械",
  "服装纺织",
]);
type expertItem = {
  headImg: string;
  name: string;
  desc: string;
  tag: number;
};
const expertList = ref<Array<expertItem>>([
  {
    headImg: avatarLina,
    name: "Lee.AI",
    desc: "大数据行业领军者，精通实时和理线大数据处理业务，大数据行业领军者，精通实时和理线大数据处理业务",
    tag: 0,
  },
  {
    headImg: avatarExpert,
    name: "张琦.AI",
    desc: "新商业架构师，全域流量架构师，企业盈利模式增长专家，新商业架构师，全域流量架构师，企业盈利模式增长专",
    tag: 0,
  },
  {
    headImg: avatarJoo,
    name: "Joo.AI",
    desc: "大数据行业咨询，全球高级顾问，职业规划专家",
    tag: 0,
  },
  {
    headImg: avatarGame,
    name: "Game.AI",
    desc: "了解自己的性格，如何和他人相处",
    tag: 0,
  },
]);
const userInfo = ref({
  mobile: "",
  id: "",
  name: "",
  remainAmount: 0,
  requestCount: 0,
  token: "",
  createTime: "",
  inviteCode: "",
  isAuth: 0,
  accountType: 1,
  accessKey: "",
});
onBeforeMount(() => {
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
  } else {
    $router.replace({
      name: "singleLogin",
      query: {
        redirectUrl: window.location.href,
      },
    });
  }
});
//请求接口获取用户信息
const getUserInfo = async (token: string, accessKey: string) => {
  const res = await doGetInfo({ token, accessKey });
  if (res.data.code === 11000) {
    userInfo.value = res.data.data;
  } else if (res.data.code === 12004) {
    localStorage.removeItem("userInfo");
    $router.replace({
      name: "singleLogin",
      query: {
        redirectUrl: window.location.href,
      },
    });
  }
};
const navChat = () => {
  $router.push({ name: "careerChat" });
};
</script>
<style lang="scss" scoped>
.container {
  min-height: 100vh;
  min-width: 100vw;
  background: #484848;
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
        cursor: pointer;
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
    .expert-container {
      width: 220px;
      height: 316px;
      background: #373938;
      border-radius: 10px;
      opacity: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      position: relative;
      &:hover {
        background: rgba(27, 31, 35, 0.5);
      }
      &:active {
        background: #1b1f23;
      }
      .avatar {
        margin-top: 20px;
        width: 140px;
        height: 140px;
      }
      .name {
        margin-top: 14px;
        font-size: 1.2rem;
        color: #ffffff;
      }
      .desc {
        margin-top: 14px;
        font-size: 1rem;
        color: #cdcdcd;
        max-width: 188px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis; /* 超出部分省略号 */
        word-break: break-all; /* 设置省略字母数字 */
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3; /* 显示的行数 */
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
  .expert-swiper {
    margin-left: 0;
    margin-right: 0;
    :deep(.swiper-slide) {
      width: 230px !important;
      height: 316px !important;
      display: flex;
      justify-items: flex-start;
      align-items: flex-start;
    }
  }
}

:global(.el-popper) {
  width: 188px;
}
</style>
