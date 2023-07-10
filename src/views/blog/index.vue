<template>
  <div class="px-common-layout px-no-trans">
    <div v-if="!agent">
      <el-container>
        <el-aside class="aside">
          <div class="flex" @click="navHome">
            <img
              class="logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
              alt=""
            />
          </div>
        </el-aside>
        <el-container>
          <el-header class="header">
            <div
              style="
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div class="title">
                {{
                  blogType == "3"
                    ? "企业级 OpenAI 服务是什么意思"
                    : blogType == "2"
                    ? "MBM OpenAI 服务如何计费"
                    : "探索与 OpenAI 的区别"
                }}
              </div>
              <div class="buttons" v-if="!userInfo.name" @click="toLogin">
                <!-- 现在领取 1 美元体验金！ -->
                现在开启你的 AI 时刻！
              </div>
              <div
                class="buttons"
                v-if="userInfo.name"
                @click="skip('https://mchat.mbmzone.com/', true)"
              >
                和我的 ChatGPT 聊天
              </div>
            </div>
            <div
              class="desc"
              @click="
                blogType = blogType == '3' ? '1' : blogType == '2' ? '3' : '2'
              "
            >
              {{
                blogType == "3"
                  ? "探索与 OpenAI 的区别"
                  : blogType == "2"
                  ? "企业级 OpenAI 服务是什么意思"
                  : "MBM OpenAI 服务如何计费"
              }}
              <el-icon><TopRight /></el-icon>
            </div>
            <div
              class="desc"
              @click="
                blogType = blogType == '3' ? '2' : blogType == '2' ? '1' : '3'
              "
            >
              {{
                blogType == "3"
                  ? "MBM OpenAI 服务如何计费"
                  : blogType == "2"
                  ? "探索与 OpenAI 的区别"
                  : "企业级 OpenAI 服务是什么意思"
              }}
              <el-icon><TopRight /></el-icon>
            </div>
          </el-header>
          <el-main class="main">
            <el-row :gutter="14">
              <el-col :span="12">
                <div class="content">
                  {{
                    blogType == "3"
                      ? "MBM 企业级的 OpenAI 服务，将大型语言模型和生成 AI 应用于你企业的生产环节变得轻而易举。调用我们为你准备独有 API Key，就意味着你同时拥有安全、专业和可靠。"
                      : blogType == "2"
                      ? "我们仅按您使用的内容收取费用，计费标准取决于你调用了哪种模型。右表是个人用户调用模型的详细价格。通常来说，每 1K tokens 可以写出 555 个汉字或 750 字英文。"
                      : "作为 Azure OpenAI 中国合作伙伴，MBM 为 企业用户和个人消费者在中国提供可靠、企业级 OpenAI 服务，实现快速访问，无需代理的先进体验。"
                  }}
                </div>
              </el-col>
              <el-col :span="12">
                <el-row :gutter="0">
                  <el-col :span="8"></el-col>
                  <el-col :span="8">
                    <div class="right-1">
                      {{
                        blogType == "3"
                          ? "企业级 MBM OpenAI"
                          : blogType == "2"
                          ? "Input输入"
                          : "MBM OpenAI"
                      }}
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="right-1">
                      {{
                        blogType == "3"
                          ? "个人版"
                          : blogType == "2"
                          ? "Output输出"
                          : "OpenAI"
                      }}
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :span="8" style="background: #ffffff">
                    <div class="left">
                      {{
                        blogType == "3"
                          ? "价格"
                          : blogType == "2"
                          ? "GPT4-8K"
                          : "访问"
                      }}
                    </div>
                  </el-col>
                  <el-col
                    :span="8"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">
                      {{
                        blogType == "3"
                          ? "比个人版更低的调用价格"
                          : blogType == "2"
                          ? "0.06美金 / 1K tokens"
                          : "直连访问，允许商业化"
                      }}
                    </div>
                  </el-col>
                  <el-col
                    :span="8"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">
                      {{
                        blogType == "3"
                          ? "标准计费"
                          : blogType == "2"
                          ? "0.12美金 / 1K tokens"
                          : "限制访问"
                      }}
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col
                    :span="8"
                    style="background: #ffffff; border-top: 1px solid #000000"
                  >
                    <div class="left">
                      {{
                        blogType == "3"
                          ? "调用次数"
                          : blogType == "2"
                          ? "GPT4-32K"
                          : "安全审查"
                      }}
                    </div>
                  </el-col>
                  <el-col
                    :span="8"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">
                      {{
                        blogType == "3"
                          ? "确保 162 RPM GPT4 访问请求"
                          : blogType == "2"
                          ? "0.12美金 / 1K tokens"
                          : "Azure 双重审查、敏感词过滤"
                      }}
                    </div>
                  </el-col>
                  <el-col
                    :span="8"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">
                      {{
                        blogType == "3"
                          ? "默认配置"
                          : blogType == "2"
                          ? "0.24美金 / 1K tokens"
                          : "默认审查"
                      }}
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col
                    :span="8"
                    style="background: #ffffff; border-top: 1px solid #000000"
                  >
                    <div class="left">
                      {{
                        blogType == "3"
                          ? "部署服务"
                          : blogType == "2"
                          ? "GPT-3.5-Turbo"
                          : "可靠性"
                      }}
                    </div>
                  </el-col>
                  <!-- <el-col
                    :span="16"
                    v-if="blogType == '2'"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                      border-bottom: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">0.004美金 / 1K tokens</div>
                  </el-col> -->
                  <el-col
                    :span="8"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                      border-bottom: 1px solid #ffffff;
                    "
                    v-if="blogType == '2'"
                  >
                    <div class="right-2">0.003美金 / 1K tokens</div>
                  </el-col>
                  <el-col
                    :span="8"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                      border-bottom: 1px solid #ffffff;
                    "
                    v-if="blogType == '2'"
                  >
                    <div class="right-2">0.004美金 / 1K tokens</div>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="blogType != '2'"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                      border-bottom: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">
                      {{
                        blogType == "3"
                          ? "为你的企业量身定制 GPT 服务"
                          : "满足企业级并发的调用需求"
                      }}
                    </div>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="blogType != '2'"
                    style="
                      border-top: 1px solid #ffffff;
                      border-right: 1px solid #ffffff;
                      border-bottom: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">
                      {{ blogType == "3" ? "自己部署" : "限制调用频次" }}
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="0" v-if="blogType == '2'">
                  <el-col
                    :span="8"
                    style="background: #ffffff; border-top: 1px solid #000000"
                  >
                    <div class="left">GPT-3.5-Turbo-16K</div>
                  </el-col>
                  <el-col
                    :span="8"
                    style="
                      border-right: 1px solid #ffffff;
                      border-bottom: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">0.006美金 / 1K tokens</div>
                  </el-col>
                  <el-col
                    :span="8"
                    style="
                      border-right: 1px solid #ffffff;
                      border-bottom: 1px solid #ffffff;
                    "
                  >
                    <div class="right-2">0.008美金 / 1K tokens</div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div
              class="other"
              :style="{
                background: `url(${
                  blogType == '3'
                    ? 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider3.png'
                    : blogType == '2'
                    ? 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider2.png'
                    : 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider1.png'
                }) center / auto 100% no-repeat`,
              }"
            ></div>
          </el-main>
        </el-container>
        <el-dialog
          v-model="showDialog"
          :close-on-click-modal="true"
          :close-on-press-escape="false"
          class="wrap-dialog"
          :show-close="false"
          title=""
        >
          <login-modal
            ref="login"
            :inviteCode="inviteCode"
            @show-message="showMessage"
            @complete="loginComplete"
          ></login-modal>
        </el-dialog>
      </el-container>
    </div>
    <div v-else>
      <el-container>
        <el-header class="toolbar">
          <div
            style="
              flex: 1;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            "
          >
            <img
              class="logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
              alt=""
            />
          </div>
        </el-header>
        <el-container>
          <el-header class="phone-header">
            <div>
              <div class="title">
                {{
                  blogType == "3"
                    ? "企业级 OpenAI 服务是什么意思"
                    : blogType == "2"
                    ? "MBM OpenAI 服务如何计费"
                    : "探索与 OpenAI 的区别"
                }}
              </div>
              <div
                class="desc"
                @click="
                  blogType = blogType == '3' ? '1' : blogType == '2' ? '3' : '2'
                "
              >
                {{
                  blogType == "3"
                    ? "探索与 OpenAI 的区别"
                    : blogType == "2"
                    ? "企业级 OpenAI 服务是什么意思"
                    : "MBM OpenAI 服务如何计费"
                }}
                <el-icon><TopRight /></el-icon>
              </div>
              <div
                class="desc"
                @click="
                  blogType = blogType == '3' ? '2' : blogType == '2' ? '1' : '3'
                "
              >
                {{
                  blogType == "3"
                    ? "MBM OpenAI 服务如何计费"
                    : blogType == "2"
                    ? "探索与 OpenAI 的区别"
                    : "企业级 OpenAI 服务是什么意思"
                }}
                <el-icon><TopRight /></el-icon>
              </div>
            </div>
            <div class="buttons" v-if="!userInfo.name" @click="toLogin">
              <!-- 现在领取 1 美元体验金！ -->
              现在开启你的 AI 时刻！
            </div>
            <div
              class="buttons"
              v-if="userInfo.name"
              @click="skip('https://mchat.mbmzone.com/', true)"
            >
              和我的 ChatGPT 聊天
            </div>
          </el-header>
          <el-main class="phone-main">
            <div class="content">
              {{
                blogType == "3"
                  ? "MBM 企业级的 OpenAI 服务，将大型语言模型和生成 AI 应用于你企业的生产环节变得轻而易举。调用我们为你准备独有 API Key，就意味着你同时拥有安全、专业和可靠。"
                  : blogType == "2"
                  ? "我们仅按您使用的内容收取费用，计费标准取决于你调用了哪种模型。右表是个人用户调用模型的详细价格。通常来说，每 1K tokens 可以写出555个汉字或750字英文。"
                  : "作为 Azure OpenAI 中国合作伙伴，MBM 为 企业用户和个人消费者在中国提供可靠、企业级 OpenAI 服务，实现快速访问，无需代理的先进体验。"
              }}
            </div>
            <el-row :gutter="0">
              <el-col :span="8"></el-col>
              <el-col :span="8">
                <div class="right-1">
                  {{
                    blogType == "3"
                      ? "企业级 MBM OpenAI"
                      : blogType == "2"
                      ? "Prompt提示"
                      : "MBM OpenAI"
                  }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="right-1">
                  {{
                    blogType == "3"
                      ? "个人版"
                      : blogType == "2"
                      ? "Completion完成"
                      : "OpenAI"
                  }}
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :span="8" style="background: #ffffff">
                <div class="left">
                  {{
                    blogType == "3"
                      ? "价格"
                      : blogType == "2"
                      ? "GPT4-8K"
                      : "访问"
                  }}
                </div>
              </el-col>
              <el-col
                :span="8"
                style="
                  border-top: 1px solid #ffffff;
                  border-right: 1px solid #ffffff;
                "
              >
                <div class="right-2">
                  {{
                    blogType == "3"
                      ? "比个人版更低的调用价格"
                      : blogType == "2"
                      ? "0.06美金 / 1K tokens"
                      : "直连访问，允许商业化"
                  }}
                </div>
              </el-col>
              <el-col
                :span="8"
                style="
                  border-top: 1px solid #ffffff;
                  border-right: 1px solid #ffffff;
                "
              >
                <div class="right-2">
                  {{
                    blogType == "3"
                      ? "标准计费"
                      : blogType == "2"
                      ? "0.12美金 / 1K tokens"
                      : "限制访问"
                  }}
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col
                :span="8"
                style="background: #ffffff; border-top: 1px solid #000000"
              >
                <div class="left">
                  {{
                    blogType == "3"
                      ? "调用次数"
                      : blogType == "2"
                      ? "GPT4-32K"
                      : "安全审查"
                  }}
                </div>
              </el-col>
              <el-col
                :span="8"
                style="
                  border-top: 1px solid #ffffff;
                  border-right: 1px solid #ffffff;
                "
              >
                <div class="right-2">
                  {{
                    blogType == "3"
                      ? "确保 162 RPM GPT4 访问请求"
                      : blogType == "2"
                      ? "0.12美金 / 1K tokens"
                      : "Azure 双重审查、敏感词过滤"
                  }}
                </div>
              </el-col>
              <el-col
                :span="8"
                style="
                  border-top: 1px solid #ffffff;
                  border-right: 1px solid #ffffff;
                "
              >
                <div class="right-2">
                  {{
                    blogType == "3"
                      ? "默认配置"
                      : blogType == "2"
                      ? "0.24美金 / 1K tokens"
                      : "默认审查"
                  }}
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col
                :span="8"
                style="background: #ffffff; border-top: 1px solid #000000"
              >
                <div class="left">
                  {{
                    blogType == "3"
                      ? "部署服务"
                      : blogType == "2"
                      ? "GPT-3.5-Turbo"
                      : "可靠性"
                  }}
                </div>
              </el-col>
              <el-col
                :span="16"
                v-if="blogType == '2'"
                style="
                  border-top: 1px solid #ffffff;
                  border-right: 1px solid #ffffff;
                  border-bottom: 1px solid #ffffff;
                "
              >
                <div class="right-2">0.004美金 / 1K tokens</div>
              </el-col>
              <el-col
                :span="8"
                v-if="blogType != '2'"
                style="
                  border-top: 1px solid #ffffff;
                  border-right: 1px solid #ffffff;
                  border-bottom: 1px solid #ffffff;
                "
              >
                <div class="right-2">
                  {{
                    blogType == "3"
                      ? "为你的企业量身定制 GPT 服务"
                      : "满足企业级并发的调用需求"
                  }}
                </div>
              </el-col>
              <el-col
                :span="8"
                v-if="blogType != '2'"
                style="
                  border-top: 1px solid #ffffff;
                  border-right: 1px solid #ffffff;
                  border-bottom: 1px solid #ffffff;
                "
              >
                <div class="right-2">
                  {{ blogType == "3" ? "自己部署" : "限制调用频次" }}
                </div>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, nextTick, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { pinyin } from "pinyin-pro";
import { TopRight } from "@element-plus/icons-vue";
import LoginModal from "@/components/LoginModal.vue";
import { doGetInfo } from "@/api/index";
import { httpUrlAddKey } from "@/utils/utils";
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
const blogType = ref<any>("1");
const $router = useRouter();
const showDialog = ref(false);
const proxy: any = getCurrentInstance()?.proxy ?? null;
const userInfo = ref({
  mobile: "",
  id: "",
  name: "",
  remainAmount: 0,
  requestCount: 0,
  token: "",
  createTime: "",
  inviteCode: "",
});
const nickname = ref("");
const inviteCode = ref<any>("");
onBeforeMount(() => {
  if ($router.currentRoute.value.query.blogType) {
    blogType.value = $router.currentRoute.value.query.blogType;
  }
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
  }
  if ($router.currentRoute.value.query.inviteCode) {
    inviteCode.value = $router.currentRoute.value.query.inviteCode;
  }
});
//请求接口获取用户信息
const getUserInfo = async (token: string, accessKey: string) => {
  const res = await doGetInfo({ token, accessKey });
  if (res.data.code === 11000) {
    userInfo.value = res.data.data;
    const firstC = getFirstChar(userInfo.value.name);
    nickname.value = firstC;
  } else if (res.data.code === 12004) {
    localStorage.removeItem("userInfo");
    userInfo.value = {
      mobile: "",
      id: "",
      name: "",
      remainAmount: 0,
      requestCount: 0,
      token: "",
      createTime: "",
      inviteCode: "",
    };
    nickname.value = "";
  }
};
// 显示登录选项
const toLogin = () => {
  let usr = localStorage.getItem("userInfo");
  if (!usr) {
    if (!agent.value) {
      nextTick(() => {
        showDialog.value = true;
      });
    } else {
      $router.replace({
        name: "singleLogin",
        query: {
          redirectUrl: "https://openai.mbmzone.com",
        },
      });
    }
  }
};
// 处理首字母nickname
const getFirstChar = (str: string) => {
  let firstChar = str.slice(0, 1);
  // 首字母是英文
  let reg = /^[a-zA-Z]/;
  if (reg.test(str)) {
    return firstChar.toUpperCase();
  } else {
    const s = pinyin(firstChar, { pattern: "first" });
    return s.toUpperCase();
  }
};
const navHome = () => {
  $router.back();
};
const skip = (url: string, openNew: boolean) => {
  let usr: any = localStorage.getItem("userInfo");
  let urlString = url;
  if (usr) {
    usr = JSON.parse(usr);
    urlString = httpUrlAddKey(url, "token", usr.token);
  }
  if (openNew) {
    window.open(urlString);
  } else {
    window.location.href = urlString;
  }
};
const showMessage = (params: any) => {
  ElMessage(params);
};
const loginComplete = (data: any) => {
  if (data) {
    showDialog.value = false;
    localStorage.setItem("userInfo", JSON.stringify(data));
    userInfo.value = data;
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setUserInfo(userInfo.value);
    }
    const firstC = getFirstChar(userInfo.value.name);
    nickname.value = firstC;
  }
};
</script>
<style lang="scss" scoped>
@mixin hover2Style {
  &:hover {
    color: #fff;
    .icon-ai {
      filter: brightness(0.9) !important;
      width: 1px;
    }
  }
  &:active {
    color: rgba(255, 255, 255, 0.2);
  }
}
@mixin hover5Style {
  &:hover {
    color: #fff;
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
@mixin chargeHover5Style {
  &:hover {
    color: #fff;
    .my-count-hover {
      width: 100%;
      transition: all 0.3s;
    }
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}

.px-common-layout {
  // height: 100vh;
  //   min-width: 1200px;
  background: #000;
  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 100vw;
    padding: 0 20px;
    background: #000;
    .logo {
      //   height: 33px;
      height: 20px;
    }
  }
  .aside {
    width: 20vw;
    min-height: 100vh;
    min-width: 280px;
    // overflow: hidden;
    color: #fff;
    box-sizing: border-box;
    padding: 33px 2vw 33px 2vw;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    .flex {
      width: 100%;
    }
    .logo {
      //   height: 33px;
      // height: 5vh;
      width: 8.3vw;
    }
  }
  .header {
    height: 32vh;
    position: relative;
    padding: 3vh 3.3vw 3vh 0;
    .title {
      font-size: 2rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      opacity: 1;
    }
    .buttons {
      width: 18vw;
      height: 6vh;
      border: 1px solid #ffffff;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1) 0%,
        #4383ea 100%
      );
      opacity: 1;
      border-radius: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #ffffff;
      cursor: pointer;
      @include hover2Style;
    }
    .desc {
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #b3b3b3;
      text-decoration: underline;
      opacity: 1;
      margin-top: 10px;
      cursor: pointer;
      @include hover2Style;
    }
  }
  .phone-header {
    height: 32vh;
    min-height: 32vh;
    position: relative;
    padding: 0 32px 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 1.5rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      opacity: 1;
    }
    .buttons {
      margin-top: 10px;
      width: 258px;
      height: 52px;
      min-height: 52px;
      border: 1px solid #ffffff;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1) 0%,
        #4383ea 100%
      );
      opacity: 1;
      border-radius: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #ffffff;
    }
    .desc {
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #b3b3b3;
      text-decoration: underline;
      opacity: 1;
      margin-top: 10px;
      cursor: pointer;
      @include hover2Style;
    }
  }
  .main {
    height: 68vh;
    box-sizing: border-box;
    padding: 0 48px 0 0;
    .content {
      font-size: 18px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      line-height: 36px;
      color: #ffffff;
      opacity: 0.95;
      margin-top: 24px;
    }
    .right-1 {
      padding: 10px 9px;
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      line-height: 1rem;
      color: #ffffff;
      opacity: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .right-2 {
      height: 100%;
      padding: 10px 9px;
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      line-height: 1rem;
      color: #ffffff;
      opacity: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .left {
      height: 100%;
      padding: 10px 9px;
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      line-height: 1rem;
      color: #000000;
      opacity: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .other {
      margin-top: 34px;
      height: calc(68vh - 190px);
      width: 100%;
    }
  }
  .phone-main {
    padding: 0;
    height: calc(68vh - 60px);
    width: 100vw;
    box-sizing: border-box;
    padding: 20px 25px;
    .content {
      font-size: 22px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      line-height: 44px;
      color: #ffffff;
      opacity: 0.95;
    }
    .right-1 {
      height: 100%;
      padding: 10px 9px;
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      line-height: 1rem;
      color: #ffffff;
      opacity: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .right-2 {
      height: 100%;
      padding: 10px 9px;
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      line-height: 1rem;
      color: #ffffff;
      opacity: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .left {
      height: 100%;
      padding: 10px 9px;
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      line-height: 1rem;
      color: #000000;
      opacity: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .underline {
    font-size: 16px;
    font-family: FUTURA-MEDIUM;
    font-weight: bold;
    color: #07070d;
    text-decoration: underline;
  }
}

:deep(.phone-wrap-dialog) {
  width: 80vw;
  overflow: hidden;
  border-radius: 11px;
}
:deep(.wrap-dialog) {
  width: 588px;
  overflow: hidden;
  border-radius: 11px;
}
:deep(.el-dialog__header) {
  display: none;
}
:deep(.el-dialog__body) {
  width: auto;
  height: auto;
  padding: 0;
  border-radius: 11px;
  overflow: hidden;
}
:deep(.el-overlay) {
  background: rgba(0, 0, 0, 0.8);
}

:global(.el-popper) {
  background: #000 !important;
  //   border: 1px dashed rgba(255, 255, 255, 0.6) !important;
  margin-top: -14px;
  box-sizing: border-box;
  border-radius: 0 0 3px 3px;
  border: none;
}
:global(.el-select-dropdown__list) {
  width: 100%;
  border: 1px dashed rgba(255, 255, 255, 0.6) !important;
  border-top: none !important;
  margin: 0 !important;
}
:global(.el-select-dropdown) {
  background: #000 !important;
  border: none;
}
:global(.el-scrollbar) {
  background: #000 !important;
  border: none;
}
:global(.el-popper.is-light) {
  background: #000 !important;
  border: none;
}
:global(.el-popper__arrow) {
  display: none;
}

:v-deep(.select-down) {
  display: none;
}
.bg-block {
  background: #07070d;
}
:deep(.el-drawer__body) {
  flex: 1;
  padding: 0;
  overflow: auto;
}
</style>
