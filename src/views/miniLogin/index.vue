<template>
  <div :style="{ background: agent ? '#121826' : '#ffffff' }">
    <div class="content" v-if="!agent">
      <div class="left-port">
        <div class="left-top-container">
          <div class="left-top">
            <img
              class="logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png"
              alt=""
            />
            <div class="login-hint">现在登录，进入你的 AI 时刻</div>
          </div>
        </div>
        <!-- <div class="new-user-hint">新用户注册领取1美元体验金</div> -->
        <div class="circle-port"><span class="circle">M</span></div>
        <!-- 手机号 -->
        <div class="ipt-box" v-if="status === 1">
          <!-- <el-input
            type="tel"
            :maxlength="13"
            class="tel"
            v-model="tel"
            :autofocus="true"
            placeholder="xxx xxxx xxxx"
          />
          <div class="btm"></div>
          <div class="btm btm2"></div> -->
          <div class="tel-container">
            <input
              type="tel"
              ref="telInput1"
              :maxlength="3"
              class="tel1"
              v-model="tel1"
              :placeholder="telholder1"
              @focus="telholder1 = ''"
              @blur="telholder1 = 'xxx'"
              @input="telInput(0)"
              @paste="pasteTel"
            />
          </div>
          <div class="tel-container">
            <input
              type="tel"
              ref="telInput2"
              :maxlength="4"
              class="tel2"
              v-model="tel2"
              :placeholder="telholder2"
              @focus="telholder2 = ''"
              @blur="telholder2 = 'xxx'"
              v-on:keydown="deleteTel2"
              @input="telInput(1)"
              @paste="pasteTel"
            />
          </div>
          <div class="tel-container">
            <input
              type="tel"
              ref="telInput3"
              :maxlength="4"
              class="tel3"
              v-model="tel3"
              :placeholder="telholder3"
              @focus="telholder3 = ''"
              @blur="telholder3 = 'xxx'"
              v-on:keydown="deleteTel3"
              @input="telInput(2)"
              @paste="pasteTel"
            />
          </div>
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
              <input
                type="tel"
                ref="smsInput1"
                :maxlength="1"
                class="tel"
                v-model="sms1"
                :autofocus="true"
                placeholder=""
                @paste="pasteSms"
                @input="inputSms(0)"
              />
            </div>
            <div class="square">
              <!-- {{ sms[index - 1] }} -->
              <input
                type="tel"
                ref="smsInput2"
                :maxlength="1"
                class="tel"
                v-model="sms2"
                :autofocus="false"
                placeholder=""
                v-on:keydown="deleteSms2"
                @paste="pasteSms"
                @input="inputSms(1)"
              />
            </div>
            <div class="square">
              <!-- {{ sms[index - 1] }} -->
              <input
                type="tel"
                ref="smsInput3"
                :maxlength="1"
                class="tel"
                v-model="sms3"
                :autofocus="false"
                placeholder=""
                v-on:keydown="deleteSms3"
                @paste="pasteSms"
                @input="inputSms(2)"
              />
            </div>
            <div class="square">
              <!-- {{ sms[index - 1] }} -->
              <input
                type="tel"
                ref="smsInput4"
                :maxlength="1"
                class="tel"
                v-model="sms4"
                :autofocus="false"
                placeholder=""
                v-on:keydown="deleteSms4"
                @paste="pasteSms"
                @input="inputSms(3)"
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
        <div
          class="send-btn"
          :class="time < 60 ? 'disable' : ''"
          v-if="status === 1 || status === 2"
          @click="countDown"
        >
          {{ status === 1 ? "发送验证码" : "重新发送" }}
          <span class="countdown" v-if="time < 60"> ({{ time }}s) </span>
        </div>
        <div class="back" v-if="status === 2" @click="status = 1">
          <el-icon><Back /></el-icon>
          <div style="margin-left: 8px">返回</div>
        </div>
      </div>
      <div class="right-port">
        <img
          class="right-img"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/loginBg.png"
          alt=""
        />
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
        <img
          class="logo"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
          alt=""
        />
        <img
          class="bg"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/single-bg.png"
        />
      </div>
      <div style="height: 24vh">
        <div class="ipt-box" v-if="status === 1">
          <!-- <el-input
            type="tel"
            :maxlength="13"
            class="tel"
            v-model="tel"
            :autofocus="true"
            placeholder="xxx xxxx xxxx"
          />
          <div class="btm"></div>
          <div class="btm btm2"></div> -->
          <div class="tel-container">
            <input
              type="tel"
              ref="telInput1"
              :maxlength="3"
              class="tel1"
              v-model="tel1"
              :placeholder="telholder1"
              @focus="telholder1 = ''"
              @blur="telholder1 = 'xxx'"
              @input="telInput(0)"
              @paste="pasteTel"
            />
          </div>
          <div class="tel-container">
            <input
              type="tel"
              ref="telInput2"
              :maxlength="4"
              class="tel2"
              v-model="tel2"
              :placeholder="telholder2"
              @focus="telholder2 = ''"
              @blur="telholder2 = 'xxx'"
              v-on:keydown="deleteTel2"
              @input="telInput(1)"
              @paste="pasteTel"
            />
          </div>
          <div class="tel-container">
            <input
              type="tel"
              ref="telInput3"
              :maxlength="4"
              class="tel3"
              v-model="tel3"
              :placeholder="telholder3"
              @focus="telholder3 = ''"
              @blur="telholder3 = 'xxx'"
              v-on:keydown="deleteTel3"
              @input="telInput(2)"
              @paste="pasteTel"
            />
          </div>
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
            <form style="position: absolute; left: 0; top: 0">
              <input
                type="tel"
                ref="smsInput1"
                :maxlength="4"
                class="tel"
                v-model="sms"
                placeholder=""
                :autofocus="true"
                @paste="pasteSms"
                @input="inputSms(0)"
                @focus="smsFocus"
                @blur="smsBlur"
                v-on:keydown="deleteSms"
                autocomplete="one-time-code"
              />
            </form>
            <!-- <el-input
              id="smsInput1"
              type="tel"
              ref="smsInput1"
              :maxlength="4"
              class="tel"
              v-model="sms"
              :autofocus="true"
              placeholder=""
              @paste="pasteSms"
              @input="inputSms($event, 0)"
              @focus="smsFocus"
              @blur="smsBlur"
              v-on:keydown="deleteSms"
            /> -->
            <div class="square" :class="focusIndex == 0 ? 'square-focus' : ''">
              <div class="sms">{{ sms1 }}</div>
            </div>
            <div class="square" :class="focusIndex == 1 ? 'square-focus' : ''">
              <!-- <el-input
                id="smsInput2"
                type="tel"
                ref="smsInput2"
                :maxlength="1"
                class="tel"
                v-model="sms2"
                :autofocus="false"
                placeholder=""
                v-on:keydown="deleteSms2"
                @paste="pasteSms"
              /> -->
              <div class="sms">{{ sms2 }}</div>
            </div>
            <div class="square" :class="focusIndex == 2 ? 'square-focus' : ''">
              <!-- <el-input
                id="smsInput3"
                type="tel"
                ref="smsInput3"
                :maxlength="1"
                class="tel"
                v-model="sms3"
                :autofocus="false"
                placeholder=""
                v-on:keydown="deleteSms3"
                @paste="pasteSms"
              /> -->
              <div class="sms">{{ sms3 }}</div>
            </div>
            <div class="square" :class="focusIndex == 3 ? 'square-focus' : ''">
              <!-- <el-input
                id="smsInput4"
                type="tel"
                ref="smsInput4"
                :maxlength="1"
                class="tel"
                v-model="sms4"
                :autofocus="false"
                placeholder=""
                v-on:keydown="deleteSms4"
                @paste="pasteSms"
              /> -->
              <div class="sms">{{ sms4 }}</div>
            </div>
          </div>
        </div>
        <div class="nickname-box" v-if="status === 3">
          <el-input
            :maxlength="13"
            class="tel"
            v-model="nickname"
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
        <div
          class="resend"
          :class="time < 60 ? 'disable' : ''"
          v-if="status === 1 || status === 2"
          @click="countDown"
        >
          {{ status === 1 ? "发送验证码" : "重新发送" }}
          <span class="countdown" v-if="time < 60"> ({{ time }}s) </span>
        </div>
        <div class="back" v-if="status === 2" @click="status = 1">
          <el-icon><Back /></el-icon>
          <div style="margin-left: 8px">返回</div>
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
import jweixin from "weixin-js-sdk";
import {
  onBeforeMount,
  ref,
  watch,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { ElMessage, ElNotification } from "element-plus";
import {
  checkPhone,
  doSendCode,
  doLoginApi,
  doRegisterCode,
  registerAccount,
} from "@/api/index";
// import logoBg from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/single-bg.png";
import { useRouter } from "vue-router";
import { Back } from "@element-plus/icons-vue";
import { httpUrlAddKey } from "@/utils/utils";
const requestLock = ref(false);
const proxy: any = getCurrentInstance()?.proxy ?? null;
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
const time = ref(60);
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
const isIOS = ref(navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i));
const focusIndex = ref(-1);
onBeforeMount(() => {
  if ($router.currentRoute.value.query.redirectUrl) {
    redirectUrl.value = $router.currentRoute.value.query.redirectUrl;
  }
});
onMounted(() => {
  nextTick(() => {
    if (!isIOS.value) {
      proxy?.$refs["telInput1"].focus();
    }
  });
});
const deleteSms = (e: KeyboardEvent) => {
  if (e.key === "Backspace") {
    if (sms.value.length == 0) {
      sms1.value = "";
      sms2.value = "";
      sms3.value = "";
      sms4.value = "";
    } else if (sms.value.length == 1) {
      sms1.value = sms.value[0];
      sms2.value = "";
      sms3.value = "";
      sms4.value = "";
    } else if (sms.value.length == 2) {
      sms1.value = sms.value[0];
      sms2.value = sms.value[1];
      sms3.value = "";
      sms4.value = "";
    } else if (sms.value.length == 3) {
      sms1.value = sms.value[0];
      sms2.value = sms.value[1];
      sms3.value = sms.value[2];
      sms4.value = "";
    }
  }
};
const deleteSms2 = (e: KeyboardEvent) => {
  if (e.key === "Backspace") {
    proxy?.$refs["smsInput1"].focus();
  }
};
const deleteSms3 = (e: KeyboardEvent) => {
  if (e.key === "Backspace") {
    proxy?.$refs["smsInput2"].focus();
  }
};
const deleteSms4 = (e: KeyboardEvent) => {
  if (e.key === "Backspace") {
    proxy?.$refs["smsInput3"].focus();
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
    inputCode(sms.value);
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
const nav = () => {
  $router.push({
    name: "blog",
    query: {
      blogType: 1,
    },
  });
};
const deleteTel2 = (e: KeyboardEvent) => {
  if (e.key === "Backspace" && tel2.value.length == 0) {
    proxy?.$refs["telInput1"].focus();
  }
};
const deleteTel3 = (e: KeyboardEvent) => {
  if (e.key === "Backspace" && tel3.value.length == 0) {
    proxy?.$refs["telInput2"].focus();
  }
};
watch(
  () => status.value,
  (newValue, oldValue) => {
    if (newValue == 2 && oldValue == 1) {
      nextTick(() => {
        proxy?.$refs["smsInput1"].focus();
      });
    } else if (newValue == 1 && oldValue == 2) {
      nextTick(() => {
        proxy?.$refs["telInput3"].focus();
      });
    }
  }
);
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
        ElMessage({ type: "success", message: "验证码已发送" });
        const timer = setInterval(() => {
          time.value--;
          if (time.value <= 0) {
            time.value = 60;
            clearInterval(timer);
          }
        }, 1000);
        status.value = 2;
      } else {
        if (codeRes.data.code === 12006) {
          status.value = 2;
        }
        ElMessage({ type: "error", message: codeRes.data.msg });
      }
      loginFlag.value = false;
    } else {
      ElMessage("请输入正确的手机号");
    }
  }
};
const inputSms = (index: number) => {
  if (!agent.value) {
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
  } else {
    if (sms.value.length === 4) {
      inputCode(sms.value);
    }
    if (sms.value.length > 0) {
      sms1.value = sms.value[0];
    }
    if (sms.value.length > 1) {
      sms2.value = sms.value[1];
    }
    if (sms.value.length > 2) {
      sms3.value = sms.value[2];
    }
    if (sms.value.length > 3) {
      sms4.value = sms.value[3];
    }
    focusIndex.value = sms.value.length;
  }
};
const smsFocus = () => {
  focusIndex.value = sms.value.length;
};
const smsBlur = () => {
  focusIndex.value = -1;
};
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
        ElMessage({ type: "success", message: "手机号验证成功" });
        status.value = -1;
        // localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
        userInfo.value = res?.data?.data;
        sms1.value = "";
        sms2.value = "";
        sms3.value = "";
        sms4.value = "";
        // if (redirectUrl.value) {
        //   skip(redirectUrl.value, false);
        // }
        skipMini();
      } else {
        ElMessage({ type: "error", message: res.data.msg });
      }
      requestLock.value = false;
    } else {
      // 未注册过。
      setTimeout(() => {
        status.value = 3;
      }, 1000);
    }
  }
};
// sms countDown
const countDown = async () => {
  if (time.value < 60) return;
  if (tel.value.length === 11) {
    let mobile = tel.value.replace(/\s/g, "");
    if (mobile && verifyPhone(mobile)) {
      if (loginFlag.value) {
        return;
      }
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
        status.value = 2;
        nextTick(() => {
          proxy?.$refs["smsInput1"].focus();
        });
      } else {
        if (codeRes.data.code === 12006) {
          status.value = 2;
          nextTick(() => {
            proxy?.$refs["smsInput1"].focus();
          });
        }
        ElMessage({ type: "error", message: codeRes.data.msg });
      }
      loginFlag.value = false;
    } else {
      ElMessage("请输入正确的手机号");
    }
  } else {
    ElMessage({ type: "warning", message: "请输入正确的手机号码" });
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
    // localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
    userInfo.value = res?.data?.data;
    sms1.value = "";
    sms2.value = "";
    sms3.value = "";
    sms4.value = "";
    // if (redirectUrl.value) {
    //   skip(redirectUrl.value, false);
    // }
    skipMini();
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
const skipMini = () => {
  jweixin.miniProgram.postMessage({ data: userInfo.value.token });
  jweixin.miniProgram.navigateBack({
    delta: 1,
  });
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
  justify-content: center;
  align-items: flex-start;
  // width: 1200px;
  width: 100vw;
  margin: 0 auto;
  padding: 20px 0;
  background: #fff;
  .left-port {
    // text-align: center;
    padding: 0 5vw;
    .left-top-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .left-top {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
    }
    .logo {
      height: 46px;
    }
    .login-hint {
      font-size: 1.8rem;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #000000;
      opacity: 1;
      margin: 10vh 0 32px;
    }
    .new-user-hint {
      font-size: 21px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #a09e9e;
      opacity: 0.87;
      text-align: center;
    }
    .ipt-box {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
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
          font-family: FUTURA-MEDIUM;
          font-weight: 400;
          color: #000000;
          letter-spacing: 8px;
        }
      }

      .tel-container {
        margin: 40px 10px 0;
        border-bottom: 1px solid #000;
        padding: 0 6px;
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
      margin: 35px 0 0;
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
      .mbm-openai {
        color: #a09e9e;
        font-family: FUTURA-MEDIUM;
      }
      .underline {
        font-family: FUTURA-MEDIUM;
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
      cursor: pointer;
      .countdown {
        margin-left: 5px;
        font-weight: 100;
        font-family: FUTURA-MEDIUM;
      }
      &.disable {
        color: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 0, 0, 0.3);
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
    .square-box {
      position: relative;
      margin: 40px auto 19px;
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
        color: #000;
        text-align: center;
        &:focus,
        & :focus {
          outline: none;
        }
      }
      .bb {
        width: 100%;
        height: 50px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
        .square {
          height: 50px;
          width: 40px;
          border: 1px solid #000000;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          line-height: 50px;
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
          font-family: FUTURA-MEDIUM;
          font-weight: 400;
          color: #000;
          letter-spacing: 6px;
        }
      }
    }
  }
  .right-port {
    // width: 50vw;
    height: calc(100vh - 40px);
    position: relative;
    .right-img {
      // width: 50vw;
      height: calc(100vh - 40px);
      // height: 972px;
    }
    .right-text-port {
      position: absolute;
      bottom: 40px;
      left: 44px;
      .text-title:nth-of-type(1) {
        font-size: 1.6rem;
        font-weight: bold;
        color: #ffffff;
        margin-left: 45px;
      }
      .text-title:nth-of-type(2) {
        font-size: 1rem;
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
        font-size: 1rem;
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
    // background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/single-bg.png") no-repeat;
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
      width: 95vw;
    }
  }
  .ipt-box {
    position: relative;
    background: #121826;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
    margin-top: 50px;
    .tel {
      width: 78vw;
      border: none;
      margin: 10px auto 0;
      border-bottom: 1px solid #fff;
      background: #121826;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      background: #121826;
      text-align: left;
      font-size: 24px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      color: #fff;
      letter-spacing: 6px;
      ::placeholder {
        letter-spacing: 6px;
      }
      &:focus,
      & :focus {
        outline: none;
      }
    }
    .tel-container {
      margin: 10px 5px 0;
      border-bottom: 1px solid #fff;
      padding: 0 6px;
      background: #121826;
    }
    .tel1 {
      width: 66px;
      border: none;
      box-shadow: none;
      border-radius: 0;
      background: #121826;
      padding: 0;
      text-align: center;
      font-size: 26px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: 6px;
      background: #121826;
      // margin: 40px 10px 0;
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
      // margin: 40px 10px 0;
      box-shadow: none;
      border-radius: 0;
      background: #121826;
      padding: 0;
      text-align: center;
      font-size: 26px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      background: #121826;
      color: #fff;
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
      // margin: 40px 10px 0;
      box-shadow: none;
      border-radius: 0;
      background: #121826;
      padding: 0;
      text-align: center;
      font-size: 26px;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      background: #121826;
      color: #fff;
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
    margin-top: 50px;
    z-index: 11;
    .tel {
      width: 78vw;
      height: 48px;
      border: none;

      z-index: 99;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      // position: relative;
      background: none;
      font-size: 28px;
      font-family: FUTURA-MEDIUM;
      font-weight: 600;
      color: transparent;
      // 设置光标颜色
      caret-color: transparent;
      text-align: left;
      &:focus,
      & :focus {
        outline: none;
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
      margin-top: 10px;
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
        box-sizing: content-box;
        // margin-right:3px;
        &.square-focus {
          border: 3px solid #4383ea;
        }
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
    margin-top: 50px;
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
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        color: #fff;
        letter-spacing: 6px;
      }
    }
  }
  .tip {
    font-size: 12px;
    font-family: FUTURA-MEDIUM;
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
      font-family: FUTURA-MEDIUM;
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
  .resend {
    height: 30px;
    font-size: 18px;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    color: #ffffff;
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
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .back {
    font-size: 12px;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    color: #fff;
    margin: 16px auto 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
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
