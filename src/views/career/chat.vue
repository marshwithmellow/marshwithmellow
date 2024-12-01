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
                <el-scrollbar
                  ref="scrollbarRef"
                  class="chat-list"
                  :height="710"
                  @scroll="chatScroll"
                  view-class="chat-wrap"
                >
                  <div
                    class="chat-ai"
                    :class="item.status == 0 ? '' : 'user'"
                    v-for="(item, index) in chatList"
                    :key="index"
                  >
                    <img
                      :src="item.status == 0 ? iconLindaAvatar : iconUserAvatar"
                      alt=""
                      :style="{
                        margin: item.status == 0 ? '0 10px 0 0' : '0 0 0 10px',
                      }"
                    />
                    <div
                      class="chat-layout"
                      :class="item.status == 0 ? 'odd' : 'even'"
                    >
                      <span
                        v-if="item.loading"
                        class="ant-spin-dot ant-spin-dot-spin"
                      >
                        <i></i><i></i><i></i><i></i>
                      </span>
                      <div v-html="item.content"></div>
                      <el-upload
                        ref="upload"
                        :limit="1"
                        :auto-upload="true"
                        :http-request="uploadFile"
                        :on-success="uploadFileSuccess"
                        v-if="item.done == 1 && item.upload == 1"
                        accept=".pdf"
                        :before-upload="beforeUpload"
                      >
                        <template #trigger>
                          <el-button text style="color: #6c86e2">
                            点击上传个人简历
                          </el-button>
                        </template>
                      </el-upload>
                      <div
                        style="
                          display: block;
                          justify-content: center;
                          align-items: center;
                          cursor: pointer;
                          outline: 0;
                        "
                        v-if="item.done == 1 && item.upload == 2"
                        @click="actionMakeResumePosition"
                      >
                        <el-button text style="color: #6c86e2">
                          推荐职位
                        </el-button>
                      </div>
                    </div>
                  </div>
                  <div class="upload-loading-container" v-if="uploadLoading">
                    <span class="upload-spin-dot upload-spin-dot-spin">
                      <i></i><i></i><i></i><i></i>
                    </span>
                    <div class="txt">简历解析中...</div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
            <div class="input-container">
              <div class="input">
                <el-input
                  v-model="inputValue"
                  placeholder="请输入消息"
                  @keyup.enter.native="actionMessage"
                />
              </div>
              <div class="btn" @click="actionMessage">
                <div class="txt">发送</div>
              </div>
            </div>
          </el-main>
          <el-aside class="main-aside-container">
            <div class="aside-figure">
              <div class="box">
                <img class="tags" :src="iconDataTag" />
                <div class="title">Kevin</div>
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
                <div
                  class="recommend-container"
                  v-for="(item, index) in expertList"
                  :key="index"
                >
                  <div class="recommend-avatar">
                    <img class="avatar" :src="item.headImg" />
                  </div>
                  <div class="recommend-main">
                    <div class="name">{{ item.name }}</div>
                    <div class="like-container">
                      <img :src="iconLikeStar" class="like" />
                      <div class="txt">{{ item.like }}</div>
                    </div>
                  </div>
                  <div class="recommend-right">
                    <div class="txt">高级规划师</div>
                    <div class="btn">
                      <div class="txt">咨询</div>
                    </div>
                  </div>
                </div>
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
  nextTick,
  onMounted,
} from "vue";
import { useRouter } from "vue-router";
import iconDataTag from "@/assets/images/career-data-tag.png";
import iconArrowDown from "@/assets/images/career-arrow-down.png";
import iconRecommendTitle from "@/assets/images/career-recommend-title.png";
import iconLindaAvatar from "@/assets/images/career-linda-avatar.png";
import iconUserAvatar from "@/assets/images/career-user-avatar.png";
import avatarLina from "@/assets/images/career-linda-avatar2.png";
import avatarExpert from "@/assets/images/career-expert-avatar.png";
import avatarJoo from "@/assets/images/career-joo-avatar.png";
import avatarGame from "@/assets/images/career-game-avatar.png";
import iconLikeStar from "@/assets/images/career-like-star.png";
import { ArrowLeft, ArrowDown } from "@element-plus/icons-vue";
import {
  doGetInfo,
  createChatResume,
  connectChatCompletions,
  uploadChatCompletions,
  getChatResume,
  getChatResumePosition,
} from "@/api/index";
import { ElMessage, type UploadRequestOptions } from "element-plus";
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
const $router = useRouter();
const showing = ref(false);
const channelId = ref("");
const inputValue = ref("");
const textCount = ref(0);
const timer = ref();
const proxy: any = getCurrentInstance()?.proxy ?? null;
type expertItem = {
  headImg: string;
  name: string;
  desc: string;
  like: number;
};
const expertList = ref<Array<expertItem>>([
  {
    headImg: avatarLina,
    name: "Lee.AI",
    desc: "大数据行业领军者，精通实时和理线大数据处理业务，大数据行业领军者，精通实时和理线大数据处理业务",
    like: Math.floor(Math.random() * 20000),
  },
  {
    headImg: avatarExpert,
    name: "张琦.AI",
    desc: "新商业架构师，全域流量架构师，企业盈利模式增长专家，新商业架构师，全域流量架构师，企业盈利模式增长专",
    like: Math.floor(Math.random() * 20000),
  },
  {
    headImg: avatarJoo,
    name: "Joo.AI",
    desc: "大数据行业咨询，全球高级顾问，职业规划专家",
    like: Math.floor(Math.random() * 20000),
  },
  {
    headImg: avatarGame,
    name: "Game.AI",
    desc: "了解自己的性格，如何和他人相处",
    like: Math.floor(Math.random() * 20000),
  },
]);
type chatItem = {
  content: string;
  status: number;
  upload: number;
  done: number;
  loading: boolean;
};
const chatList = ref<Array<chatItem>>([]);
const uploadLoading = ref(false);
const scrollLock = ref(false);
let scrollTopNum = 0;
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
onMounted(() => {
  if (proxy.$refs["scrollbarRef"]) {
    proxy.$refs["scrollbarRef"].handleScroll = () => {
      const wrap = proxy.$refs["scrollbarRef"].wrapRef;
      proxy.$refs["scrollbarRef"].moveY =
        (wrap.scrollTop * 100) / wrap.clientHeight;
      proxy.$refs["scrollbarRef"].moveX =
        (wrap.scrollLeft * 100) / wrap.clientWidth;
      const poor = wrap.scrollHeight - wrap.clientHeight;
      if (
        poor == parseInt(wrap.scrollTop) ||
        poor == Math.ceil(wrap.scrollTop) ||
        poor == Math.floor(wrap.scrollTop)
      ) {
        console.log("触底");
      }
    };
  }
});
//请求接口获取用户信息
const getUserInfo = async (token: string, accessKey: string) => {
  const res = await doGetInfo({ token, accessKey });
  if (res.data.code === 11000) {
    userInfo.value = res.data.data;
    createChatWindow(token, accessKey);
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
const createChatWindow = async (token: string, accessKey: string) => {
  const res = await createChatResume({ token, accessKey });
  if (res.data.code === 11000) {
    channelId.value = res.data.data;
    showing.value = true;
    chatList.value.push({
      content: "",
      status: 0,
      upload: 1,
      done: 0,
      loading: true,
    });
    getChatContent("请上传您的简历（PDF文档格式）", 0, 1);
  } else {
    ElMessage({ message: res.data.msg, type: "error" });
  }
};
// 逐字显示内容
const getChatContent = (text: string, status: number, upload: number) => {
  // chatList.value.push({ content: "", status, upload: 0, done: 0 });
  if (status == 0) {
    const regex = /<([^>]+)>/g;
    let matches = [...text.matchAll(regex)];
    timer.value = setInterval(() => {
      textCount.value++;
      if (textCount.value == text.length + 1) {
        textCount.value = 0;
        chatList.value.splice(
          chatList.value.length == 0 ? 0 : chatList.value.length - 1,
          1,
          {
            content: text,
            status,
            upload: text.indexOf("职位搜索") >= 0 ? 2 : upload,
            done: 1,
            loading: false,
          }
        );
        clearInterval(timer.value);
        showing.value = false;
        nextTick(() => {
          if (proxy.$refs["scrollbarRef"] && !scrollLock.value) {
            proxy.$refs["scrollbarRef"].setScrollTop(
              document.getElementsByClassName("chat-wrap")[0].clientHeight
            );
          }
        });
        return;
      }
      if (matches.length > 0) {
        let temp = -1;
        for (let i = 0; i < matches.length; i++) {
          if (textCount.value == matches[i].index) {
            temp = i;
          }
        }
        if (temp >= 0) {
          textCount.value = textCount.value + matches[temp][0].length;
        }
      }
      // 取字符串子串
      let nowStr = text.substring(0, textCount.value);
      chatList.value.splice(
        chatList.value.length == 0 ? 0 : chatList.value.length - 1,
        1,
        { content: nowStr, status, upload, done: 0, loading: false }
      );
      nextTick(() => {
        if (proxy.$refs["scrollbarRef"] && !scrollLock.value) {
          proxy.$refs["scrollbarRef"].setScrollTop(
            document.getElementsByClassName("chat-wrap")[0].clientHeight
          );
        }
      });
    }, 100);
  } else {
    chatList.value.splice(
      chatList.value.length == 0 ? 0 : chatList.value.length - 1,
      1,
      { content: text, status, upload, done: 1, loading: false }
    );
    nextTick(() => {
      if (proxy.$refs["scrollbarRef"] && !scrollLock.value) {
        proxy.$refs["scrollbarRef"].setScrollTop(
          document.getElementsByClassName("chat-wrap")[0].clientHeight
        );
      }
    });
    showing.value = false;
  }
};
const uploadFile = (options: UploadRequestOptions) => {
  let usr = localStorage.getItem("userInfo");
  let token = "";
  if (usr) {
    const info = JSON.parse(usr);
    token = info.token;
  }
  const data = new FormData();
  data.append("file", options.file);
  return uploadChatCompletions({
    token,
    accessKey: userInfo.value.accessKey,
    resumeId: channelId.value,
    formData: data,
  });
};
const uploadFileSuccess = async (response: any) => {
  uploadLoading.value = false;
  if (response.status != 200) {
    ElMessage({ message: "网络错误", type: "error" });
    return;
  }
  const resultData = response.data;
  if (resultData) {
    const nowStr = parseResultData(resultData);
    showing.value = true;
    chatList.value.push({
      content: "",
      status: 0,
      upload: 2,
      done: 0,
      loading: true,
    });
    getChatContent(nowStr, 0, 0);
  }
};
const actionMessage = () => {
  if (inputValue.value.length == 0) {
    ElMessage({ message: "请输入您想咨询的问题！" });
    return;
  }
  if (showing.value) {
    return;
  }
  if (scrollLock.value) {
    scrollLock.value = false;
  }
  chatList.value.push({
    content: "",
    status: 1,
    upload: 1,
    done: 0,
    loading: false,
  });
  getChatContent(inputValue.value, 1, 0);
  let usr = localStorage.getItem("userInfo");
  let token = "";
  if (usr) {
    const info = JSON.parse(usr);
    token = info.token;
  }
  showing.value = true;
  if (
    inputValue.value.indexOf("推荐职位") >= 0 ||
    inputValue.value.indexOf("推荐岗位") >= 0
  ) {
    actionMakeResumePosition();
  } else {
    chatList.value.push({
      content: "",
      status: 0,
      upload: 1,
      done: 0,
      loading: true,
    });
    actionChatCompletions(inputValue.value, token, userInfo.value.accessKey);
  }
  inputValue.value = "";
};
const actionChatCompletions = async (
  text: string,
  token: string,
  accessKey: string
) => {
  connectChatCompletions({
    token: token,
    accessKey: accessKey,
    resumeId: channelId.value,
    messages: [
      {
        content: text,
        role: "user",
      },
    ],
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.body;
    })
    .then((body) => {
      const reader = body?.getReader();
      return new ReadableStream({
        start(controller) {
          function push() {
            reader?.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
      });
    })
    .then((stream) => {
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      }).text();
    })
    .then((result) => {
      const nowStr = parseResultData(result);
      getChatContent(nowStr, 0, 0);
    })
    .catch(function (error) {
      console.log(error);
    });
};
const beforeUpload = () => {
  uploadLoading.value = true;
  return true;
};
const actionMakeResume = () => {
  let usr = localStorage.getItem("userInfo");
  let token = "";
  if (usr) {
    const info = JSON.parse(usr);
    token = info.token;
  }
  chatList.value.push({
    content: "",
    status: 0,
    upload: 1,
    done: 0,
    loading: true,
  });
  getChatResume({
    token: token,
    accessKey: userInfo.value.accessKey,
    resumeId: channelId.value,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.body;
    })
    .then((body) => {
      const reader = body?.getReader();
      return new ReadableStream({
        start(controller) {
          function push() {
            reader?.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
      });
    })
    .then((stream) => {
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      }).text();
    })
    .then((result) => {
      const nowStr = parseResultData(result);
      getChatContent(nowStr, 0, 0);
    })
    .catch(function (error) {
      console.log(error);
    });
};
const actionMakeResumePosition = () => {
  let usr = localStorage.getItem("userInfo");
  let token = "";
  if (usr) {
    const info = JSON.parse(usr);
    token = info.token;
  }
  chatList.value.push({
    content: "",
    status: 0,
    upload: 1,
    done: 0,
    loading: true,
  });
  getChatResumePosition({
    token: token,
    accessKey: userInfo.value.accessKey,
    resumeId: channelId.value,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.body;
    })
    .then((body) => {
      const reader = body?.getReader();
      return new ReadableStream({
        start(controller) {
          function push() {
            reader?.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
      });
    })
    .then((stream) => {
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      }).text();
    })
    .then((result) => {
      const nowStr = parseResultData(result);
      getChatContent(nowStr, 0, 0);
    })
    .catch(function (error) {
      console.log(error);
    });
};
// const parseResultData = (result: string) => {
//   if (!result) {
//     return "系统错误（请联系后台管理员）";
//   }
//   if (result.startsWith("{")) {
//     let str = "";
//     try {
//       const temp = JSON.parse(result);
//       str = temp.msg;
//     } catch (error) {
//       str = "系统错误（请联系后台管理员）";
//     }
//     return str;
//   }
//   const resultArrayStr = result.split("data: ");
//   let nowStr = "";
//   for (const i in resultArrayStr) {
//     if (resultArrayStr[i].length == 0) {
//       continue;
//     }
//     if (resultArrayStr[i] == "[DONE]") {
//       break;
//     }
//     try {
//       const resultObject = JSON.parse(resultArrayStr[i]);
//       if (resultObject.choices && resultObject.choices.length > 0) {
//         const choice = resultObject.choices[0];
//         if (choice.delta && choice.delta.hasOwnProperty("content")) {
//           nowStr += choice.delta.content;
//         }
//       }
//     } catch (error) {
//       console.log(error);
//       continue;
//     }
//   }
//   return nowStr;
// };
const parseResultData = (result: string) => {
  if (!result) {
    return "系统错误（请联系后台管理员）";
  }
  if (result.startsWith("{")) {
    let str = "";
    try {
      const temp = JSON.parse(result);
      str = temp.msg;
    } catch (error) {
      str = "系统错误（请联系后台管理员）";
    }
    return str;
  }
  const resultArrayStr = result.split("data: ");
  let nowStr = "";
  for (const i in resultArrayStr) {
    if (resultArrayStr[i].length == 0) {
      continue;
    }
    if (
      encodeURIComponent(resultArrayStr[i]).startsWith(
        encodeURIComponent("[DONE]")
      )
    ) {
      break;
    }
    try {
      const temp = resultArrayStr[i].substring(
        0,
        resultArrayStr[i].lastIndexOf("}") >= 0
          ? resultArrayStr[i].lastIndexOf("}") + 1
          : resultArrayStr[i].length - 1
      );
      const resultObject = JSON.parse(
        jsonStringConvert(
          temp.replace(/\n/g, "---n---").replace(/\r/g, "---r---")
        )
      );
      if (resultObject.choices && resultObject.choices.length > 0) {
        const choice = resultObject.choices[0];
        if (choice.delta && choice.delta.hasOwnProperty("content")) {
          nowStr += choice.delta.content
            .replaceAll("---n---", "\n")
            .replaceAll("---r---", "\r")
            .replaceAll("“", '"')
            .replaceAll("”", '"');
        }
      }
    } catch (error) {
      console.log(error);
      continue;
    }
  }
  return nowStr;
};
const jsonStringConvert = (s: string) => {
  let temp = Array.from(s);
  let n = temp.length;
  for (let i = 0; i < n; i++) {
    if (temp[i] === ":" && temp[i + 1] === '"') {
      for (let j = i + 2; j < n; j++) {
        if (temp[j] === '"') {
          if (temp[j + 1] !== "," && temp[j + 1] !== "}") {
            temp[j] = "”";
          } else if (temp[j + 1] === "," || temp[j + 1] === "}") {
            break;
          }
        }
      }
    }
  }
  return temp.join("");
};

const chatScroll = ({ scrollTop }: { scrollTop: number }) => {
  if (scrollLock.value) {
    scrollTopNum = scrollTop;
  } else {
    if (scrollTopNum < scrollTop) {
      scrollTopNum = scrollTop;
    } else {
      scrollLock.value = true;
      scrollTopNum = scrollTop;
    }
  }
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
              width: 100%;
              margin: 0 auto;
              padding: 20px;
              overflow: auto;
              .upload-loading-container {
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                padding: 10px 0;
                .txt {
                  margin-left: 20px;
                  font-size: 1rem;
                  color: #ffffff;
                }
              }

              .chat-ai {
                display: flex;
                margin-top: 1rem;
                width: 100%;
                &.user {
                  flex-direction: row-reverse;
                }

                .chat-layout {
                  max-width: 70%;
                  padding: 16px;
                  opacity: 0.8;
                  font-size: 0.9rem;
                  font-weight: 400;
                  color: #ffffff;
                  text-align: start;
                  white-space: pre-wrap;
                }

                .odd {
                  align-self: flex-start;
                  background: #343a4a;
                  border-radius: 0px 16px 16px 16px;
                }

                .even {
                  align-self: flex-end;
                  background: #1c437a;
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
          .recommend-container {
            width: 306px;
            height: 84px;
            border-bottom: #e5e5e5 solid 1px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 0 3px;
            .recommend-avatar {
              width: 64px;
              height: 64px;
              background: #b28850;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              .avatar {
                width: 60px;
                height: 60px;
              }
            }
            .recommend-main {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              margin-left: 15px;
              flex: 1;
              .name {
                font-size: 1rem;
                color: #ffffff;
              }
              .like-container {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                .like {
                  width: 12px;
                  height: 11px;
                }
                .txt {
                  font-size: 1rem;
                  color: #f29c9f;
                  margin-left: 5px;
                }
              }
            }
            .recommend-right {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              .txt {
                font-size: 1rem;
                color: #ffffff;
              }
              .btn {
                margin-top: 10px;
                width: 68px;
                height: 30px;
                background: #1b1f23;
                opacity: 1;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                &:hover {
                  background: rgba(27, 31, 35, 0.5);
                }
                &:active {
                  background: #000000;
                }
              }
            }
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

.upload-spin-dot,
.ant-spin-dot {
  position: relative;
  display: inline-block;
  font-size: 20px;
  width: 20px;
  height: 20px;
}
.upload-spin-dot-spin,
.ant-spin-dot-spin {
  transform: rotate(45deg);
  animation: antRotate 1.2s infinite linear;
}

.ant-spin-dot i {
  width: 9px;
  height: 9px;
  border-radius: 100%;
  background-color: #1890ff;
  transform: scale(0.75);
  display: block;
  position: absolute;
  opacity: 0.3;
  animation: antSpinMove 1s infinite linear alternate;
  transform-origin: 50% 50%;
  &:nth-child(1) {
    left: 0;
    top: 0;
  }
  &:nth-child(2) {
    right: 0;
    top: 0;
    animation-delay: 0.4s;
  }
  &:nth-child(3) {
    right: 0;
    bottom: 0;
    animation-delay: 0.8s;
  }
  &:nth-child(4) {
    left: 0;
    bottom: 0;
    animation-delay: 1.2s;
  }
}

.upload-spin-dot i {
  width: 9px;
  height: 9px;
  border-radius: 100%;
  background-color: #ffffff;
  transform: scale(0.75);
  display: block;
  position: absolute;
  opacity: 0.3;
  animation: antSpinMove 1s infinite linear alternate;
  transform-origin: 50% 50%;
  &:nth-child(1) {
    left: 0;
    top: 0;
  }
  &:nth-child(2) {
    right: 0;
    top: 0;
    animation-delay: 0.4s;
  }
  &:nth-child(3) {
    right: 0;
    bottom: 0;
    animation-delay: 0.8s;
  }
  &:nth-child(4) {
    left: 0;
    bottom: 0;
    animation-delay: 1.2s;
  }
}
@keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
@keyframes antRotate {
  to {
    transform: rotate(405deg);
  }
}
</style>
