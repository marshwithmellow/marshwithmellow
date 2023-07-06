<template>
  <div class="dialog">
    <div class="type-word">
      <chat-gpt-typewriter exampleText="进入你的AI时刻"></chat-gpt-typewriter>
      <div class="mask"></div>
    </div>
    <div class="avatar">M</div>
    <div v-if="status === 1" class="one-key" @click="status = 2">
      本机号码一键登录
    </div>
    <div class="ipt-box" v-if="status === 2">
      <div class="tel-container" style="width: 78px">
        <input
          ref="telInput1"
          :maxlength="3"
          class="tel1"
          v-model="tel1"
          :placeholder="telholder1"
          @focus="telholder1 = ''"
          @paste="pasteTel"
          @blur="telholder1 = 'xxx'"
          @input="telInput(0)"
        />
      </div>
      <div class="tel-container" style="width: 102px">
        <input
          ref="telInput2"
          :maxlength="4"
          class="tel2"
          v-model="tel2"
          :placeholder="telholder2"
          @focus="telholder2 = ''"
          @blur="telholder2 = 'xxxx'"
          @paste="pasteTel"
          @input="telInput(1)"
          @keyup.delete.native="deleteTel(1)"
        />
      </div>
      <div class="tel-container" style="width: 102px">
        <input
          ref="telInput3"
          :maxlength="4"
          class="tel3"
          v-model="tel3"
          :placeholder="telholder3"
          @focus="telholder3 = ''"
          @blur="telholder3 = 'xxxx'"
          @paste="pasteTel"
          @input="telInput(2)"
          @keyup.delete.native="deleteTel(2)"
        />
      </div>
    </div>
    <div class="square-box" v-if="status === 3">
      <div class="bb">
        <div class="square">
          <input
            type="tel"
            ref="smsInput1"
            :maxlength="1"
            class="tel"
            v-model="sms1"
            placeholder=""
            @paste="pasteSms"
            @input="smsInput(0)"
            @keyup.delete.native="deleteSms(0)"
          />
        </div>
        <div class="square square2">
          <input
            type="tel"
            ref="smsInput2"
            :maxlength="1"
            class="tel"
            v-model="sms2"
            placeholder=""
            @paste="pasteSms"
            @input="smsInput(1)"
            @keyup.delete.native="deleteSms(1)"
          />
        </div>
        <div class="square square3">
          <input
            type="tel"
            ref="smsInput3"
            :maxlength="1"
            class="tel"
            v-model="sms3"
            placeholder=""
            @paste="pasteSms"
            @input="smsInput(2)"
            @keyup.delete.native="deleteSms(2)"
          />
        </div>
        <div class="square square4">
          <input
            type="tel"
            ref="smsInput4"
            :maxlength="1"
            class="tel"
            v-model="sms4"
            placeholder=""
            @paste="pasteSms"
            @input="smsInput(3)"
            @keyup.delete.native="deleteSms(3)"
          />
        </div>
      </div>
    </div>
    <div class="nickname-box" v-if="status === 4">
      <el-input
        :maxlength="13"
        class="tel"
        v-model="nickname"
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
</template>
<script lang="ts" setup>
import ChatGptTypewriter from "@/components/ChatGptTypewriter.vue";
import {
  onBeforeMount,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
} from "vue";
import {
  checkPhone,
  doSendCode,
  doLoginApi,
  doRegisterCode,
  registerAccount,
} from "@/api/index";
import { Back } from "@element-plus/icons-vue";
const proxy: any = getCurrentInstance()?.proxy ?? null;
const emits = defineEmits(["showMessage", "complete"]);
const props = defineProps({
  inviteCode: {
    type: String,
    default: "",
  },
});
const status = ref(1);
const tel = ref("");
const tel1 = ref("");
const tel2 = ref("");
const tel3 = ref("");
const telholder1 = ref("xxx");
const telholder2 = ref("xxxx");
const telholder3 = ref("xxxx");
const sms = ref("");
const sms1 = ref("");
const sms2 = ref("");
const sms3 = ref("");
const sms4 = ref("");
const nickname = ref("");
const time = ref(60);
const loginFlag = ref(false);
const requestLock = ref(false);
// 是否注册过
const isCreatedAccount = ref(false);
watch(
  () => status.value,
  (newValue, oldValue) => {
    if (newValue == 2 && oldValue == 1) {
      nextTick(() => {
        proxy?.$refs["telInput1"].focus();
      });
    } else if (newValue == 2 && oldValue == 3) {
      nextTick(() => {
        proxy?.$refs["telInput3"].focus();
      });
    } else if (newValue == 3 && oldValue == 2) {
      nextTick(() => {
        proxy?.$refs["smsInput1"].focus();
      });
    }
  }
);
const deleteTel = (flag: number) => {
  if (flag == 2 && tel3.value.length == 0) {
    proxy?.$refs["telInput2"].focus();
  } else if (tel2.value.length == 0) {
    proxy?.$refs["telInput1"].focus();
  }
};
const deleteSms = (flag: number) => {
  if (flag == 3 && sms4.value.length == 0) {
    setTimeout(() => {
      proxy?.$refs["smsInput3"].focus();
    }, 50);
  } else if (flag == 2 && sms3.value.length == 0) {
    setTimeout(() => {
      proxy?.$refs["smsInput2"].focus();
    }, 50);
  } else if (sms2.value.length == 0) {
    setTimeout(() => {
      proxy?.$refs["smsInput1"].focus();
    }, 50);
  }
};
const pasteSms = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData("text");
  const arrText = text?.split(/ [(\r\n)\r\n] +/); // 以转行符切割文本字符串
  if (arrText && arrText.length > 0 && arrText[0].length >= 4) {
    sms1.value = arrText[0][0];
    sms2.value = arrText[0][1];
    sms3.value = arrText[0][2];
    sms4.value = arrText[0][3];
    inputCode(sms1.value + sms2.value + sms3.value + sms4.value);
  }
};
const pasteTel = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData("text");
  const arrText = text?.split(/ [(\r\n)\r\n] +/);
  if (arrText && arrText.length > 0 && arrText[0].length >= 11) {
    tel1.value = arrText[0][0] + arrText[0][1] + arrText[0][2];
    tel2.value = arrText[0][3] + arrText[0][4] + arrText[0][5] + arrText[0][6];
    tel3.value = arrText[0][7] + arrText[0][8] + arrText[0][9] + arrText[0][10];
    getTelCode(tel1.value + tel2.value + tel3.value);
  }
};
const telInput = (index: number) => {
  switch (index) {
    case 0:
      if (tel1.value.length == 3) {
        proxy?.$refs["telInput2"].focus();
      }
      break;
    case 1:
      if (tel2.value.length == 4) {
        proxy?.$refs["telInput3"].focus();
      }
      break;
    default:
      break;
  }
  if (
    tel1.value.length == 3 &&
    tel2.value.length == 4 &&
    tel3.value.length == 4
  ) {
    getTelCode(tel1.value + tel2.value + tel3.value);
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
        // ElMessage({ type: "success", message: "验证码已发送" });
        emits("showMessage", { type: "success", message: "验证码已发送" });
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
        // ElMessage({ type: "error", message: codeRes.data.msg });
        emits("showMessage", { type: "error", message: codeRes.data.msg });
      }
      loginFlag.value = false;
    } else {
      emits("showMessage", "请输入正确的手机号");
    }
    // ElMessage("请输入正确的手机号");
  }
};
const smsInput = (index: number) => {
  switch (index) {
    case 0:
      if (sms1.value.length == 1) {
        proxy?.$refs["smsInput2"].focus();
      }
      break;
    case 1:
      if (sms2.value.length == 1) {
        proxy?.$refs["smsInput3"].focus();
      }
      break;
    case 2:
      if (sms3.value.length == 1) {
        proxy?.$refs["smsInput4"].focus();
      }
      break;
    default:
      break;
  }
  if (
    sms1.value.length == 1 &&
    sms2.value.length == 1 &&
    sms3.value.length == 1 &&
    sms4.value.length == 1
  ) {
    inputCode(sms1.value + sms2.value + sms3.value + sms4.value);
  }
};

