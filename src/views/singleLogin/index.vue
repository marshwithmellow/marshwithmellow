<template>
  <div>
    <div class="content" v-if="!agent">
      <div class="left-port">
        <img class="logo" src="../../assets/images/white-logo.png" alt="" />
        <div class="login-hint">现在登录，进入你的 AI 时刻</div>
        <div class="new-user-hint">新用户注册领取1美元体验金</div>
        <div class="circle-port"><span class="circle">M</span></div>
        <!-- 手机号 -->
        <div class="ipt-box" v-if="status === 1">
          <el-input
            :maxlength="13"
            class="tel"
            v-model="tel"
            :autofocus="true"
            placeholder="xxx xxxx xxxx"
          />
          <div class="btm"></div>
          <div class="btm btm2"></div>
        </div>
        <!-- 验证码 -->
        <div class="square-box" v-if="status === 2">
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
              <!-- {{ sms[index - 1] }} -->
              <el-input
                ref="smsInput1"
                :maxlength="1"
                class="tel"
                v-model="sms1"
                :autofocus="true"
                placeholder=""
              />
            </div>
            <div class="square">
              <!-- {{ sms[index - 1] }} -->
              <el-input
                ref="smsInput2"
                :maxlength="1"
                class="tel"
                v-model="sms2"
                :autofocus="false"
                placeholder=""
              />
            </div>
            <div class="square">
              <!-- {{ sms[index - 1] }} -->
              <el-input
                ref="smsInput3"
                :maxlength="1"
                class="tel"
                v-model="sms3"
                :autofocus="false"
                placeholder=""
              />
            </div>
            <div class="square">
              <!-- {{ sms[index - 1] }} -->
              <el-input
                ref="smsInput4"
                :maxlength="1"
                class="tel"
                v-model="sms4"
                :autofocus="false"
                placeholder=""
              />
            </div>
          </div>
        </div>
        <!-- 昵称 -->
        <div class="nickname-box" v-if="status === 3">
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
        <div class="send-btn" v-if="status === 3" @click="inputNickname">
          注册
        </div>
        <div class="tip">
          <div class="point"><div class="in-circle"></div></div>
          首次登录将自动注册您的 <span class="mbm-openai">MBM OpenAI</span> 账号
          <a class="underline">《隐私政策》</a>
        </div>
        <div class="send-btn" v-if="status === 1">发送验证</div>
      </div>
      <div class="right-port">
        <img class="right-img" src="../../assets/images/loginBg.png" alt="" />
        <div class="right-text-port">
          <div class="text-title">MBM OpenAI GPT-4 服务</div>
          <div class="text-title">
            作为微软 Azure OpenAI 中国合作伙伴，MBM
            为企业用户和个人消费者提供可靠、企业级 OpenAI
            服务，实现快速访问，无需代理的先进体验。
          </div>
          <div class="text-title" @click="nav">探索与OpenAI的区别</div>
        </div>
      </div>
    </div>
    <div v-else class="phone-content">
      <div class="logo-bg">
        <img class="logo" src="../../assets/images/logo.png" alt="" />
        <img class="bg" :src="logoBg" />
      </div>
      <div style="height: 30vh">
        <div class="ipt-box" v-if="status === 1">
          <el-input
            :maxlength="13"
            class="tel"
            v-model="tel"
            :autofocus="true"
            placeholder="xxx xxxx xxxx"
          />
          <div class="btm"></div>
          <div class="btm btm2"></div>
        </div>
        <div class="square-box" v-if="status === 2">
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
                ref="smsInput1"
                :maxlength="1"
                class="tel"
                v-model="sms1"
                :autofocus="true"
                placeholder=""
              />
            </div>
            <div class="square">
              <el-input
                ref="smsInput2"
                :maxlength="1"
                class="tel"
                v-model="sms2"
                :autofocus="false"
                placeholder=""
              />
            </div>
            <div class="square">
              <el-input
                ref="smsInput3"
                :maxlength="1"
                class="tel"
                v-model="sms3"
                :autofocus="false"
                placeholder=""
              />
            </div>
            <div class="square">
              <el-input
                ref="smsInput4"
                :maxlength="1"
                class="tel"
                v-model="sms4"
                :autofocus="false"
                placeholder=""
              />
            </div>
          </div>
        </div>
        <div class="nickname-box" v-if="status === 3">
          <el-input
            :maxlength="13"
            class="tel"
            v-model="nickname"
            :autofocus="true"
            placeholder="怎么称呼你？"
            @keyup.enter="inputNickname"
            @blur="nickNameFocus = false"
            @focus="nickNameFocus = true"
          />
          <div class="btm"></div>
        </div>
        <div class="send-btn" v-if="status === 3" @click="inputNickname">
          注册
        </div>
      </div>
      <div class="tip" v-show="!nickNameFocus">
        <div class="point"><div class="in-circle"></div></div>
        首次登录将自动注册您的 <span class="mbm-openai">MBM OpenAI</span> 账号
        <a class="underline">《隐私政策》</a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, watch, getCurrentInstance } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import {
  checkPhone,
  doSendCode,
  doLoginApi,
  doRegisterCode,
  registerAccount,
} from "@/api/index";
import logoBg from "@/assets/images/single-bg.png";
import { useRouter } from "vue-router";
const proxy: any = getCurrentInstance()?.proxy ?? null;
const tel = ref("");
const sms = ref("");
const sms1 = ref("");
const sms2 = ref("");
const sms3 = ref("");
const sms4 = ref("");
const status = ref(1);
const nickname = ref("");
// 是否注册过
const isCreatedAccount = ref(false);
const loginFlag = ref(false);
const redirectUrl = ref<any>("");
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
const nickNameFocus = ref(false);
const $router = useRouter();
const verifyPhone = (phone: string | number) => {
  const reg =
    /^1((3[0-9])|(4[1579])|(5[0-9])|(6[6])|(7[0-9])|(8[0-9])|(9[0-9]))\d{8}$/;
  return reg.test(phone + "");
};
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
onBeforeMount(() => {
  if ($router.currentRoute.value.query.redirectUrl) {
    redirectUrl.value = $router.currentRoute.value.query.redirectUrl;
  }
});
watch(
  () => tel.value,
  async (newValue, oldValue) => {
    tel.value =
      newValue.length > oldValue.length
        ? newValue
            .replace(/\s/g, "")
            .replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1 $2 $3")
        : tel.value.trim();
    if (tel.value.length === 13) {
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
          status.value = 2;
        } else {
          ElMessage({ type: "error", message: codeRes.data.msg });
        }
        loginFlag.value = false;
      } else ElMessage("请输入正确的手机号");
    }
  }
);
const nav = () => {
  $router.push({
    name: "blog",
    query: {
      blogType: 1,
    },
  });
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
        localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
        userInfo.value = res?.data?.data;
        if (redirectUrl.value) {
          skip(redirectUrl.value, false);
        }
      } else {
        ElMessage({ type: "error", message: res.data.msg });
      }
    } else {
      // 未注册过。
      setTimeout(() => {
        status.value = 3;
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
    localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
    userInfo.value = res?.data?.data;
    if (redirectUrl.value) {
      skip(redirectUrl.value, false);
    }
  } else {
    ElMessage({ type: "error", message: res.data.msg });
  }
};
// 跳转url
const skip = (url: string, openNew: boolean) => {
  if (openNew) {
    window.open(`${url}?token=${userInfo.value.token}`);
  } else {
    window.location.href = `${url}?token=${userInfo.value.token}`;
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
.content {
  display: flex;
  // width: 1200px;
  margin: 0 auto;
  padding: 20px 0;

  .left-port {
    // text-align: center;
    padding: 0 80px;
    .logo {
      height: 46px;
      margin-left: 70px;
    }
    .login-hint {
      font-size: 33px;
      font-family: Gotham Rounded;
      font-weight: bold;
      color: #000000;
      opacity: 1;
      margin: 160px 0 32px 70px;
    }
    .new-user-hint {
      font-size: 21px;
      font-family: Gotham Rounded;
      font-weight: bold;
      color: #a09e9e;
      opacity: 0.87;
      text-align: center;
    }
    .ipt-box {
      position: relative;
      .tel {
        width: 320px;
        border: none;
        margin: 40px 132px 0;
        ::placeholder {
          letter-spacing: 8px;
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
          letter-spacing: 8px;
        }
      }
      .btm {
        height: 33px;
        width: 16px;
        background: #fff;
        position: absolute;
        top: 40px;
        left: 204px;
      }
      .btm2 {
        left: 330px;
      }
    }
    .circle-port {
      margin: 35px 0;
      text-align: center;
      .circle {
        display: inline-block;
        width: 66px;
        height: 66px;
        border-radius: 50%;
        background: #818da3;
        text-align: center;
        line-height: 66px;
        font-size: 23px;
        font-weight: bold;
        color: #fff;
      }
    }
    .tip {
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
      .mbm-openai {
        color: #a09e9e;
        font-family: FUTURA-MEDIUM;
      }
      .underline {
        font-family: Gotham-Rounded;
        color: #07070d;
        text-decoration: underline;
      }
    }
    .send-btn {
      width: 371px;
      height: 70px;
      margin: 0 auto;
      margin-top: 40px;
      border: 1px solid #000000;
      text-align: center;
      line-height: 70px;
      color: #000;
      font-size: 24px;
      font-weight: bold;
    }
    .square-box {
      position: relative;
      // margin: 50px auto 19px;
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
          // top: 47px;
        }
        :deep(.el-input__inner) {
          // padding: 0 0 0 15%;
          font-size: 28px;
          font-family: FZZhengHeiS-B-GB;
          font-weight: 600;
          color: #000;
          // letter-spacing: 114px;
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
          font-size: 28px;
          font-weight: 600;
          text-align: center;
          line-height: 64px;
          display: flex;
          justify-content: center;
          align-items: center;
          // margin-right:3px;
        }
        .square7 {
          border: none;
          background: #fff;
          position: relative;
          z-index: 99;
        }
      }
    }
    .nickname-box {
      border-bottom: 1px solid #000;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding-bottom: 7px;
      .tel {
        width: 100%;
        border: none;
        margin: 40px auto 0;
        ::placeholder {
          letter-spacing: 5px;
        }
        :deep(.el-input__wrapper) {
          background: #fff;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
        }
        :deep(.el-input__inner) {
          background: #fff;
          letter-spacing: 6px;
          text-align: center;
          font-size: 24px;
          font-family: FZZCHJW;
          font-weight: 400;
          color: #000;
          letter-spacing: 6px;
        }
      }
    }
  }
  .right-port {
    width: 665px;
    position: relative;
    .right-img {
      width: 665px;
      // height: 972px;
    }
    .right-text-port {
      position: absolute;
      bottom: 40px;
      left: 44px;
      .text-title:nth-of-type(1) {
        font-size: 36px;
        font-weight: bold;
        color: #ffffff;
        margin-left: 45px;
      }
      .text-title:nth-of-type(2) {
        font-size: 22px;
        font-weight: bold;
        color: #efebe7;
        margin: 20px 0;
        padding-right: 75px;
      }
      .text-title:nth-of-type(3) {
        width: 238px;
        height: 40px;
        border: 1px solid #ffffff;
        border-radius: 23px;
        font-size: 19px;
        color: #fff;
        text-align: center;
        line-height: 40px;
        box-sizing: content-box;
        cursor: pointer;
        @include hover2Style;
      }
    }
  }
}
.phone-content {
  width: 100vw;
  min-height: 100vh;
  background: #121826;
  padding: 17vh 2.5vw 0;
  .logo-bg {
    width: 100%;
    height: 25.5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    // background: url("../../assets/images/single-bg.png") no-repeat;
    .logo {
      height: 46px;
      z-index: 11;
      // opacity: 0.15;
      // animation: fadeOut 1s;
      // animation-iteration-count: 1;
      // /* Safari and Chrome */
      // -webkit-animation: fadeOut 1s;
      // -webkit-animation-iteration-count: 1;
    }
    .bg {
      position: absolute;
      top: -20px;
      left: 0;
      z-index: 10;
      width: 100vw;
    }
  }
  .ipt-box {
    position: relative;
    background: #121826;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
    .tel {
      width: 78vw;
      border: none;
      margin: 60px auto 0;
      ::placeholder {
        letter-spacing: 6px;
      }
      :deep(.el-input__wrapper) {
        border-bottom: 1px solid #fff;
        background: #121826;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        background: #121826;
        text-align: left;
        font-size: 24px;
        font-family: FZZCHJW;
        font-weight: 400;
        color: #fff;
        letter-spacing: 6px;
      }
    }
    .btm {
      height: 10px;
      width: 0.5rem;
      background: #121826;
      position: absolute;
      top: 85px;
      left: 26vw;
    }
    .btm2 {
      left: 55vw;
    }
  }
  .square-box {
    position: relative;
    // margin: 50px auto 19px;
    z-index: 11;
    .tel {
      width: 100%;
      border: none;
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        position: relative;
        background: none;
        // top: 47px;
      }
      :deep(.el-input__inner) {
        // padding: 0 0 0 15%;
        font-size: 28px;
        font-family: FZZhengHeiS-B-GB;
        font-weight: 600;
        color: #000;
        // letter-spacing: 114px;
        text-align: center;
        // overflow-x: hidden;
        // overflow: hidden;
      }
    }
    .bb {
      width: 78vw;
      height: 48px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      .square {
        height: 48px;
        width: 30px;
        border: 1px solid #fff;
        background: #fff;
        font-size: 28px;
        font-weight: 600;
        text-align: center;
        line-height: 48px;
        color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        // margin-right:3px;
      }
      .square7 {
        border: none;
        background: #fff;
        position: relative;
        z-index: 99;
      }
    }
  }
  .nickname-box {
    border-bottom: 1px solid #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-bottom: 7px;
    z-index: 11;
    .tel {
      width: 78vw;
      border: none;
      margin: 40px auto 0;
      ::placeholder {
        letter-spacing: 5px;
      }
      :deep(.el-input__wrapper) {
        background: #121826;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        background: #121826;
        letter-spacing: 6px;
        text-align: center;
        font-size: 24px;
        font-family: FZZCHJW;
        font-weight: 400;
        color: #fff;
        letter-spacing: 6px;
      }
    }
  }
  .tip {
    font-size: 12px;
    font-family: Gotham;
    font-weight: 400;
    color: #fff;
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
      background: #fff;
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
    .mbm-openai {
      color: #a09e9e;
      font-family: FUTURA-MEDIUM;
    }
    .underline {
      font-family: Gotham-Rounded;
      color: #fff;
      text-decoration: underline;
    }
  }
  .send-btn {
    width: 70vw;
    height: 62px;
    margin: 0 auto;
    margin-top: 40px;
    border: 1px solid #ffffff;
    text-align: center;
    line-height: 62px;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.15;
  }
}
</style>
