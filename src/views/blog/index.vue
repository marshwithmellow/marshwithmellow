<template>
  <div class="px-common-layout px-no-trans">
    <div v-if="!agent">
      <el-container>
        <el-aside class="aside">
          <div class="flex">
            <img class="logo" :src="logo" alt="" />
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
                现在领取 1 美元体验金！
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
                      ? "我们仅按您使用的内容收取费用，计费标准取决于你调用了哪种模型。右表是个人用户调用模型的详细价格。通常来说，每 1K tokens 可以写出555个汉字或750字英文。"
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
                          : "Azures双重审查、敏感词过滤"
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
              </el-col>
            </el-row>
            <div
              class="other"
              :style="{
                background: `url(${
                  blogType == '3'
                    ? swiper3
                    : blogType == '2'
                    ? swiper2
                    : swiper1
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
          <div class="dialog">
            <div class="type-word">
              <chat-gpt-typewriter
                exampleText="进入你的AI时刻"
              ></chat-gpt-typewriter>
              <div class="mask"></div>
            </div>
            <div class="avatar">M</div>
            <div v-if="status === 1" class="one-key" @click="status = 2">
              本机号码一键登录
            </div>
            <!-- 手机号 -->
            <div class="ipt-box" v-if="status === 2">
              <el-input
                type="tel"
                :maxlength="11"
                class="tel"
                v-model="tel"
                :autofocus="true"
                placeholder="xxxxxxxxxxx"
              />
              <div class="btm"></div>
              <div class="btm btm2"></div>
            </div>
            <!-- 验证码 -->
            <div class="square-box" v-if="status === 3">
              <!-- <el-input
                :maxlength="4"
                class="tel"
                v-model="sms"
                :autofocus="true"
                placeholder=""
                @input="inputCode"
              /> -->
              <div class="bb">
                <div class="square">
                  <el-input
                    type="tel"
                    ref="smsInput1"
                    :maxlength="1"
                    class="tel"
                    v-model="sms1"
                    :autofocus="true"
                    placeholder=""
                  />
                </div>
                <div class="square square2">
                  <el-input
                    type="tel"
                    ref="smsInput2"
                    :maxlength="1"
                    class="tel"
                    v-model="sms2"
                    :autofocus="true"
                    placeholder=""
                  />
                </div>
                <div class="square square3">
                  <el-input
                    type="tel"
                    ref="smsInput3"
                    :maxlength="1"
                    class="tel"
                    v-model="sms3"
                    :autofocus="true"
                    placeholder=""
                  />
                </div>
                <div class="square square4">
                  <el-input
                    type="tel"
                    ref="smsInput4"
                    :maxlength="1"
                    class="tel"
                    v-model="sms4"
                    :autofocus="true"
                    placeholder=""
                  />
                </div>
                <div class="square square7"></div>
              </div>
            </div>
            <!-- 昵称 -->
            <div class="nickname-box" v-if="status === 4">
              <el-input
                :maxlength="11"
                class="tel"
                v-model="nickname"
                :autofocus="true"
                placeholder="怎么称呼你？"
                @keyup.enter="inputNickname"
              />
              <div class="btm"></div>
            </div>
            <div
              class="resend"
              v-if="status === 3 || status === 2"
              @click="countDown"
            >
              重新发送
              <span class="countdown">({{ time }}s)</span>
            </div>
            <div class="tip" v-if="status !== 4 && status !== 3">
              <div class="point"><div class="in-circle"></div></div>
              首次登录将自动注册您的 MBM 账号
              <a class="underline">隐私政策</a>
            </div>
          </div>
        </el-dialog>
      </el-container>
    </div>
    <div v-else>
      <el-container>
        <el-dialog
          v-model="showDialog"
          :close-on-click-modal="true"
          :close-on-press-escape="false"
          class="phone-wrap-dialog"
          :show-close="false"
          title=""
        >
          <div class="phone-dialog">
            <div class="type-word">
              <chat-gpt-typewriter-small
                exampleText="进入你的AI时刻"
              ></chat-gpt-typewriter-small>
              <div class="mask"></div>
            </div>
            <div class="avatar">M</div>
            <div v-if="status === 1" class="one-key" @click="status = 2">
              本机号码一键登录
            </div>
            <!-- 手机号 -->
            <div class="ipt-box" v-if="status === 2">
              <el-input
                type="tel"
                :maxlength="11"
                class="tel"
                v-model="tel"
                :autofocus="true"
                placeholder="xxx xxxx  xxxx"
              />
              <div class="btm"></div>
              <div class="btm btm2"></div>
            </div>
            <!-- 验证码 -->
            <div class="square-box" v-if="status === 3">
              <el-input
                type="tel"
                :maxlength="4"
                class="tel"
                v-model="sms"
                :autofocus="true"
                placeholder=""
                @input="inputCode"
              />
              <div class="bb">
                <div class="square"></div>
                <div class="square square2"></div>
                <div class="square square3"></div>
                <div class="square square4"></div>
                <div class="square square7"></div>
              </div>
            </div>
            <!-- 昵称 -->
            <div class="nickname-box" v-if="status === 4">
              <el-input
                :maxlength="11"
                class="tel"
                v-model="nickname"
                :autofocus="true"
                placeholder="怎么称呼你？"
                @keyup.enter="inputNickname"
              />
              <div class="btm"></div>
            </div>
            <div class="resend" v-if="status === 3" @click="countDown">
              重新发送
              <span class="countdown">({{ time }}s)</span>
            </div>
            <div class="tip" v-if="status !== 4 && status !== 3">
              <div class="point"><div class="in-circle"></div></div>
              首次登录将自动注册您的 MBM 账号
              <a class="underline">隐私政策</a>
            </div>
          </div>
        </el-dialog>
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
            <img class="logo" :src="logo" alt="" />
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
              现在领取 1 美元体验金！
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
                      : "Azures双重审查、敏感词过滤"
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
import logo from "@/assets/images/logo.png";
import { ref, onBeforeMount, watch, nextTick, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import swiper1 from "@/assets/images/slider1.png";
import swiper2 from "@/assets/images/slider2.png";
import swiper3 from "@/assets/images/slider3.png";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { pinyin } from "pinyin-pro";
import { TopRight, Back } from "@element-plus/icons-vue";
import {
  checkPhone,
  doSendCode,
  doLoginApi,
  doRegisterCode,
  registerAccount,
  doGetInfo,
} from "@/api/index";
import ChatGptTypewriter from "@/components/ChatGptTypewriter.vue";
import ChatGptTypewriterSmall from "@/components/ChatGptTypewriterSmall.vue";
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
const blogType = ref<any>("1");
const $router = useRouter();
const showDialog = ref(false);
// 是否注册过
const isCreatedAccount = ref(false);
const status = ref(1);
const tel = ref("");
const sms = ref("");
const sms1 = ref("");
const sms2 = ref("");
const sms3 = ref("");
const sms4 = ref("");
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
const time = ref(60);
const loginFlag = ref(false);
onBeforeMount(() => {
  if ($router.currentRoute.value.query.blogType) {
    blogType.value = $router.currentRoute.value.query.blogType;
  }
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
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
    status.value = 1;
    tel.value = "";
  }
};
watch(
  () => sms1.value,
  async (newValue) => {
    sms.value = newValue + sms2.value + sms3.value + sms4.value;
    if (sms.value.length === 4) {
      inputCode(sms.value);
    } else {
      proxy?.$refs["smsInput2"].focus();
    }
  }
);
watch(
  () => sms2.value,
  async (newValue) => {
    sms.value = sms1.value + newValue + sms3.value + sms4.value;
    if (sms.value.length === 4) {
      inputCode(sms.value);
    } else {
      proxy?.$refs["smsInput3"].focus();
    }
  }
);
watch(
  () => sms3.value,
  async (newValue) => {
    sms.value = sms1.value + sms2.value + newValue + sms4.value;
    if (sms.value.length === 4) {
      inputCode(sms.value);
    } else {
      proxy?.$refs["smsInput4"].focus();
    }
  }
);
watch(
  () => sms4.value,
  async (newValue) => {
    sms.value = sms1.value + sms2.value + sms3.value + newValue;
    if (sms.value.length === 4) {
      inputCode(sms.value);
    }
  }
);
// 监听手机号
watch(
  () => tel.value,
  async (newValue, oldValue) => {
    tel.value =
      newValue.length > oldValue.length
        ? newValue.replace(/\s/g, "")
        : // .replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1 $2 $3")
          tel.value.trim();
    if (tel.value.length === 11) {
      let mobile = tel.value.replace(/\s/g, "");
      if (mobile && verifyPhone(mobile)) {
        if (loginFlag.value) return;
        loginFlag.value = true;
        const phoneRegister = await checkPhone({ phone: mobile });
        let codeRes = null;
        if (phoneRegister.data.data.register) {
          // 注册过。登陆验证码
          codeRes = await doSendCode({ phone: mobile });
          isCreatedAccount.value = true;
        } else {
          // 未注册过，注册验证码
          codeRes = await doRegisterCode({ phone: mobile });
        }
        if (codeRes.data.code === 11000) {
          ElMessage({ type: "success", message: "验证码已发送" });
          status.value = 3;
        } else {
          ElMessage({ type: "error", message: codeRes.data.msg });
        }
        loginFlag.value = false;
      } else ElMessage("请输入正确的手机号");
    }
  }
);
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
// sms countDown
const countDown = async () => {
  if (time.value < 60) return;
  if (tel.value.length === 11) {
    let phone = tel.value.replace(/\s/g, "");
    if (phone && verifyPhone(phone)) {
      let phone = tel.value.replace(/\s/g, "");
      const res = await doRegisterCode({ phone });
      if (res.data.code === 11000) {
        ElMessage({ type: "success", message: "验证码已发送" });
        const timer = setInterval(() => {
          time.value--;
          if (time.value <= 0) {
            time.value = 60;
            clearInterval(timer);
          }
        }, 1000);
        status.value = 3;
      } else {
        // 没有注册
        ElMessage({ type: "warning", message: res.data.msg });
      }
    } else {
      ElMessage({ type: "warning", message: "请输入正确的手机号码" });
    }
  }
};
// sms-code
const inputCode = async (code: string) => {
  if (code && code.length === 4 && !isNaN(parseInt(code))) {
    if (isCreatedAccount.value) {
      // 注册过账号。调登陆接口
      let phone = tel.value.replace(/\s/g, "");
      let query = { code: sms.value, phone };
      const res = await doLoginApi(query);
      if (res.data.code === 11000) {
        ElMessage({ type: "success", message: "手机号验证成功" });
        status.value = -1;
        showDialog.value = false;
        localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
        userInfo.value = res?.data?.data;
        const firstC = getFirstChar(userInfo.value.name);
        nickname.value = firstC;
      } else {
        ElMessage({ type: "error", message: res.data.msg });
      }
    } else {
      // 未注册过。
      setTimeout(() => {
        status.value = 4;
      }, 1000);
    }
  }
};
// Nickname
const inputNickname = async () => {
  if (!nickname.value) return ElMessage("请输入昵称");
  let phone = tel.value.replace(/\s/g, "");
  let query: any = { code: sms.value, name: nickname.value, phone };
  if ($router.currentRoute.value.query.inviteCode) {
    query.inviteCode = $router.currentRoute.value.query.inviteCode;
  }
  const res = await registerAccount(query);
  if (res.data.code === 11000) {
    ElMessage({ type: "success", message: "手机号验证成功" });
    status.value = -1;
    showDialog.value = false;
    localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
    userInfo.value = res?.data?.data;

    const firstC = getFirstChar(userInfo.value.name);
    nickname.value = firstC;
    console.log(
      nickname,
      nickname.value,
      firstC,
      userInfo.value.name,
      "11111111"
    );
  } else {
    ElMessage({ type: "error", message: res.data.msg });
  }
};
// verify input mobile
const verifyPhone = (phone: string | number) => {
  const reg =
    /^1((3[0-9])|(4[1579])|(5[0-9])|(6[6])|(7[0-9])|(8[0-9])|(9[0-9]))\d{8}$/;
  return reg.test(phone + "");
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
        23deg,
        rgba(0, 0, 0, 0.1) 0%,
        #4383ea 73%,
        #8748eb 100%
      );
      opacity: 1;
      border-radius: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      font-family: Gotham Rounded;
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
        23deg,
        rgba(0, 0, 0, 0.1) 0%,
        #4383ea 73%,
        #8748eb 100%
      );
      opacity: 1;
      border-radius: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      font-family: Gotham Rounded;
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
    font-family: Gotham-Rounded;
    font-weight: bold;
    color: #07070d;
    text-decoration: underline;
  }
}

.dialog {
  width: 588px;
  height: 477px;
  background: #ffffff;
  border: 1px solid #707070;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
  border-radius: 11px;
  overflow: hidden;
  .type-word {
    width: 100%;
    height: 243px;
    background: url("@/assets/images/type-word.png") center / cover no-repeat;
    border-radius: 11px 11px 0px 0px;
    padding: 118px 10px 65px 155px;
    box-sizing: border-box;
    .mask {
      width: 100%;
      height: 243px;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
  }

  .avatar {
    width: 77px;
    height: 77px;
    background: #818da3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
    border-radius: 50%;
    margin: 0 auto;
    position: absolute;
    top: 203px;
    left: 50%;
    transform: translateX(-38.5px);
    color: #fff;
    font-size: 28px;
    font-family: Gotham-Rounded;
    font-weight: bold;
    color: #ffffff;
  }
  .one-key {
    width: 285px;
    height: 64px;
    background: #ffffff;
    border: 1px solid #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 70px auto 30px;
    font-size: 24px;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
  }
  .ipt-box {
    position: relative;
    margin: 40px auto 30px;
    .tel {
      width: 320px;
      border: none;
      margin: 20px 132px 0;
      ::placeholder {
        letter-spacing: 9.6px;
      }
      :deep(.el-input__wrapper) {
        border-bottom: 1px solid #000;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        text-align: left;
        font-size: 26px;
        font-family: FZZCHJW;
        font-weight: 400;
        color: #000000;
        letter-spacing: 10px;
      }
    }
    .btm {
      height: 33px;
      width: 10px;
      background: #fff;
      position: absolute;
      top: 40px;
      left: 204px;
    }
    .btm2 {
      left: 318px;
    }
  }
  .square-box {
    position: relative;
    margin: 50px auto 19px;
    .tel {
      width: 100%;
      border: none;
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        position: relative;
        z-index: 3;
        background: none;
        // top: 45px;
      }
      :deep(.el-input__inner) {
        // padding: 0 22% 0 21%;
        font-size: 28px;
        font-family: FZZhengHeiS-B-GB;
        font-weight: 600;
        color: #000000;
        // letter-spacing: 80px;
        text-align: center;
        // overflow-x: hidden;
        // overflow: hidden;
      }
    }
    .bb {
      width: 430px;
      height: 64px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      left: 32px;
      .square {
        height: 64px;
        width: 47px;
        border: 1px solid #000000;
        display: flex;
        justify-content: center;
        align-items: center;
        // margin-right:3px;
      }
      //   .square2 {
      //     left: 140px;
      //   }
      //   .square3 {
      //     left: 210px;
      //   }
      //   .square4 {
      //     left: 280px;
      //   }
      .square7 {
        border: none;
        background: #fff;
        position: relative;
        z-index: 99;
      }
    }
  }
  .nickname-box {
    position: relative;
    .tel {
      width: 50%;
      border: none;
      margin: 80px 0 0;
      transform: translateX(50%);
      ::placeholder {
        font-size: 26px;
        font-family: FZZCHJW;
        font-weight: 400;
        line-height: 0px;
        color: #969393;
        letter-spacing: 3px;
      }
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        position: relative;
        z-index: 3;
        background: none;
        width: 100px;
      }
      :deep(.el-input__inner) {
        margin: 0 auto;
        font-size: 26px;
        font-family: FZZCHJW;
        letter-spacing: 5px;
        text-align: center;
        overflow-x: hidden;
        overflow: hidden;
        font-weight: 400;
        color: #000;
        border-bottom: 1px solid #000;
      }
    }
    .btm {
      height: 20px;
      width: 80px;
      margin: 20px auto 0;
      border-radius: 50%;
      background: url("@/assets/images/hudu.png") center / contain no-repeat;
    }
  }
  .resend {
    height: 30px;
    font-size: 18px;
    font-family: Gotham-Rounded;
    font-weight: 400;
    color: #000000;
    margin: 21px auto 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
    .countdown {
      margin-left: 5px;
      font-weight: 100;
      font-family: PingFangTC-Semibold;
    }
  }
  .tip {
    height: 30px;
    font-size: 12px;
    font-family: Gotham;
    font-weight: 400;
    color: #000000;
    margin: 21px auto 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .point {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background: #000;
      margin-right: 5px;
      padding: 1px;
      box-sizing: border-box;

      .in-circle {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background: #000;
        border: 1px solid #fff;
      }
    }
    a {
      font-size: 8px;
      cursor: pointer;
    }
  }
}

.phone-dialog {
  width: 80vw;
  height: 280px;
  background: #ffffff;
  border: 1px solid #707070;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
  border-radius: 11px;
  overflow: hidden;
  .type-word {
    width: 100%;
    height: 120px;
    background: url("@/assets/images/type-word.png") center / cover no-repeat;
    border-radius: 11px 11px 0px 0px;
    padding: 56px 10px 65px 90px;
    box-sizing: border-box;
    .mask {
      width: 100%;
      height: 120px;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: #818da3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
    border-radius: 50%;
    margin: 0 auto;
    position: absolute;
    top: 100px;
    left: 56%;
    transform: translateX(-38.5px);
    color: #fff;
    font-size: 20px;
    font-family: Gotham-Rounded;
    font-weight: bold;
    color: #ffffff;
  }
  .one-key {
    width: 60vw;
    height: 32px;
    background: #ffffff;
    border: 1px solid #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 40px auto 30px;
    font-size: 12px;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
  }
  .ipt-box {
    position: relative;
    margin: 10px auto 10px;
    .tel {
      width: calc(80vw - 104px);
      border: none;
      margin: 40px 52px 0;
      ::placeholder {
        letter-spacing: 5px;
      }
      :deep(.el-input__wrapper) {
        border-bottom: 1px solid #000;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        text-align: left;
        font-size: 14px;
        font-family: FZZCHJW;
        font-weight: 400;
        color: #000000;
        letter-spacing: 7.9px;
      }
    }
    .btm {
      height: 33px;
      width: 9px;
      background: #fff;
      position: absolute;
      top: 40px;
      left: 95px;
    }
    .btm2 {
      left: 167px;
    }
  }
  .square-box {
    position: relative;
    margin: 10px auto 10px;
    .tel {
      width: 80vw;
      border: none;
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        position: relative;
        z-index: 3;
        background: none;
        top: 30px;
      }
      :deep(.el-input__inner) {
        padding: 0 36px;
        font-size: 16px;
        font-family: FZZhengHeiS-B-GB;
        font-weight: 600;
        color: #000000;
        letter-spacing: 62px;
        text-align: left;
        overflow-x: hidden;
        overflow: hidden;
      }
    }
    .bb {
      // width: calc(80vw - 40px);
      height: 32px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      left: 30px;
      .square {
        height: 32px;
        width: 23px;
        border: 1px solid #000000;
        // margin-right:3px;
      }
      //   .square2 {
      //     left: 140px;
      //   }
      //   .square3 {
      //     left: 210px;
      //   }
      //   .square4 {
      //     left: 280px;
      //   }
      .square7 {
        border: none;
        background: #fff;
        position: relative;
        z-index: 99;
      }
    }
  }
  .nickname-box {
    position: relative;
    .tel {
      width: 50%;
      border: none;
      margin: 80px 0 0;
      transform: translateX(50%);
      ::placeholder {
        font-size: 26px;
        font-family: FZZCHJW;
        font-weight: 400;
        line-height: 0px;
        color: #969393;
        letter-spacing: 3px;
      }
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        position: relative;
        z-index: 3;
        background: none;
        width: 100px;
      }
      :deep(.el-input__inner) {
        margin: 0 auto;
        font-size: 26px;
        font-family: FZZCHJW;
        letter-spacing: 5px;
        text-align: center;
        overflow-x: hidden;
        overflow: hidden;
        font-weight: 400;
        color: #000;
        border-bottom: 1px solid #000;
      }
    }
    .btm {
      height: 20px;
      width: 80px;
      margin: 20px auto 0;
      border-radius: 50%;
      background: url("@/assets/images/hudu.png") center / contain no-repeat;
    }
  }
  .resend {
    height: 30px;
    font-size: 14px;
    font-family: Gotham-Rounded;
    font-weight: 400;
    color: #000000;
    margin: 21px auto 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
    .countdown {
      margin-left: 5px;
      font-weight: 100;
      font-family: PingFangTC-Semibold;
    }
  }
  .tip {
    height: 30px;
    font-size: 12px;
    font-family: Gotham;
    font-weight: 400;
    color: #000000;
    margin: 21px auto 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .point {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background: #000;
      margin-right: 5px;
      padding: 1px;
      box-sizing: border-box;

      .in-circle {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background: #000;
        border: 1px solid #fff;
      }
    }
    a {
      font-size: 8px;
      cursor: pointer;
    }
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
.options {
  width: 100%;
  font-size: 1rem;
  font-family: Gotham-Rounded;
  font-weight: bold;
  color: #ffffff;
  background: #000 !important;
  padding: 0 7px;
  &:hover {
    background: #1b1c21 !important;
  }
}
.phone-options {
  width: 100%;
  font-size: 16px;
  font-family: Gotham-Rounded;
  font-weight: bold;
  color: #ffffff;
  background: #000 !important;
  padding: 0 7px;
  &:hover {
    background: #1b1c21 !important;
  }
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
