<template>
  <div class="px-common-layout px-no-trans">
    <div v-if="!agent">
      <el-container>
        <el-aside class="aside">
          <div class="flex">
            <img
              class="logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
              alt=""
            />
            <button
              v-if="userInfo.name"
              class="button-style gpt-button"
              @click="skip('https://mchat.mbmzone.com/', true)"
            >
              和我的 ChatGPT 聊天
            </button>
            <button v-else class="button-style gpt-button" @click="toLogin">
              登录 MBM OpenAI 账号
            </button>
            <div class="default-model">
              <img
                class="icon-ai"
                src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai.png"
                alt=""
              />
              <div class="model-name active">默认模型</div>
              <el-select
                v-model="aiVersion"
                :fit-input-width="false"
                popper-class="select-down"
                :popper-append-to-body="false"
                class="ai-select"
                :class="{
                  w128:
                    aiVersion.value === 'GPT-4' ||
                    aiVersion.value === 'GPT-3.5',
                  w171: aiVersion.value === 'GPT-4 32K',
                }"
                :placeholder="options[0].label"
                size="small"
              >
                <el-option
                  class="options"
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="default-model" @click="skip('http://visus.ai/', true)">
              <img
                class="icon-ai"
                src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-self.png"
                alt=""
              />
              <div class="model-name">训练你自己的 ChatGPT</div>
            </div>
            <div class="default-model" @click="train('生成我的GPT4 API Key')">
              <img
                class="icon-ai"
                src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-key.png"
                alt=""
              />
              <div class="model-name">生成我的 GPT4 API Key</div>
            </div>
          </div>
          <div class="flex">
            <ul class="question-box">
              <li
                class="question"
                v-for="(item, index) in questionList"
                :key="index"
                @click="navQuestion(item.value)"
              >
                {{ item.label }}
              </li>
            </ul>
            <button
              v-if="userInfo.name"
              class="gpt-button color-button"
              @click="recharge"
            >
              充值我的账户
              <div class="my-count-hover"></div>
              <!-- <div class="block_hoverer"></div>
              <div class="block_hoverer"></div>
              <div class="block_hoverer"></div>
              <div class="block_hoverer"></div> -->
              <span class="light iconfont icon-shandian"></span>
            </button>
            <button v-else class="gpt-button color-button" @click="toLogin">
              <!-- 现在领取 1 美元体验金！ -->
              现在开启你的 AI 时刻！
              <div class="my-count-hover"></div>
              <!-- <div class="top"></div>
              <div class="left"></div>
              <div class="right"></div>
              <div class="bottom"></div> -->
              <!-- <div class="block_hoverer"></div>
              <div class="block_hoverer"></div>
              <div class="block_hoverer"></div>
              <div class="block_hoverer"></div> -->
            </button>
            <div v-if="userInfo.name" class="share-my-code">
              分享我的推荐码：
              <span class="code" @click="copy">
                {{ userInfo.inviteCode }}
              </span>
              <!-- <el-popover placement="right-end" :width="200" trigger="click">
                <template #reference>
                  <span class="code" @click="copy">
                    {{ userInfo.inviteCode }}
                  </span>
                </template>
                <div class="popover-container">
                  <div class="popover-top">
                    <img
                      v-if="qrCodeImgUrl"
                      class="qrCode"
                      :src="qrCodeImgUrl"
                      alt=""
                    />
                  </div>
                  <div class="popover-bottom"></div>
                </div>
              </el-popover> -->
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-header class="header">
            <el-carousel
              ref="slide"
              trigger="click"
              arrow="never"
              :autoplay="true"
              :interval="5000"
              class="swiper"
              @change="changeSwiper"
            >
              <el-carousel-item
                class="swipe"
                :style="{
                  background: `url(${item.bg}) center / 100% 100% no-repeat`,
                }"
                v-for="(item, index) in swiperList"
                :key="item.desc"
              >
                <div
                  class="title"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-1':
                      animate,
                  }"
                >
                  {{ item.title }}
                </div>
                <div
                  class="desc"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-2':
                      animate,
                  }"
                >
                  {{ item.desc }}
                </div>
                <button
                  class="open-ai"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-3':
                      animate,
                  }"
                  @click="navQuestion(index + 1 + '')"
                >
                  {{ item.button }}
                </button>
              </el-carousel-item>
            </el-carousel>
            <div
              v-if="userInfo.name"
              class="avatar"
              @click="
                updateUserInfo();
                showUserInfo = !showUserInfo;
              "
            >
              {{ nickname }}
            </div>
            <div
              v-if="userInfo.name"
              class="user-info"
              :class="{ 'show-user': showUserInfo }"
            >
              <p class="nickname">
                Hello,
                <span class="underline">{{ userInfo.name }}!</span>
              </p>
              <div class="info-item">
                <span class="label">手机号：</span>
                {{ userInfo.mobile }}
              </div>
              <div class="info-item">
                <span class="label">剩余金额：</span>
                {{ userInfo.remainAmount }}美元
              </div>
              <div class="info-item">
                <span class="label">请求次数：</span>
                {{ userInfo.requestCount }}次
              </div>
              <div class="info-item">
                <span class="label">推荐码：</span>
                <span class="code underline" @click="copy">
                  {{ userInfo.inviteCode }}
                </span>
              </div>
              <div class="info-item">
                <span class="label">AI时刻：</span>
                {{ userInfo.createTime }}
              </div>
              <div class="info-item">
                <span
                  class="label underline"
                  style="cursor: pointer"
                  @click="logout()"
                >
                  退出登录
                </span>
              </div>
            </div>
          </el-header>
          <el-main class="main">
            <h1 class="title">
              当下热门 AI 应用
              <span class="app-num">(6)</span>
            </h1>
            <collect-item :ai-version="aiVersion"></collect-item>
          </el-main>
        </el-container>
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
            <!-- <el-input
              type="tel"
              :maxlength="11"
              class="tel"
              v-model="tel"
              :autofocus="true"
              placeholder="xxxxxxxxxxx"
            />
            <div class="btm"></div>
            <div class="btm btm2"></div> -->
            <div class="tel-container" style="width: 66px">
              <el-input
                ref="telInput1"
                :maxlength="3"
                class="tel1"
                v-model="tel1"
                :autofocus="true"
                :placeholder="telholder1"
                @focus="telholder1 = ''"
                @blur="telholder1 = 'xxx'"
                @input="talInput($event, 0)"
              />
            </div>
            <div class="tel-container" style="width: 90px">
              <el-input
                ref="telInput2"
                :maxlength="4"
                class="tel2"
                v-model="tel2"
                :autofocus="false"
                :placeholder="telholder2"
                @focus="telholder2 = ''"
                @blur="telholder2 = 'xxxx'"
                @input="talInput($event, 1)"
                @keyup.delete.native="deleteTel(2)"
              />
            </div>
            <div class="tel-container" style="width: 90px">
              <el-input
                ref="telInput3"
                :maxlength="4"
                class="tel3"
                v-model="tel3"
                :autofocus="false"
                :placeholder="telholder3"
                @focus="telholder3 = ''"
                @blur="telholder3 = 'xxxx'"
                @input="talInput($event, 2)"
                @keyup.delete.native="deleteTel(3)"
              />
            </div>
            <!-- <div class="tel-big" :class="telFocus ? 'focus' : ''">
              <div class="tel-contain" :class="telFocus ? 'focus' : ''">
                <el-input
                  ref="telInput1"
                  :maxlength="13"
                  class="tel"
                  v-model="tel"
                  :placeholder="telholder"
                  @focus="
                    telFocus = true;
                    telholder = '';
                  "
                  @blur="
                    telFocus = false;
                    telholder = '请输入手机号码';
                  "
                />
              </div>
            </div> -->
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
              <!-- <div class="square square7"></div> -->
            </div>
          </div>
          <!-- 昵称 -->
          <div class="nickname-box" v-if="status === 4">
            <el-input
              :maxlength="13"
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
            :class="time < 60 ? 'disable' : ''"
            v-if="status === 3 || status === 2"
            @click="countDown"
          >
            {{ status === 2 ? "发送验证码" : "重新发送" }}
            <span class="countdown" v-if="time < 60"> ({{ time }}s) </span>
          </div>
          <div class="back" v-if="status === 3" @click="status = 2">
            <el-icon><Back /></el-icon>
            <div style="margin-left: 8px">返回</div>
          </div>
          <div class="tip" v-if="status !== 4 && status !== 3">
            <div class="point"><div class="in-circle"></div></div>
            首次登录将自动注册您的 MBM 账号
            <a class="underline">隐私政策</a>
          </div>
        </div>
      </el-dialog>
    </div>
    <div v-else>
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
          <div
            class="resend"
            :class="time < 60 ? 'disable' : ''"
            v-if="status === 3"
            @click="countDown"
          >
            {{ time < 60 ? "验证码已发送" : "重新发送" }}
            <span class="countdown">({{ time }}s)</span>
          </div>
          <div class="tip" v-if="status !== 4 && status !== 3">
            <div class="point"><div class="in-circle"></div></div>
            首次登录将自动注册您的 MBM 账号
            <a class="underline">隐私政策</a>
          </div>
        </div>
      </el-dialog>
      <el-container>
        <el-header class="toolbar">
          <img
            class="logo"
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/menu.png"
            @click="drawer = true"
          />
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
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png"
              alt=""
            />
          </div>
          <div
            v-if="userInfo.name"
            class="avatar"
            @click="
              updateUserInfo();
              showUserInfo = !showUserInfo;
            "
          >
            {{ nickname }}
          </div>
          <div v-else style="height: 32px; width: 32px"></div>
        </el-header>
        <el-container>
          <el-header class="phone-header">
            <el-carousel
              ref="slide"
              trigger="click"
              arrow="never"
              :autoplay="true"
              :interval="5000"
              class="swiper"
              @change="changeSwiper"
            >
              <el-carousel-item
                class="swipe"
                :style="{
                  background: `url(${item.bg}) center / auto 100% no-repeat`,
                }"
                v-for="(item, index) in swiperList"
                :key="item.desc"
              >
                <div
                  class="title"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-1':
                      animate,
                  }"
                >
                  {{ item.title }}
                </div>
                <div
                  class="desc"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-2':
                      animate,
                  }"
                >
                  {{ item.desc }}
                </div>
                <button
                  class="open-ai"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-3':
                      animate,
                  }"
                  @click="navQuestion(index + 1 + '')"
                >
                  {{ item.button }}
                </button>
              </el-carousel-item>
            </el-carousel>
            <div
              v-if="userInfo.name"
              class="user-info"
              :class="{ 'show-user': showUserInfo }"
            >
              <p class="nickname">
                Hello,
                <span class="underline">{{ userInfo.name }}!</span>
              </p>
              <div class="info-item">
                <span class="label">手机号：</span>
                {{ userInfo.mobile }}
              </div>
              <div class="info-item">
                <span class="label">剩余金额：</span>
                {{ userInfo.remainAmount }}美元
              </div>
              <div class="info-item">
                <span class="label">请求次数：</span>
                {{ userInfo.requestCount }}次
              </div>
              <div class="info-item">
                <span class="label">推荐码：</span>
                <span class="code underline" @click="copy">
                  {{ userInfo.inviteCode }}
                </span>
              </div>
              <div class="info-item">
                <span class="label">AI时刻：</span>
                {{ userInfo.createTime }}
              </div>
              <div class="info-item">
                <span
                  class="label underline"
                  style="cursor: pointer"
                  @click="logout()"
                >
                  退出登录
                </span>
              </div>
            </div>
          </el-header>
          <el-main class="phone-main">
            <!-- <h1 class="title">
            我收藏的应用
            <span class="app-num">(2)</span>
          </h1>
          <collect-item></collect-item> -->
            <h1 class="title">
              当下热门 AI 应用
              <span class="app-num">(6)</span>
            </h1>
            <collect-item-small :ai-version="aiVersion"></collect-item-small>
          </el-main>
        </el-container>
        <el-drawer
          v-model="drawer"
          direction="ltr"
          size="80%"
          :with-header="false"
        >
          <el-aside class="phone-aside">
            <div class="flex">
              <img
                class="logo"
                src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
                alt=""
              />
              <button
                v-if="userInfo.name"
                class="gpt-button"
                @click="
                  skip('https://mchat.mbmzone.com/', true);
                  drawer = false;
                "
              >
                和我的 ChatGPT 聊天
              </button>
              <button
                v-else
                class="gpt-button"
                @click="
                  toLogin();
                  drawer = false;
                "
              >
                登录 MBM OpenAI 账号
              </button>
              <div class="default-model">
                <img
                  class="icon-ai"
                  src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai.png"
                  alt=""
                />
                <div class="model-name active">默认模型</div>
                <el-select
                  v-model="aiVersion"
                  :fit-input-width="false"
                  popper-class="select-down"
                  :popper-append-to-body="false"
                  class="ai-select"
                  :class="{
                    w128:
                      aiVersion.value === 'GPT-4' ||
                      aiVersion.value === 'GPT-3.5',
                    w171: aiVersion.value === 'GPT-4 32K',
                  }"
                  :placeholder="options[0].label"
                  size="small"
                >
                  <el-option
                    class="phone-options"
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div
                class="default-model"
                @click="
                  skip('http://visus.ai/', true);
                  drawer = false;
                "
              >
                <img
                  class="icon-ai"
                  src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-self.png"
                  alt=""
                />
                <div class="model-name">训练你自己的 ChatGPT</div>
              </div>
              <div
                class="default-model"
                @click="
                  train('生成我的GPT4 API Key');
                  drawer = false;
                "
              >
                <img
                  class="icon-ai"
                  src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-key.png"
                  alt=""
                />
                <div class="model-name">生成我的 GPT4 API Key</div>
              </div>
            </div>
            <div class="flex">
              <ul class="question-box">
                <li
                  class="question"
                  v-for="(item, index) in questionList"
                  :key="index"
                  @click="
                    navQuestion(item.value);
                    drawer = false;
                  "
                >
                  {{ item.label }}
                </li>
              </ul>
              <button
                v-if="userInfo.name"
                class="gpt-button color-button"
                @click="
                  recharge();
                  drawer = false;
                "
              >
                充值我的账户
                <div class="my-count-hover"></div>
                <span class="light iconfont icon-shandian"></span>
              </button>
              <button
                v-else
                class="gpt-button color-button"
                @click="
                  toLogin();
                  drawer = false;
                "
              >
                <!-- 现在领取 1 美元体验金！ -->
                现在开启你的 AI 时刻！
                <div class="my-count-hover"></div>
              </button>
              <div v-if="userInfo.name" class="share-my-code">
                分享我的推荐码：
                <span class="code" @click="copy">
                  {{ userInfo.inviteCode }}
                </span>
              </div>
            </div>
          </el-aside>
        </el-drawer>
      </el-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import QRCode from "qrcode";
