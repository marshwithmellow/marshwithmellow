<template>
  <div class="aside">
    <img
      class="logo"
      src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
      alt=""
    />
    <div class="aside-content">
      <div class="flex">
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
                aiVersion.value === 'GPT-4' || aiVersion.value === 'GPT-3.5',
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
        <el-popover
          placement="right"
          :width="300"
          :offset="30"
          v-if="userInfo.name"
          :visible="exchangeShow"
          trigger="click"
          @update:visible="updateExchangeShow"
          popper-class="exchange"
        >
          <template #reference>
            <div class="default-model">
              <img
                class="icon-ai"
                src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-documents.png"
                alt=""
              />
              <div class="model-name">兑换无限次对话周卡</div>
            </div>
          </template>
          <div class="popover-container" @click.stop>
            <img
              class="popover-logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
              alt=""
            />
            <div
              class="popover-content"
              v-if="!exchangeItem || exchangeContinue"
            >
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                  flex: 1;
                  max-height: 450px;
                "
              >
                <div class="popover-title" style="margin-bottom: 20px">
                  兑换我的无限次周卡
                </div>
                <img
                  :src="
                    cardType == 2
                      ? 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-black.png'
                      : cardType == 1
                      ? 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-red.png'
                      : 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-default.png'
                  "
                  style="width: 100%"
                />
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin-top: 30px;
                  "
                >
                  <el-input
                    v-model="exchangeCode"
                    class="exchange-input"
                    placeholder="在此填入兑换码"
                    :maxlength="8"
                  >
                    <template #suffix>
                      <div
                        class="clear"
                        v-if="exchangeCode.length > 0"
                        @click="exchangeCode = ''"
                      >
                        清空
                      </div>
                    </template>
                  </el-input>
                </div>
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin-top: 30px;
                  "
                >
                  <div
                    style="
                      width: 90%;
                      display: flex;
                      justify-content: flex-start;
                      align-items: flex-start;
                      flex-direction: row;
                    "
                  >
                    <div class="exchange-confirm" @click="exchangeConfirm">
                      立即兑换
                    </div>
                  </div>
                </div>
                <!-- <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-direction: column;
                    flex: 1;
                  "
                >
                </div> -->
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  flex-direction: column;
                  min-height: 130px;
                "
              >
                <div style="width: 90%">
                  <div class="description">
                    ChatGPT 每张周卡兑换码仅可使用一次；
                  </div>
                </div>
                <div style="width: 90%">
                  <div class="description">
                    您可在激活后的 7 天内无限次使用 GPT3.5 模型进行回答。
                  </div>
                </div>
              </div>
            </div>
            <div class="popover-content" v-else>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                  flex: 1;
                  max-height: 450px;
                "
              >
                <div class="popover-title" style="margin-bottom: 20px">
                  兑换我的无限次周卡
                </div>
                <img
                  :src="
                    exchangeItem?.cardType == 2
                      ? 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-black.png'
                      : 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-red.png'
                  "
                  style="width: 100%"
                />
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin-top: 30px;
                  "
                >
                  <div class="exchange-text">
                    <span>您</span>
                    <span>可</span>
                    <span>于</span>
                    <span class="space">&nbsp;</span>
                    <span>{{ exchangeItem?.timeArray[0] }}</span>
                    <span class="space">&nbsp;</span>
                    <span>年</span>
                    <span class="space">&nbsp;</span>
                    <span>{{ exchangeItem?.timeArray[1] }}</span>
                    <span class="space">&nbsp;</span>
                    <span>月</span>
                    <span class="space">&nbsp;</span>
                    <span>{{ exchangeItem?.timeArray[2] }}</span>
                    <span class="space">&nbsp;</span>
                    <span>日</span>
                    <span>前</span>
                    <span>无</span>
                    <span>限</span>
                    <span>次</span>
                    <span>使</span>
                    <span>用</span>
                    <span>服</span>
                    <span>务</span>
                  </div>
                </div>
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin-top: 30px;
                    margin-bottom: 30px;
                  "
                >
                  <div
                    style="
                      width: 90%;
                      display: flex;
                      justify-content: flex-start;
                      align-items: flex-start;
                      flex-direction: row;
                    "
                  >
                    <div class="exchange-confirm-2">兑换成功</div>
                  </div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  flex-direction: column;
                "
              >
                <div style="width: 90%">
                  <div class="description">
                    ChatGPT 每张周卡兑换码仅可使用一次；
                  </div>
                </div>
                <div style="width: 90%">
                  <div class="description">
                    您可在激活后的 7 天内无限次使用 GPT3.5 模型进行回答。
                  </div>
                </div>
                <div
                  class="resume-container"
                  style="margin-top: 40px"
                  @click="exchangeContinue = true"
                >
                  <div class="txt">继续兑换</div>
                  ？
                </div>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="default-model" @click="toLogin" v-else>
          <img
            class="icon-ai"
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-documents.png"
            alt=""
          />
          <div class="model-name">兑换无限次对话周卡</div>
        </div>
        <el-popover
          placement="right"
          :width="300"
          :offset="30"
          v-if="userInfo.name"
          :visible="popoverShow"
          trigger="click"
          @update:visible="updatePopoverShow"
          popper-class="gpt-model"
        >
          <template #reference>
            <div class="default-model">
              <img
                class="icon-ai"
                src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-key.png"
                alt=""
              />
              <div class="model-name">
                {{
                  userInfo.name && userInfo.isAuth === 1 ? "查看" : "生成"
                }}我的 GPT4 API Key
              </div>
            </div>
          </template>
          <div class="popover-container" @click.stop>
            <img
              class="popover-logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
              alt=""
            />
            <div class="popover-content">
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                "
                v-if="userInfo.isAuth === 1"
              >
                <div class="popover-title">我的 GPT4 API Key</div>
                <div class="popover-part">
                  <div class="popover-block">
                    <div class="internal">
                      <div>
                        {{
                          userInfo.accountType === 2
                            ? "企业"
                            : userInfo.accountType === 3
                            ? "团队"
                            : "个人"
                        }}
                      </div>
                    </div>
                  </div>

                  <div
                    class="popover-right"
                    v-if="
                      userInfo.accountType === 1 || userInfo.accountType === 3
                    "
                  >
                    <div class="price">升级至</div>
                    <div style="display: flex; flex-direction: row">
                      <div
                        class="desc"
                        v-if="
                          userInfo.accountType === 1 ||
                          userInfo.accountType === 3
                        "
                        @click="
                          emits('popoverConfirm', {
                            keyType: 2,
                          })
                        "
                      >
                        企业
                      </div>
                      <div
                        class="desc"
                        v-if="userInfo.accountType === 1"
                        style="margin-left: 20px"
                        @click="
                          emits('popoverConfirm', {
                            keyType: 3,
                          })
                        "
                      >
                        团队
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="popover-part-a"
                  style="cursor: pointer"
                  @click.stop="copyText(userInfo.accessKey)"
                >
                  <div class="popover-block-a">
                    {{ userInfo.accessKey }}
                  </div>
                  <div class="popover-right">
                    <div class="desc2">复制</div>
                  </div>
                </div>
                <div class="popover-part-a">
                  <div
                    class="popover-block-a"
                    @click="
                      skip('https://www.showdoc.com.cn/2249626116233450', true)
                    "
                  >
                    访问 MBM OpenAI 开发文档
                  </div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                "
                v-else
              >
                <div class="popover-title">生成 GPT4 API Key</div>
                <div class="popover-desc">
                  我们为个人、团队和企业开发者提供了GPT
                  开发接口，并集成了内容审查服务。
                </div>
                <div
                  class="popover-part"
                  :class="index == popoverIndex ? '' : 'normal'"
                  v-for="(item, index) in popoverOptions"
                  :key="index"
                  @click="popoverIndex = index"
                >
                  <div class="popover-block">
                    <div class="internal">
                      <div>{{ item.title }}</div>
                    </div>
                  </div>
                  <div class="popover-right">
                    <div class="price">{{ item.price }}元</div>
                    <div class="desc">{{ item.desc }}</div>
                  </div>
                </div>
                <div class="popover-btn" @click="popoverConfirm">
                  <div>立即申请</div>
                </div>
              </div>
              <!-- <div
                      style="
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                        align-items: flex-start;
                        flex-direction: column;
                        flex: 1;
                        padding-top: 20px;
                      "
                      v-if="userInfo.isAuth === 1"
                    >
                      <el-divider>开发者社区</el-divider>
                      <div v-if="isUploadHead"></div>
                      <div class="popover-ready-upload" v-else>
                        <div class="popover-upload">
                          <div>+</div>
                        </div>
                        <img
                          class="popover-head-1"
                          src="@/assets/images/head1.png"
                          fit="scale-down"
                        />
                        <img
                          class="popover-head-2"
                          src="@/assets/images/head2.png"
                          fit="scale-down"
                        />
                        <img
                          class="popover-head-3"
                          src="@/assets/images/head3.png"
                          fit="scale-down"
                        />
                        <div class="popover-question-1">
                          现在，请更新你独一无二的头像。
                        </div>
                        <div class="popover-question-2">
                          Hi 开发者，欢迎加入社区。
                        </div>
                      </div>
                    </div> v-else -->
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                "
                v-if="userInfo.isAuth === 0"
              >
                <div class="popover-foot-desc">
                  GPT4 API key 均包含 GPT-4、GPT-4 32K 和 GPT-3.5-Turbo
                  模型。由于计算资源紧张，GPT-4 模型将优先保证企业和团队
                  用户的开发调用请求。
                </div>
                <div
                  class="popover-foot-a"
                  @click="
                    skip(
                      'https://openai.mbmzone.com/mbm-gpt/blog?blogType=3',
                      true
                    )
                  "
                >
                  了解企业级 OpenAI 服务与个人服务的区别
                </div>
              </div>
            </div>
          </div>
        </el-popover>
        <div class="default-model" @click="toLogin" v-else>
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
          <span class="light iconfont icon-shandian"></span>
        </button>
        <button v-else class="gpt-button color-button" @click="toLogin">
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
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  onBeforeMount,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
} from "vue";
import useClipboard from "vue-clipboard3";
import { getSerialNumber } from "@/api/index";
type Option = {
  value: string;
  label: string;
};
type popoverOption = {
  title: string;
  price: number;
  desc: string;
};
type exchangeOption = {
  validityTime: string;
  accountId: string;
  model: string;
  serialNumber: string;
  cardType: number; //卡片类型，1、红卡（编号5开头）。2、黑卡（编号8开头）。
  timeArray: Array<string>; //数组[年，月，日]
};
const emits = defineEmits([
  "toLogin",
  "showMessage",
  "skip",
  "recharge",
  "navQuestion",
  "popoverConfirm",
  "setPopoverShow",
  "clipText",
  "exchangeConfirm",
  "setExchangeShow",
]);
// select opetion
const options = ref<Option[]>([
  { value: "gpt4", label: "GPT-4" },
  { value: "gpt432", label: "GPT-4 32K" },
  { value: "gpt3.5", label: "GPT-3.5" },
]);
const popoverOptions = ref<popoverOption[]>([
  { title: "个人", price: 698, desc: "内含20美金" },
  { title: "团队(10人以内)", price: 1298, desc: "内含50美金" },
  { title: "企业", price: 7500, desc: "内含500美金" },
]);
const popoverIndex = ref(0);
const popoverShow = ref(false);
const exchangeShow = ref(false);
const exchangeItem = ref<exchangeOption | null>(null);
const exchangeContinue = ref(false);
const cardType = ref(0); //0是默认卡片，1是红卡，2是黑卡
let requestLock = false;
const aiVersion = ref<Option>(options.value[0]);
const { toClipboard } = useClipboard();
let cliping = false;
const exchangeCode = ref("");
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
const questionList = ref<Option[]>([
  {
    value: "3",
    label: "企业级 OpenAI 服务是什么意思？",
  },
  { value: "2", label: "MBM OpenAI 服务如何计费" },
  { value: "1", label: "探索与 OpenAI 的区别" },
]);
watch(
  () => popoverShow.value,
  (newValue) => {
    emits("setPopoverShow", newValue);
  }
);
watch(
  () => exchangeShow.value,
  (newValue) => {
    emits("setExchangeShow", newValue);
    if (!newValue) {
      setTimeout(() => {
        exchangeContinue.value = false;
      }, 500);
    }
  }
);
watch(
  () => exchangeCode.value,
  async (newValue) => {
    if (newValue.length >= 8) {
      if (requestLock) {
        return;
      }
      requestLock = true;
      const res = await getSerialNumber({
        token: userInfo.value.token,
        accessKey: userInfo.value.accessKey,
        code: newValue,
      });
      if (res.data.code == 11000) {
        const num: string = res.data.data.serialNumber;
        if (num) {
          cardType.value = num.replace("NO.", "").startsWith("8")
            ? 2
            : num.replace("NO.", "").startsWith("5")
            ? 1
            : 0;
        } else {
          cardType.value = 0;
        }
      } else {
        cardType.value = 0;
      }
      requestLock = false;
    } else {
      cardType.value = 0;
    }
  }
);
// 显示登录选项
const toLogin = () => {
  emits("toLogin");
};
const copyText = async (txt: string) => {
  cliping = true;
  try {
    // 复制
    await toClipboard(txt);
    emits("showMessage", { message: "复制成功", type: "success" });
  } catch (e) {
    emits("showMessage", "复制失败");
  }
};
const copy = async () => {
  emits("clipText", { inviteCode: userInfo.value.inviteCode });
};
const updatePopoverShow = (val: boolean) => {
  if (cliping) {
    cliping = false;
    return;
  }
  popoverShow.value = val;
};
const updateExchangeShow = (val: boolean) => {
  if (cliping) {
    cliping = false;
    return;
  }
  exchangeShow.value = val;
};
const skip = (url: string, openNew: boolean) => {
  emits("skip", { url, openNew });
};
// 跳转充值
const recharge = () => {
  emits("recharge");
};
const navQuestion = (blogType: string) => {
  emits("navQuestion", {
    blogType,
  });
};
const popoverConfirm = () => {
  emits("popoverConfirm", {
    keyType: popoverIndex.value,
  });
};
const exchangeConfirm = () => {
  if (exchangeCode.value.length == 0) {
    emits("showMessage", { message: "请输入密钥", type: "error" });
    return;
  }
  if (cardType.value == 0) {
    emits("showMessage", { message: "密钥不正确，请重新输入", type: "error" });
    return;
  }
  emits("exchangeConfirm", {
    code: exchangeCode.value,
  });
};
const setUserInfo = (info: any) => {
  userInfo.value = info;
};
const setExchangeItem = (item: exchangeOption | null) => {
  exchangeItem.value = item;
};
const setExchangeContinue = (contin: boolean) => {
  exchangeContinue.value = contin;
  if (contin) {
    cardType.value = 0;
    exchangeCode.value = "";
  }
};
const changeExchange = (show: boolean) => {
  cliping = show;
};
defineExpose({
  setUserInfo,
  setExchangeItem,
  setExchangeContinue,
  changeExchange,
});
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
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  z-index: 100;
  .aside-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    flex: 1;
  }
  .flex {
    width: 100%;
  }
  .logo {
    //   height: 33px;
    // height: 5vh;
    width: 10vw;
    min-width: 140px;
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
    margin: 4vh auto;
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
    &:nth-of-type(3),
    &:nth-of-type(4) {
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
        min-width: 100px;
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
  // .default-model:nth-last-child(1) {
  //   margin-bottom: 21.5vh;
  // }
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
:global(.gpt-model.el-popper) {
  background: #000 !important;
  //   border: 1px dashed rgba(255, 255, 255, 0.6) !important;
  margin-top: -14px;
  box-sizing: border-box;
  border-radius: 0 0 3px 3px;
  border: none;
}
:global(.exchange.el-popper) {
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
:global(.select-down.el-popper.is-light),
:global(.gpt-model.el-popper.is-light) {
  background: #000 !important;
  border: none;
}
:global(.exchange.el-popper.is-light) {
  background: #000 !important;
  border: none;
}
:global(.el-popper__arrow) {
  display: none;
}

:v-deep(.select-down) {
  display: none;
}
.popover-container {
  width: 30vw;
  min-width: 340px;
  max-width: 460px;
  height: 100vh;
  background: #07070d;
  box-sizing: border-box;
  padding: 33px 2vw 33px 2vw;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  .popover-logo {
    width: 10vw;
    min-width: 140px;
    visibility: hidden;
    margin-bottom: 4vh;
  }
  .popover-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    .popover-title {
      font-size: 1.5rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      opacity: 1;
    }
    .popover-desc {
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #89919e;
      opacity: 1;
      margin-top: 10px;
    }
    .description {
      color: rgba(225, 225, 225, 0.7);
      font-size: 0.6rem;
    }
    .resume-container {
      width: 90%;
      color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: row;
      font-size: 1.2rem;
      cursor: pointer;
      .txt {
        text-decoration: underline;
      }
    }
    .exchange-input {
      width: 90%;
      border-bottom: #fff solid 1px;
      :deep(.el-input__wrapper) {
        background-color: transparent;
        box-shadow: none;
        padding: 3px 0;
      }
      :deep(.el-input__inner) {
        font-size: 1.2rem;
        font-family: PingFangTC-Semibold;
        color: #fff;
        &::placeholder {
          font-size: 1rem;
          font-family: PingFangTC-Semibold;
          color: #fff;
          opacity: 0.6;
        }
      }
      .clear {
        font-size: 1rem;
        font-family: PingFangTC-Semibold;
        color: #fff;
        opacity: 0.6;
        cursor: pointer;
      }
    }
    .exchange-text {
      display: flex;
      justify-content: space-between;
      width: 90%;
      color: #fff;
      padding-bottom: 10px;
      border-bottom: #fff solid 1px;
      font-size: 0.8rem;
      .space {
        // flex-grow: 1;
      }
      span {
        font-family: PingFangTC-Semibold;
        white-space: nowrap;
      }
    }
    .exchange-confirm {
      padding: 10px 0;
      width: 70%;
      background: rgba(255, 255, 255, 0.1);
      border: #fff solid 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      &:active {
        background: rgba(255, 255, 255, 0.5);
      }
    }
    .exchange-confirm-2 {
      padding: 10px 0;
      width: 70%;
      background: #fff;
      border: #fff solid 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      color: #000;
      font-size: 1.2rem;
    }
    .popover-part {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      margin: 14px 0;
      opacity: 1;
      cursor: pointer;
      &.normal {
        opacity: 0.4;
      }
      .popover-block {
        width: 60%;
        height: 100%;
        background: linear-gradient(
          23deg,
          #4383ea 0%,
          #4861eb 49%,
          #8748eb 100%
        );
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        .internal {
          width: calc(100% - 4px);
          height: calc(100% - 4px);
          box-sizing: border-box;
          border-radius: 12px;
          background: #07070d;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: row;
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
          padding: 0 20px;
        }
      }
      .popover-block-a {
        font-size: 0.6rem;
        font-family: FUTURA-MEDIUM;
        font-weight: 500;
        color: #ffffff;
        text-decoration: underline;
        opacity: 0.9;
      }
      .popover-right {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-direction: column;
        .price {
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
        }
        .desc {
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #89919e;
          &:hover {
            color: #fff;
          }
          &:active {
            color: #89919e;
          }
        }
        .desc2 {
          font-size: 0.6rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
          opacity: 0.6;
        }
      }
    }
    .popover-part-a {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      margin: 14px 0;
      cursor: pointer;
      .popover-block-a {
        font-size: 0.6rem;
        font-family: FUTURA-MEDIUM;
        font-weight: 500;
        color: #ffffff;
        text-decoration: underline;
        opacity: 0.9;
      }
      .popover-right {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-direction: column;
        .price {
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
        }
        .desc {
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #89919e;
        }
        .desc2 {
          font-size: 0.6rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
          opacity: 0.6;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          flex-direction: column;
          &:hover {
            opacity: 1;
          }
          &:active {
            opacity: 0.5;
          }
        }
      }
    }
    .popover-btn {
      width: 60%;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #ffffff;
      opacity: 1;
      font-size: 1.2rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      margin-top: 14px;
      cursor: pointer;
    }
  }
  .popover-foot-desc {
    font-size: 0.8rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    line-height: 1.2rem;
    color: #ffffff;
    opacity: 0.7;
  }
  .popover-foot-a {
    margin-top: 20px;
    font-size: 0.8rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    color: #fff;
    opacity: 0.7;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
    &:active {
      opacity: 0.5;
    }
  }
  .popover-ready-upload {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    position: relative;
    .popover-upload {
      width: 70px;
      height: 70px;
      background: url("@/assets/images/head-upload.png") center / 100% 100%
        no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      font-size: 1.4rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
    }
    .popover-head-1 {
      position: absolute;
      width: 70px;
      height: 70px;
      left: 10px;
      top: 30px;
    }
    .popover-head-2 {
      position: absolute;
      width: 70px;
      height: 70px;
      right: 10px;
      top: 0;
    }
    .popover-head-3 {
      position: absolute;
      width: 70px;
      height: 70px;
      right: 30px;
      bottom: 0;
    }
    .popover-question-1 {
      background: linear-gradient(
        352deg,
        #2680eb 0%,
        #276ec3 42%,
        #bfd5f0 100%
      );
      border-radius: 22px;
      font-size: 0.4rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      padding: 4px 8px;
      position: absolute;
      left: 10px;
      bottom: 40px;
    }
    .popover-question-2 {
      background: linear-gradient(
        352deg,
        #2680eb 0%,
        #276ec3 42%,
        #bfd5f0 100%
      );
      border-radius: 22px;
      font-size: 0.4rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      padding: 4px 8px;
      position: absolute;
      left: 10px;
      bottom: 0;
    }
  }
}
:global(.gpt-model.el-popper.is-light.el-popover) {
  background: transparent !important;
  border: none;
  height: 100vh;
}
:global(.exchange.el-popper.is-light.el-popover) {
  background: transparent !important;
  border: none;
  height: 100vh;
}
:global(.el-divider__text) {
  background: #07070d;
  color: #fff;
}
</style>