// sms countDown
const countDown = async () => {
  if (time.value < 60) return;
  if (tel.value.length === 11) {
    let phone = tel.value.replace(/\s/g, "");
    if (phone && verifyPhone(phone)) {
      const res = await doRegisterCode({ phone });
      if (res.data.code === 11000) {
        // ElMessage({ type: "success", message: "验证码已发送" });
        emits("showMessage", { type: "success", message: "验证码已发送" });
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
        emits("showMessage", { type: "warning", message: res.data.msg });
        // ElMessage({ type: "warning", message: res.data.msg });
      }
    } else {
      emits("showMessage", {
        type: "warning",
        message: "请输入正确的手机号码",
      });
      // ElMessage({ type: "warning", message: "请输入正确的手机号码" });
    }
  } else {
    emits("showMessage", { type: "warning", message: "请输入正确的手机号码" });
    // ElMessage({ type: "warning", message: "请输入正确的手机号码" });
  }
};
// sms-code
const inputCode = async (code: string) => {
  if (code && code.length === 4 && !isNaN(parseInt(code))) {
    sms.value = code.replace(/\s/g, "");
    if (isCreatedAccount.value) {
      if (requestLock.value) return;
      requestLock.value = true;
      // 注册过账号。调登陆接口
      let phone = tel.value.replace(/\s/g, "");
      let query = { code: sms.value, phone };
      const res = await doLoginApi(query);
      if (res.data.code === 11000) {
        // ElMessage({ type: "success", message: "手机号验证成功" });
        emits("showMessage", { type: "success", message: "手机号验证成功" });
        status.value = 1;
        sms1.value = "";
        sms2.value = "";
        sms3.value = "";
        sms4.value = "";
        emits("complete", res?.data?.data);
      } else {
        // ElMessage({ type: "error", message: res.data.msg });
        emits("showMessage", { type: "error", message: res.data.msg });
      }
      requestLock.value = false;
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
  if (!nickname.value) {
    emits("showMessage", "请输入昵称");
    return;
  }
  // ElMessage("请输入昵称");
  let phone = tel.value.replace(/\s/g, "");
  let query: any = { code: sms.value, name: nickname.value, phone };
  if (props.inviteCode) {
    query.inviteCode = props.inviteCode;
  }
  const res = await registerAccount(query);
  if (res.data.code === 11000) {
    emits("showMessage", { type: "success", message: "手机号验证成功" });
    // ElMessage({ type: "success", message: "手机号验证成功" });
    status.value = 1;
    sms1.value = "";
    sms2.value = "";
    sms3.value = "";
    sms4.value = "";
    emits("complete", res?.data?.data);
  } else {
    // ElMessage({ type: "error", message: res.data.msg });
    emits("showMessage", { type: "error", message: res.data.msg });
  }
};
// verify input mobile
const verifyPhone = (phone: string | number) => {
  const reg =
    /^1((3[0-9])|(4[1579])|(5[0-9])|(6[6])|(7[0-9])|(8[0-9])|(9[0-9]))\d{8}$/;
  return reg.test(phone + "");
};
const reset = () => {
  status.value = 1;
  tel.value = "";
  tel1.value = "";
  tel2.value = "";
  tel3.value = "";
};
defineExpose({
  reset,
});
</script>
<style lang="scss" scoped>
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
      border: none;
      :deep(.el-input__wrapper) {
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
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      text-align: center;
      font-size: 26px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      color: #000000;
      letter-spacing: 6px;
      ::placeholder {
        letter-spacing: 9.6px;
      }
      &:focus,
      & :focus {
        outline: none;
      }
    }
    .tel2 {
      width: 90px;
      border: none;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      text-align: center;
      font-size: 26px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      color: #000000;
      letter-spacing: 6px;
      ::placeholder {
        letter-spacing: 9.6px;
      }
      &:focus,
      & :focus {
        outline: none;
      }
    }
    .tel3 {
      width: 90px;
      border: none;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      text-align: center;
      font-size: 26px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      color: #000000;
      letter-spacing: 6px;
      ::placeholder {
        letter-spacing: 9.6px;
      }
      &:focus,
      & :focus {
        outline: none;
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
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      position: relative;
      z-index: 3;
      background: none;
      font-size: 28px;
      font-family: FUTURA-MEDIUM;
      font-weight: 600;
      color: #000000;
      text-align: center;
      &:focus,
      & :focus {
        outline: none;
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
      .square {
        height: 64px;
        width: 47px;
        border: 1px solid #000000;
        display: flex;
        justify-content: center;
        align-items: center;
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
    .underline {
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #07070d;
      text-decoration: underline;
    }
  }
}
</style>