// import logo from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png";
// import whiteLogo from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png";
// import iconMenu from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/images/menu.png";
// import iconAi from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai.png";
// import iconSelf from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-self.png";
// import iconKey from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-key.png";
// import swiper1 from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider1.png";
// import swiper2 from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider2.png";
// import swiper3 from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider3.png";
import {
  onBeforeMount,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
} from "vue";
import CollectItem from "@/components/CollectItem.vue";
import ChatGptTypewriter from "@/components/ChatGptTypewriter.vue";
import CollectItemSmall from "@/components/CollectItemSmall.vue";
import ChatGptTypewriterSmall from "@/components/ChatGptTypewriterSmall.vue";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import { Back } from "@element-plus/icons-vue";
import { pinyin } from "pinyin-pro";
import {
  checkPhone,
  doSendCode,
  doLoginApi,
  doRegisterCode,
  registerAccount,
  doGetInfo,
} from "@/api/index";
import { useRouter } from "vue-router";
import useClipboard from "vue-clipboard3";
type Option = {
  value: string;
  label: string;
};
// select opetion
const options = ref<Option[]>([
  { value: "gpt4", label: "GPT-4" },
  { value: "gpt432", label: "GPT-4 32K" },
  { value: "gpt3.5", label: "GPT-3.5" },
]);
const aiVersion = ref<{ value: string; label: string }>(options.value[0]);
const showDialog = ref(false);
// 是否注册过
const isCreatedAccount = ref(false);
const status = ref(1);
const tel = ref("");
const tel1 = ref("");
const tel2 = ref("");
const tel3 = ref("");
const telholder1 = ref("xxx");
const telholder2 = ref("xxxx");
const telholder3 = ref("xxxx");
const telFocus = ref(false);
const telholder = ref("请输入手机号码");
const sms = ref("");
const sms1 = ref("");
const sms2 = ref("");
const sms3 = ref("");
const sms4 = ref("");
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
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
const drawer = ref(false);
const qrCodeImgUrl = ref("");
// 使用插件
const { toClipboard } = useClipboard();
const proxy: any = getCurrentInstance()?.proxy ?? null;
const nickname = ref("");
const animate = ref(true);
const showUserInfo = ref(false);
const time = ref(60);
const $router = useRouter();
const redirectUrl = ref<any>("");
const loginFlag = ref(false);
const swiperList = ref([
  {
    title: "MBM OpenAI GPT-4 服务",
    desc: "作为 微软 Azure OpenAI 中国合作伙伴，MBM 为\n企业用户和个人消费者提供可靠、企业级 OpenAI 服务，\n实现快速访问，无需代理的先进体验。",
    bg: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider1.png",
    button: "探索与 OpenAI 的区别",
  },
  {
    title: "MBM OpenAI GPT-4 服务",
    desc: "我们仅按您使用的内容收取费用，计费标准\n通常还取决于你调用了哪种模型，GPT-3.5 擅长日常会话，而 GPT-4 在专业性和推理能力上则更为强大。",
    bg: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider2.png",
    button: "MBM OpenAI 服务如何计费",
  },
  {
    title: "MBM OpenAI GPT-4 服务",
    desc: "为了满足你对商用级别 OpenAI 服务的苛刻要求，\n我们从产品设计的一开始便考虑了安全的重要性，以此确保\n每一个从你访问到的数据，都受到隐私保护和加密处理。",
    bg: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider3.png",
    button: "企业级 OpenAI 是什么",
  },
]);
// faq list
const questionList = ref<Option[]>([
  {
    value: "3",
    label: "企业级 OpenAI 服务是什么意思？",
  },
  { value: "2", label: "MBM OpenAI 服务如何计费" },
  { value: "1", label: "探索与 OpenAI 的区别" },
]);
onMounted(() => {
  slideBanner();
});
onBeforeMount(() => {
  if ($router.currentRoute.value.query.redirectUrl) {
    redirectUrl.value = $router.currentRoute.value.query.redirectUrl;
  }
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
  }
});
const updateUserInfo = () => {
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
  }
};
//请求接口获取用户信息
const getUserInfo = async (token: string, accessKey: string) => {
  const res = await doGetInfo({ token, accessKey });
  if (res.data.code === 11000) {
    userInfo.value = res.data.data;
    const firstC = getFirstChar(userInfo.value.name);
    nickname.value = firstC;
    if (
      qrCodeImgUrl.value.length == 0 &&
      userInfo.value.inviteCode &&
      userInfo.value.inviteCode.length > 0
    ) {
      QRCode.toDataURL(userInfo.value.inviteCode).then((res1: any) => {
        qrCodeImgUrl.value = res1;
      });
    }
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
    showUserInfo.value = false;
    status.value = 1;
    tel.value = "";
    tel1.value = "";
    tel2.value = "";
    tel3.value = "";
    qrCodeImgUrl.value = "";
  }
};
const deleteTel = (flag: number) => {
  if (flag == 3 && tel3.value.length == 0) {
    proxy?.$refs["telInput2"].focus();
  } else if (tel2.value.length == 0) {
    proxy?.$refs["telInput1"].focus();
  }
};
const talInput = (e: string, index: number) => {
  switch (index) {
    case 0:
      if (e.length == 3) {
        proxy?.$refs["telInput2"].focus();
      }
      tel1.value = e;
      if (
        tel1.value.length == 3 &&
        tel2.value.length == 4 &&
        tel3.value.length == 4
      ) {
        getTelCode(tel1.value + tel2.value + tel3.value);
      }
      break;
    case 1:
      if (e.length == 4) {
        proxy?.$refs["telInput3"].focus();
      }
      tel2.value = e;
      if (
        tel1.value.length == 3 &&
        tel2.value.length == 4 &&
        tel3.value.length == 4
      ) {
        getTelCode(tel1.value + tel2.value + tel3.value);
      }
      break;
    case 2:
      tel3.value = e;
      if (
        tel1.value.length == 3 &&
        tel2.value.length == 4 &&
        tel3.value.length == 4
      ) {
        getTelCode(tel1.value + tel2.value + tel3.value);
      }
      break;
    default:
      break;
  }
};
const getTelCode = async (val: string) => {
  tel.value = val.replace(/\s/g, "");
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
        const timer = setInterval(() => {
          time.value--;
          if (time.value <= 0) {
            time.value = 60;
            clearInterval(timer);
          }
        }, 1000);
        status.value = 3;
      } else {
        if (codeRes.data.code === 12006) {
          status.value = 3;
        }
        ElMessage({ type: "error", message: codeRes.data.msg });
      }
      loginFlag.value = false;
    } else ElMessage("请输入正确的手机号");
  }
};
watch(
  () => sms1.value,
  async (newValue) => {
    sms.value = newValue + sms2.value + sms3.value + sms4.value;
    if (sms.value.length === 4) {
      inputCode(sms.value);
    } else if (showDialog.value && newValue && newValue.length > 0) {
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
    } else if (showDialog.value && newValue && newValue.length > 0) {
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
    } else if (showDialog.value && newValue && newValue.length > 0) {
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
// watch(
//   () => tel.value,
//   async (newValue, oldValue) => {
//     tel.value =
//       newValue.length > oldValue.length
//         ? newValue
//             .replace(/\s/g, "")
//             .replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1 $2 $3")
//         : tel.value.trim();
//     if (tel.value.length === 13) {
//       let mobile = tel.value.replace(/\s/g, "");
//       if (mobile && verifyPhone(mobile)) {
//         if (loginFlag.value) return;
//         loginFlag.value = true;
//         const phoneRegister = await checkPhone({ phone: mobile });
//         let codeRes = null;
//         if (phoneRegister.data.data.register) {
//           // 注册过。登陆验证码
//           codeRes = await doSendCode({ phone: mobile });
//           isCreatedAccount.value = true;
//         } else {
//           // 未注册过，注册验证码
//           codeRes = await doRegisterCode({ phone: mobile });
//         }
//         if (codeRes.data.code === 11000) {
//           ElMessage({ type: "success", message: "验证码已发送" });
//           const timer = setInterval(() => {
//             time.value--;
//             if (time.value <= 0) {
//               time.value = 60;
//               clearInterval(timer);
//             }
//           }, 1000);
//           status.value = 3;
//         } else {
//           ElMessage({ type: "error", message: codeRes.data.msg });
//         }
//         loginFlag.value = false;
//       } else ElMessage("请输入正确的手机号");
//     }
//   }
// );
// 显示登录选项
const toLogin = () => {
  let usr = localStorage.getItem("userInfo");
  if (!usr) {
    if (!agent.value) {
      nextTick(() => {
        showDialog.value = true;
      });
    } else {
      $router.push({
        name: "singleLogin",
        query: {
          redirectUrl: window.location.href,
        },
      });
    }
  }
};
// 培训
const train = (message: string) => {
  ElNotification({
    title: "Success",
    message,
    type: "success",
    duration: 2000,
    showClose: false,
  });
};
// swiper slide
const changeSwiper = () => {
  animate.value = false;
  setTimeout(() => {
    animate.value = true;
  }, 100);
};
// sms countDown
const countDown = async () => {
  if (time.value < 60) return;
  if (tel.value.length === 11) {
    let phone = tel.value.replace(/\s/g, "");
    if (phone && verifyPhone(phone)) {
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
        if (res.data.code === 12006) {
          status.value = 3;
        }
        // 没有注册
        ElMessage({ type: "warning", message: res.data.msg });
      }
    } else {
      ElMessage({ type: "warning", message: "请输入正确的手机号码" });
    }
  } else {
    ElMessage({ type: "warning", message: "请输入正确的手机号码" });
  }
};
// 复制
const copy = async () => {
  try {
    // 复制
    await toClipboard(
      `${window.location.href}?inviteCode=${userInfo.value.inviteCode}`
    );
    ElMessage({ message: "复制成功", type: "success" });
  } catch (e) {
    ElMessage("复制失败");
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
        sms1.value = "";
        sms2.value = "";
        sms3.value = "";
        sms4.value = "";
        if (redirectUrl.value) {
          skip(redirectUrl.value, false);
        } else {
          if (
            qrCodeImgUrl.value.length == 0 &&
            userInfo.value.inviteCode &&
            userInfo.value.inviteCode.length > 0
          ) {
            QRCode.toDataURL(userInfo.value.inviteCode).then((res1: any) => {
              qrCodeImgUrl.value = res1;
            });
          }
        }
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
    sms1.value = "";
    sms2.value = "";
    sms3.value = "";
    sms4.value = "";
    if (redirectUrl.value) {
      skip(redirectUrl.value, false);
    } else {
      if (
        qrCodeImgUrl.value.length == 0 &&
        userInfo.value.inviteCode &&
        userInfo.value.inviteCode.length > 0
      ) {
        QRCode.toDataURL(userInfo.value.inviteCode).then((res1: any) => {
          qrCodeImgUrl.value = res1;
        });
      }
    }
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
// 跳转url
const skip = (url: string, openNew: boolean) => {
  let usr: any = localStorage.getItem("userInfo");
  if (usr) {
    usr = JSON.parse(usr);
  }
  if (openNew) {
    window.open(`${url}?token=${usr?.token}&version=${aiVersion.value.value}`);
  } else {
    window.location.href = `${url}?token=${usr?.token}&version=${aiVersion.value.value}`;
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
// 跳转充值
const recharge = () => {
  window.open(`${window.location.href.split("?")[0]}recharge`);
};
// 滑动切换
const slideBanner = () => {
  //选中的轮播图
  var box = document.querySelector(".el-carousel__container");
  var startPoint = 0;
  var stopPoint = 0;
  //重置坐标
  var resetPoint = function () {
    startPoint = 0;
    stopPoint = 0;
  };
  //手指按下
  box?.addEventListener("touchstart", function (e: any) {
    //手指点击位置的X坐标
    startPoint = e.changedTouches[0].pageX;
  });
  //手指滑动
  box?.addEventListener("touchmove", function (e: any) {
    //手指滑动后终点位置X的坐标
    stopPoint = e.changedTouches[0].pageX;
  });
  //当手指抬起的时候，判断图片滚动离左右的距离
  box?.addEventListener("touchend", function () {
    if (stopPoint == 0 || startPoint - stopPoint == 0) {
      resetPoint();
      return;
    }
    if (startPoint - stopPoint > 0) {
      resetPoint();
      proxy?.$refs["slide"].next();
      return;
    }
    if (startPoint - stopPoint < 0) {
      resetPoint();
      proxy?.$refs["slide"].prev();
      return;
    }
  });
};
const logout = () => {
  ElMessageBox.confirm("是否退出登录?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
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
    showUserInfo.value = false;
    status.value = 1;
    tel.value = "";
    tel1.value = "";
    tel2.value = "";
    tel3.value = "";
    qrCodeImgUrl.value = "";
  });
};
const navQuestion = (blogType: string) => {
  $router.push({ name: "blog", query: { blogType } });
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
    // .top {
    //   top: 0;
    //   background: rgba(255, 255, 255, 0.15);
    // }
    // .right {
    //   right: 0;
    //   background: rgba(255, 255, 255, 0.15);
    // }
    // .bottom {
    //   bottom: 0;
    //   background: rgba(255, 255, 255, 0.15);
    // }
    // .left {
    //   left: 0;
    //   background: rgba(255, 255, 255, 0.15);
    // }
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
.px-common-layout {
  // height: 100vh;
  //   min-width: 1200px;
  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 100vw;
    background: #ffffff;
    padding: 0 20px;
    .logo {
      //   height: 33px;
      height: 20px;
    }
    .avatar {
      width: 32px;
      height: 32px;
      background: #818da3;
      box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      font-size: 0.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #ffffff;
      z-index: 2;
      cursor: pointer;
    }
  }
  .aside {
    width: 20vw;
    min-height: 100vh;
    min-width: 280px;
    // overflow: hidden;
    background: #07070d;
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
    .gpt-button {
      width: 100%;
      height: 7vh;
      min-height: 52px;
      background: #4383ea;
      border-radius: 8px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      margin: 11vh auto 4vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
    }
    .color-button {
      margin-top: 5vh;
      background: linear-gradient(23deg, #4383ea 0%, #4861eb 49%, #8748eb 100%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      @include chargeHover5Style;
      position: relative;
      cursor: pointer;
      .light {
        font-size: 25px;
        margin-left: 5px;
      }
      .my-count-hover {
        width: 0;
        height: 100%;
        background: rgba(255, 255, 255, 0.15);
        transition: all 0.3s;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 10px;
      }
      // .top,
      // .right,
      // .bottom,
      // .left {
      //   position: absolute;
      //   width: 100%;
      //   height: 100%;
      //   top: 0;
      //   left: 0;
      //   transition: all 0.3s;
      // }
      // .top:after,
      // .right:after,
      // .bottom:after,
      // .left:after {
      //   position: absolute;
      //   content: "";
      //   width: 100%;
      //   height: 100%;
      // }
      // .top {
      //   top: -100%;
      //   background: transparent;
      // }
      // .right {
      //   right: -100%;
      //   left: auto;
      //   background: transparent;
      // }
      // .bottom {
      //   bottom: -100%;
      //   top: auto;
      //   background: transparent;
      // }
      // .left {
      //   left: -100%;
      //   background: transparent;
      // }
      // .top:after {
      //   clip-path: polygon(0 0, 50% 50%, 100% 0);
      //   top: 100%;
      //   left: 0;
      // }
      // .right:after {
      //   clip-path: polygon(100% 0, 50% 50%, 100% 100%);
      //   right: 100%;
      //   top: 0;
      // }
      // .bottom:after {
      //   clip-path: polygon(0 100%, 50% 50%, 100% 100%);
      //   bottom: 100%;
      //   left: 0;
      // }
      // .left:after {
      //   clip-path: polygon(0 0, 50% 50%, 0 100%);
      //   left: 100%;
      //   top: 0;
      // }
      // .top:after,
      // .right:after,
      // .bottom:after,
      // .left:after {
      //   position: absolute;
      //   content: "";
      //   width: 100%;
      //   height: 100%;
      //   transform-origin: 0 0;
      // }
      // .top:after {
      //   top: 150%;
      //   left: 50%;
      //   transform: rotate(calc(var(--angle) - 180deg))
      //     skew(calc((var(--angle) - 45deg) * 2));
      // }
      // .right:after {
      //   top: 50%;
      //   left: -50%;
      //   transform: rotate(calc(0deg - var(--angle)))
      //     skew(calc((45deg - var(--angle)) * 2));
      // }
      // .bottom:after {
      //   top: -50%;
      //   left: 50%;
      //   transform: rotate(var(--angle)) skew(calc((var(--angle) - 45deg) * 2));
      // }
      // .left:after {
      //   top: 50%;
      //   left: 150%;
      //   transform: rotate(calc(180deg - var(--angle)))
      //     skew(calc((45deg - var(--angle)) * 2));
      // }
      // .top:hover {
      //   top: 0;
      //   background: rgba(255, 255, 255, 0.15);
      // }
      // .right:hover {
      //   right: 0;
      //   background: rgba(255, 255, 255, 0.15);
      // }
      // .bottom:hover {
      //   bottom: 0;
      //   background: rgba(255, 255, 255, 0.15);
      // }
      // .left:hover {
      //   left: 0;
      //   background: rgba(255, 255, 255, 0.15);
      // }
      // /* 解决层级阻断问题 */
      // .top:hover ~ .right,
      // .top:hover ~ .bottom,
      // .top:hover ~ .left,
      // .right:hover ~ .bottom,
      // .right:hover ~ .left,
      // .bottom:hover ~ .left {
      //   display: none;
      // }
      .block_hoverer {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: all 0.3s ease;
      }

      .block_hoverer:nth-child(1) {
        background: rgba(255, 255, 255, 0.15);
        top: -90%;
      }

      .block_hoverer:nth-child(2) {
        background: rgba(255, 255, 255, 0.15);
        top: 90%;
      }

      .block_hoverer:nth-child(3) {
        background: rgba(255, 255, 255, 0.15);
        left: -90%;
      }

      .block_hoverer:nth-child(4) {
        background: rgba(255, 255, 255, 0.15);
        left: 90%;
      }
      .block_hoverer:hover {
        opacity: 1;
        top: 0;
        left: 0;
      }
    }
    .get-one-dollar {
      font-family: FUTURA-MEDIUM;
    }
    .share-my-code {
      width: 100%;
      box-sizing: border-box;
      padding: o 10px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.8);
      .code {
        text-decoration: underline;
        cursor: pointer;
        font-size: 16px;
      }
    }
    .default-model {
      // width: 235px;
      width: 100%;
      // height: 47px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      margin-bottom: 4vh;
      @include hover2Style;
      .icon-ai {
        display: block;
      }
      &:nth-of-type(1) {
        .icon-ai {
          width: 40px;
        }
      }
      &:nth-of-type(2),
      &:nth-of-type(3) {
        .icon-ai {
          width: 30px;
          margin-right: 3px;
          filter: brightness(0.4);
        }
      }
      .model-name {
        margin: 0 3px 0 10px;
        font-size: 1rem;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        min-width: 60px;
      }
      .active {
        font-size: 0.9rem;
        color: #fff;
      }
      .ai-select {
        width: 100%;
        ::placeholder {
          color: #fff;
        }

        :deep(.el-input__wrapper) {
          background: #202226;
          color: #ffffff;
          min-height: 3vh;
          max-width: 7vw;
          box-shadow: none !important;
          border: 1px dashed rgba(255, 255, 255, 0.6);
          box-sizing: border-box;
          .el-input__inner {
            font-size: 1rem;
            font-family: FUTURA-MEDIUM;
            font-weight: bold;
            color: #ffffff;
          }
        }
      }
      //   .w128 {
      //     width: 128px;
      //   }
      //   .w171 {
      //     width: 171px;
      //   }
    }
    .default-model:nth-last-child(1) {
      margin-bottom: 21.5vh;
    }
    .question-box {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0 auto;
      .question {
        font-size: 0.8rem;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.4);
        margin: 11px 0;
        cursor: pointer;
        @include hover5Style;
      }
    }
  }

  .phone-aside {
    width: 80vw;
    min-height: 100vh;
    // height: 100vh;
    // overflow: hidden;
    background: #07070d;
    color: #fff;
    box-sizing: border-box;
    padding: 33px 30px 33px 30px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    .flex {
      width: 100%;
    }
    .logo {
      //   height: 33px;
      height: 32px;
    }
    .gpt-button {
      width: 100%;
      height: 55px;
      background: #4383ea;
      border-radius: 8px;
      font-size: 12px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      // line-height: 40px;
      margin: 80px auto 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
    }
    .color-button {
      margin-top: 20px;
      background: linear-gradient(23deg, #4383ea 0%, #4861eb 49%, #8748eb 100%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      font-family: FUTURA-MEDIUM;
      @include chargeHover5Style;
      position: relative;
      .light {
        font-size: 18px;
        margin-left: 5px;
      }
      .my-count-hover {
        width: 0;
        height: 100%;
        background: rgba(255, 255, 255, 0.15);
        transition: all 0.3s;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 10px;
      }
    }
    .get-one-dollar {
      font-family: FUTURA-MEDIUM;
    }
    .share-my-code {
      width: 100%;
      box-sizing: border-box;
      padding: o 10px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.8);
      .code {
        text-decoration: underline;
        cursor: pointer;
        font-size: 16px;
      }
    }
    .default-model {
      // width: 235px;
      width: 100%;
      // height: 47px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      margin-bottom: 30px;
      @include hover2Style;
      .icon-ai {
        display: block;
      }
      &:nth-of-type(1) {
        .icon-ai {
          width: 30px;
        }
      }
      &:nth-of-type(2),
      &:nth-of-type(3) {
        .icon-ai {
          width: 24px;
          margin-right: 3px;
          filter: brightness(0.4);
        }
      }
      .model-name {
        margin: 0 3px 0 10px;
        font-size: 16px;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
      }
      .active {
        font-size: 12px;
        color: #fff;
      }
      .ai-select {
        ::placeholder {
          color: #fff;
        }

        :deep(.el-input__wrapper) {
          background: #202226;
          color: #ffffff;
          min-height: 33px;
          max-width: 106px;
          box-shadow: none !important;
          border: 1px dashed rgba(255, 255, 255, 0.6);
          box-sizing: border-box;
          .el-input__inner {
            font-size: 16px;
            font-family: FUTURA-MEDIUM;
            font-weight: bold;
            color: #ffffff;
          }
        }
      }
      //   .w128 {
      //     width: 128px;
      //   }
      //   .w171 {
      //     width: 171px;
      //   }
    }
    .default-model:nth-last-child(1) {
      margin-bottom: 80px;
    }
    .question-box {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0 auto;
      .question {
        font-size: 12px;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.4);
        margin: 11px 0;
        cursor: pointer;
        @include hover5Style;
      }
    }
  }
  .header {
    height: 36vh;
    position: relative;
    padding: 0;
    .open-ai {
      // min-width: 19vw;
      height: 5vh;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #000000;
      font-size: 1rem;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      position: absolute;
      left: 7vw;
      bottom: 5vh;
      transition: all 0.3s;
      padding: 0 20px;
      &:hover {
        padding: 0 50px;
        transition: all 0.3s;
      }
    }
    .swiper {
      height: 36vh;
      :deep(.el-carousel__container) {
        height: 36vh;
      }
      :deep(.el-carousel__indicator--horizontal) {
        flex-shrink: 0;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 10px;
        padding: 0;
        bottom: 10px;
        border: none;
      }
      :deep(.el-carousel__indicator.is-active) {
        background: #fff;
      }
      :deep(.el-carousel__button) {
        display: none;
      }
    }

    .swipe {
      height: 100%;
      width: 100%;
      color: #fff;
      box-sizing: border-box;
      padding: 3vh 4vw;
      .title {
        margin-left: 2vw;
        font-size: 1.8rem;
        font-family: FUTURA-MEDIUM;
        font-weight: 500;
        color: #ffffff;
      }
      .animate__delay-1 {
        animation-delay: 0.1s;
      }
      .animate__delay-2 {
        animation-delay: 0.2s;
      }
      .animate__delay-3 {
        animation-delay: 0.3s;
      }
      .desc {
        width: 50vw;
        height: 14vh;
        margin-top: 1.5vh;
        font-size: 1.4rem;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        line-height: 1.8rem;
        color: rgba(255, 255, 255, 0.95);
        white-space: pre-wrap;
      }
    }

    .avatar {
      width: 66px;
      height: 66px;
      background: #818da3;
      box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
      border-radius: 50%;
      position: absolute;
      right: 63px;
      top: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      font-size: 16px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #ffffff;
      z-index: 2;
      cursor: pointer;
    }
    .user-info {
      width: 0;
      height: 0;
      background: #ffffff;
      border: 1px solid #707070;
      border-radius: 11px;
      position: absolute;
      right: 39px;
      top: 15px;
      z-index: 1;
      box-sizing: border-box;
      padding: 0;
      transition: all 0.2s;
      overflow: hidden;
      .nickname {
        width: 100%;
        height: 25px;
        font-size: 24px;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        margin-bottom: 36px;
        color: #07070d;
        span {
          font-size: 24px;
          font-family: FUTURA-MEDIUM;
          font-weight: bold;
        }
      }
      .info-item {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: nowrap;
        height: 35px;
        font-size: 11px;
        font-family: FUTURA-MEDIUM;
        font-weight: normal;
        line-height: 21px;
        color: #07070d;
        .label {
          display: inline-block;
          width: 100px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .code {
          font-size: 11px;
          cursor: pointer;
        }
      }
    }
    .show-user {
      padding: 25px 20px 15px 15px;
      width: 344px;
      height: 300px;
      transition: all 0.3s;
    }
  }
  .phone-header {
    height: 260px;
    position: relative;
    padding: 0;
    .open-ai {
      min-width: 128px;
      height: 23px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #000000;
      font-size: 12px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      position: absolute;
      left: 50px;
      bottom: 40px;
      transition: all 0.3s;
      padding: 0 20px;
      &:hover {
        padding: 0 50px;
        transition: all 0.3s;
      }
    }
    .swiper {
      height: 260px;
      :deep(.el-carousel__container) {
        height: 260px;
      }
      :deep(.el-carousel__indicator--horizontal) {
        flex-shrink: 0;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 10px;
        padding: 0;
        bottom: 10px;
        border: none;
      }
      :deep(.el-carousel__indicator.is-active) {
        background: #fff;
      }
      :deep(.el-carousel__button) {
        display: none;
      }
    }

    .swipe {
      height: 260px;
      width: 100vw;
      color: #fff;
      box-sizing: border-box;
      padding: 20px 36px;
      .title {
        font-size: 18px;
        font-family: FUTURA-MEDIUM;
        font-weight: 500;
        color: #ffffff;
      }
      .animate__delay-1 {
        animation-delay: 0.1s;
      }
      .animate__delay-2 {
        animation-delay: 0.2s;
      }
      .animate__delay-3 {
        animation-delay: 0.3s;
      }
      .desc {
        // width: 764px;
        // height: 150px;
        // margin-top: 40px;
        font-size: 14px;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        // line-height: 16px;
        color: rgba(255, 255, 255, 0.95);
        white-space: pre-wrap;
      }
    }

    .user-info {
      width: 0;
      height: 0;
      background: #ffffff;
      border: 1px solid #707070;
      border-radius: 11px;
      position: absolute;
      right: 39px;
      top: 15px;
      z-index: 1;
      box-sizing: border-box;
      padding: 0;
      transition: all 0.2s;
      overflow: hidden;
      .nickname {
        width: 100%;
        height: 25px;
        font-size: 24px;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        margin-bottom: 36px;
        color: #07070d;
        span {
          font-size: 24px;
          font-family: FUTURA-MEDIUM;
          font-weight: bold;
        }
      }
      .info-item {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: nowrap;
        height: 35px;
        font-size: 11px;
        font-family: FUTURA-MEDIUM;
        font-weight: normal;
        line-height: 21px;
        color: #07070d;
        .label {
          display: inline-block;
          width: 100px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .code {
          font-size: 11px;
          cursor: pointer;
        }
      }
    }
    .show-user {
      padding: 25px 20px 15px 15px;
      width: 80vw;
      height: 300px;
      transition: all 0.3s;
    }
  }
  .main {
    padding: 0;
    height: 64vh;
    box-sizing: border-box;
    padding: 40px 50px;
    background: #f5f5f7;
    .title {
      font-size: 23px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #333333;
      margin: 0 auto 23px;
      .app-num {
        font-size: 14px;
        margin-left: 8px;
        font-weight: bold;
      }
    }
  }
  .phone-main {
    padding: 0;
    height: calc(100vh - 320px);
    width: 100vw;
    box-sizing: border-box;
    padding: 20px 25px;
    background: #f5f5f7;
    .title {
      font-size: 16px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #333333;
      margin: 0 auto 20px;
      .app-num {
        font-size: 16px;
        margin-left: 8px;
        font-weight: bold;
      }
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
    background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/type-word.png")
      center / cover no-repeat;
    border-radius: 11px 11px 0px 0px;
    padding: 118px 10px 65px 155px;
    box-sizing: border-box;
    .mask {
      width: 100%;
      height: 243px;
      // background: rgba(0, 0, 0, 0.2);
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
    font-family: FUTURA-MEDIUM;
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
    margin: 20px auto 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .tel {
      // width: 320px;
      border: none;
      // margin: 40px 10px 0;
      :deep(.el-input__wrapper) {
        // border-bottom: 1px solid #000;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        text-align: left;
        font-size: 26px;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        color: #000;
      }
    }
    .tel-container {
      margin: 60px 10px 0;
      border-bottom: 1px solid #000;
      padding: 0 6px;
    }
    .tel-big {
      margin: 40px 10px 0;
      border: 3px solid transparent;
      border-radius: 6px;
      &.focus {
        border: 3px solid #66b1fc;
      }
      .tel-contain {
        border: 1px solid #d2d2d7;
        width: 320px;
        height: 50px;
        border-radius: 3px;
        padding: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        &.focus {
          border: 2px solid #4383ea;
        }
      }
    }
    .tel1 {
      width: 66px;
      border: none;
      // margin: 40px 10px 0;
      ::placeholder {
        letter-spacing: 9.6px;
      }
      :deep(.el-input__wrapper) {
        // border-bottom: 1px solid #000;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        text-align: center;
        font-size: 26px;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        color: #000000;
        letter-spacing: 6px;
      }
    }
    .tel2 {
      width: 90px;
      border: none;
      // margin: 40px 10px 0;
      ::placeholder {
        letter-spacing: 9.6px;
      }
      :deep(.el-input__wrapper) {
        // border-bottom: 1px solid #000;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        text-align: center;
        font-size: 26px;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        color: #000000;
        letter-spacing: 6px;
      }
    }
    .tel3 {
      width: 90px;
      border: none;
      // margin: 40px 10px 0;
      ::placeholder {
        letter-spacing: 9.6px;
      }
      :deep(.el-input__wrapper) {
        // border-bottom: 1px solid #000;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        text-align: center;
        font-size: 26px;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        color: #000000;
        letter-spacing: 6px;
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
        font-family: FUTURA-MEDIUM;
        font-weight: 600;
        color: #000000;
        // letter-spacing: 80px;
        text-align: center;
        // overflow-x: hidden;
        // overflow: hidden;
      }
    }
    .bb {
      width: 360px;
      height: 64px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      // left: 32px;
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
        font-family: FUTURA-MEDIUM;
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
        font-family: FUTURA-MEDIUM;
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
      width: 120px;
      margin: 20px auto 0;
      border-radius: 50%;
      background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/hudu.png")
        center / contain no-repeat;
    }
  }
  .resend {
    // height: 30px;
    font-size: 18px;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    color: #000000;
    margin: 15px auto 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
    .countdown {
      margin-left: 5px;
      font-weight: 100;
      font-family: FUTURA-MEDIUM;
    }
    &.disable {
      color: rgba(0, 0, 0, 0.3);
    }
  }
  .back {
    font-size: 12px;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    color: #000000;
    margin: 16px auto 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
  }
  .tip {
    height: 30px;
    font-size: 12px;
    font-family: FUTURA-MEDIUM;
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
    background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/type-word.png")
      center / cover no-repeat;
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
    font-family: FUTURA-MEDIUM;
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
        font-family: FUTURA-MEDIUM;
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
        font-family: FUTURA-MEDIUM;
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
        font-family: FUTURA-MEDIUM;
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
        font-family: FUTURA-MEDIUM;
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
      background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/hudu.png")
        center / contain no-repeat;
    }
  }
  .resend {
    height: 30px;
    font-size: 14px;
    font-family: FUTURA-MEDIUM;
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
      font-family: FUTURA-MEDIUM;
    }
    &.disable {
      color: rgba(0, 0, 0, 0.3);
    }
  }
  .tip {
    height: 30px;
    font-size: 12px;
    font-family: FUTURA-MEDIUM;
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
  font-family: FUTURA-MEDIUM;
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
  font-family: FUTURA-MEDIUM;
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
.popover-container {
  width: 200px;
  height: 300px;
  background: #ffffff;
  .popover-top {
    width: 200px;
    height: 200px;
  }
  .qrCode {
    width: 150px;
    height: 150px;
  }
}
:global(.el-popper.is-light.el-popover) {
  background: #ffffff !important;
  border: none;
}
</style>
