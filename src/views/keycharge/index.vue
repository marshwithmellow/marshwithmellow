<template>
  <div style="position: relative">
    <div
      v-if="userInfo && userInfo.name"
      class="avatar"
      @click="
        updateUserInfo();
        showUserInfo = !showUserInfo;
      "
    >
      {{ nickname }}
    </div>
    <div
      v-if="userInfo && userInfo.name"
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
        <span class="label underline" style="cursor: pointer" @click="logout()">
          退出登录
        </span>
      </div>
    </div>
    <div class="recharge" v-if="!agent">
      <div class="container">
        <div class="recharge-icon iconfont icon-shandian"></div>
        <div class="recharge-count">
          生成{{ keyList[keyIndex].name }} GPT4 API Key
        </div>
        <p class="tip">{{ keyList[keyIndex].desc }}</p>
        <div class="charge-box">
          <div class="left">
            <div></div>
            <h1 class="mbm">MBM OpenAI GPT 服务</h1>
            <div class="slogan-logo">
              <div class="slogan">安全、可靠、企业级</div>
              <div class="line"></div>
              <img
                class="logo"
                src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png"
                alt=""
              />
            </div>
          </div>
          <div class="right">
            <div
              class="compute"
              :style="{ 'text-align': paying ? 'center' : 'left' }"
            >
              <span class="d">支付：</span>
              {{ keyList[keyIndex].price }}元
            </div>
            <ul class="money-list" v-if="!paying">
              <li class="money-item">{{ keyList[keyIndex].price }}元</li>
            </ul>
            <div class="weChat-pay-code">
              <img
                v-if="qrCodeImgUrl"
                class="code"
                :src="qrCodeImgUrl"
                alt=""
              />
              <div class="icon-weChat">微信支付</div>
              <div class="do-pay" @click="onPay" v-if="!paying">确认支付</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="phone-recharge" v-else>
      <div class="recharge-icon iconfont icon-shandian"></div>
      <div class="recharge-count">
        生成{{ keyList[keyIndex].name }} GPT4 API Key
      </div>
      <p class="tip">{{ keyList[keyIndex].desc }}</p>
      <div class="charge-box">
        <!-- <div class="left">
          <div></div>
          <h1 class="mbm">MBM OpenAI GPT 服务</h1>
          <div class="slogan-logo">
            <div class="slogan">安全、可靠、企业级</div>
            <div class="line"></div>
            <img class="logo" src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/blue-logo.png" alt="" />
          </div>
        </div> -->
        <div class="right">
          <div
            class="compute"
            :style="{ 'text-align': paying ? 'center' : 'left' }"
          >
            <span class="d">支付：</span>
            {{ keyList[keyIndex].price }}元
          </div>
          <ul class="money-list" v-if="!paying">
            <li class="money-item">{{ keyList[keyIndex].price }}元</li>
          </ul>
          <div class="weChat-pay-code">
            <img v-if="qrCodeImgUrl" class="code" :src="qrCodeImgUrl" alt="" />
            <div class="icon-weChat">微信支付</div>
            <div class="do-pay" @click="onPay" v-if="!paying">确认支付</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import QRCode from "qrcode";
import { onBeforeMount, ref, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { wechatPayAuth, orderDetail, doGetInfo, doLogout } from "@/api/index";
import { isWeiXinBrowser } from "@/utils/utils";
import { useRouter } from "vue-router";
import useClipboard from "vue-clipboard3";
import { pinyin } from "pinyin-pro";
import { isHashMode } from "@/utils/utils";
// const selectIndex = ref(10);
// const showUnit = ref(false);
// const model = ref<any>();
const userInfo = ref();
const nickname = ref("");
const qrCodeImgUrl = ref();
// const list = [10, 30, 50, 100, 200, 300];
const keyList = ref([
  { name: "个人", price: 698, desc: "内含20美金", accountType: 1 },
  { name: "团队", price: 1298, desc: "内含50美金", accountType: 3 },
  { name: "企业", price: 7500, desc: "内含500美金", accountType: 2 },
]);
const keyIndex = ref<any>(0);
const timer = ref();
const paying = ref(false);
const $router = useRouter();
const showUserInfo = ref(false);
// 使用插件
const { toClipboard } = useClipboard();
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
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
    const firstC = getFirstChar(userInfo.value.name);
    nickname.value = firstC;
    const keyType: any = $router.currentRoute.value.query.keyType;
    if (userInfo.value.isAuth == 0) {
      keyIndex.value = keyType ? keyType : 0;
    } else {
      if (userInfo.value.accountType == 1) {
        if (keyType == 2) {
          keyIndex.value = keyType;
        } else {
          keyIndex.value = 1;
        }
      } else if (userInfo.value.accountType == 3) {
        keyIndex.value = 2;
      } else if (userInfo.value.accountType == 2) {
        ElMessageBox.alert(
          "您已经是尊贵的企业用户，可以自由的使用系统！",
          "提示",
          {
            confirmButtonText: "回到首页",
            callback: () => {
              $router.replace({ name: "home" });
            },
          }
        );
      }
    }
  } else if (res.data.code === 12004) {
    localStorage.removeItem("userInfo");
    $router.replace({
      name: "singleLogin",
      query: {
        redirectUrl: window.location.href,
      },
    });
    nickname.value = "";
  }
};
const updateUserInfo = () => {
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
  }
};
onUnmounted(() => {
  clearTimeout(timer.value);
  timer.value = "";
});
// const selectMoney = (item: number, index: number) => {
//   selectIndex.value = index;
//   model.value = "";
//   ElMessage({
//     type: "success",
//     message: `您已经选择了充值金额 ${item} 元人民币`,
//   });
// };
// const input = () => {
//   if (parseInt(model.value) > 999999) model.value = "999999";
// };
// const showYuan = (flag: boolean) => {
//   showUnit.value = flag;
// };
const onPay = async () => {
  paying.value = true;
  if (isWeiXinBrowser()) {
    $router.replace({ name: "home" }).then(() => {
      window.location.href =
        `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa1c2983ad99da4bc&redirect_uri=https%3A%2F%2F${
          import.meta.env.VITE_PUBLIC_URL
        }%2Fapi%2FgetOpenidAuth&response_type=code&scope=snsapi_base&state=` +
        userInfo.value.id +
        "-" +
        keyList.value[keyIndex.value].price;
    });
  } else {
    const img = await wechatPayAuth({
      accessKey: userInfo.value.accessKey,
      osType: agent.value ? 2 : 1,
      payAmount: +keyList.value[keyIndex.value].price,
    });
    if (agent.value) {
      if (img.data.data.h5Url) {
        window.location.href = img.data.data.h5Url;
        setTimeout(() => {
          loopOrderDetail(img.data.data.orderNo);
        }, 3000);
      } else {
        ElMessage({
          type: "error",
          message: "获取微信支付链接失败",
        });
      }
    } else {
      if (img.data.code == 11000) {
        QRCode.toDataURL(img.data.data.codeUrl).then((res1: any) => {
          qrCodeImgUrl.value = res1;
          setTimeout(() => {
            loopOrderDetail(img.data.data.orderNo);
          }, 3000);
        });
      } else {
        ElMessage({
          type: "error",
          message: img.data.msg,
        });
      }
    }
  }
};
const loopOrderDetail = async (orderNo: string) => {
  const orderResult = await orderDetail({
    orderNo,
    accessKey: userInfo.value.accessKey,
  });
  if (orderResult.data.data.payStatus === 1) {
    ElMessage({
      type: "success",
      message: "恭喜您，购买成功。5秒后，自动关闭本页面",
    });
    clearTimeout(timer.value);
    timer.value = "";
    setTimeout(() => {
      // window.close();
      $router.back();
    }, 5000);
  } else {
    timer.value = setTimeout(() => {
      loopOrderDetail(orderNo);
    }, 3000);
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
const copy = async () => {
  try {
    if (isHashMode($router.options.history.base)) {
      // 复制
      await toClipboard(
        `${
          window.location.origin + import.meta.env.VITE_PUBLIC_BASE
        }/#/?inviteCode=${userInfo.value.inviteCode}`
      );
    } else {
      // 复制
      await toClipboard(
        `${
          window.location.origin + import.meta.env.VITE_PUBLIC_BASE
        }?inviteCode=${userInfo.value.inviteCode}`
      );
    }
    ElMessage({ message: "复制成功", type: "success" });
  } catch (e) {
    ElMessage("复制失败");
  }
};
const logout = () => {
  ElMessageBox.confirm("是否退出登录?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    doLogout({
      token: userInfo.value.token,
      accessKey: userInfo.value.accessKey,
    });
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
      isAuth: 0,
      accountType: 1,
      accessKey: "",
    };
    nickname.value = "";
    showUserInfo.value = false;
    $router.replace({ name: "home" });
    qrCodeImgUrl.value = "";
  });
};
</script>
<style lang="scss" scoped>
@mixin hover5Style {
  &:hover {
    color: #000;
  }
  &:active {
    color: rgba(0, 0, 0, 0.5);
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
  .underline {
    font-size: 16px;
    font-family: FUTURA-MEDIUM;
    font-weight: bold;
    color: #07070d;
    text-decoration: underline;
  }
}
.show-user {
  padding: 25px 20px 15px 15px;
  width: 344px;
  height: 300px;
  transition: all 0.3s;
}
.recharge {
  height: 100vh;
  width: 100vw;
  // min-width: 1200px;
  box-sizing: border-box;
  background: #fff;
  overflow: hidden;
  margin: 0 auto;
  padding: 60px 90px 0 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .container {
    height: 100%;
    max-width: 1600px;
    min-width: 800px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    .recharge-icon {
      color: #447eea;
      font-size: 3rem;
      height: 61px;
      line-height: 3rem;
    }
    .recharge-count {
      font-size: 2rem;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #161618;
    }
    .tip {
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 400;
      color: #000000;
      margin-top: 25px;
    }
    .charge-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      margin-top: 20px;
      .left {
        min-width: 800px;
        flex: 1 0 auto;
        height: 500px;
        background: #f2f2f5;
        border-radius: 26px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        padding: 39px 59px;
        box-sizing: border-box;
        margin-right: 50px;
        box-sizing: border-box;

        .mbm {
          font-size: 2.5rem;
          font-family: FUTURA-MEDIUM;
          line-height: 102px;
          color: #221815;
        }
        .slogan-logo {
          width: 100%;
          height: 46px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          flex-wrap: wrap;
          .slogan {
            height: 36px;
            font-size: 20px;
            font-family: FUTURA-MEDIUM;
            font-weight: bold;
            color: #000000;
          }
          .line {
            width: 0px;
            height: 33px;
            border-left: 1px solid #707070;
            margin: 0 28px;
          }
          .logo {
            display: block;
            height: 100%;
          }
        }
      }
      .right {
        width: 345px;
        .compute {
          width: 100%;
          font-size: 24px;
          font-family: FUTURA-MEDIUM;
          font-weight: bold;
          color: #737379;
          .d {
            color: #000;
            font-weight: bold;
            font-family: FUTURA-MEDIUM;
          }
        }
        .money-list {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          list-style: none;
          padding: 0;
          // margin-top: 5px;
          .money-item {
            width: 100%;
            height: 72px;
            background: #f2f2f5;
            border-radius: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 16px;
            font-size: 22px;
            font-family: FUTURA-MEDIUM;
            font-weight: 500;
            color: #000000;
            cursor: pointer;
            box-sizing: border-box;
          }
          .select-money {
            border: 1px solid #000000;
            background: none;
          }
          .ipt-money {
            font-size: 28px;
            font-family: FUTURA-MEDIUM;
            font-weight: 500;
            color: #000000;
            width: 100%;
            height: 74px;
            background: #f2f2f5;
            border-radius: 16px;
            margin-top: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            position: relative;
            .self-money {
              border: none;
              outline: none;
              display: block;
              height: 100%;
              width: 100%;
              background: transparent;
              text-align: center;
              font-size: 22px;
              padding: 0 20px;
              box-sizing: border-box;
              &::placeholder {
                color: #000000;
              }
            }
            .yuan {
              width: 50px;
              height: 100%;
              position: absolute;
              right: 0;
              top: 0;
              background: #f2f2f5;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
            }
          }
        }
        .weChat-pay-code {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: column;
          margin-top: 30px;
          .code {
            width: 204px;
            height: 204px;
            margin-top: 40px;
          }
          .icon-weChat {
            font-size: 26px;
            height: 45px;
            line-height: 45px;
            background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/wechat-pay-icon.png")
              center left / contain no-repeat;
            padding-left: 55px;
            margin-top: 20px;
            color: #000;
          }
          .do-pay {
            width: 100%;
            height: 70px;
            line-height: 70px;
            border: 1px solid #000;
            font-size: 24px;
            font-family: FUTURA-MEDIUM;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.95);
            text-align: center;
            margin: 20px auto 0;
            cursor: pointer;
            @include hover5Style;
          }
        }
      }
    }
  }
}
.phone-recharge {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  overflow: hidden;
  margin: 0 auto;
  padding: 4vh 10vw 4vh 10vw;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .recharge-icon {
    color: #447eea;
    font-size: 2rem;
    height: 40px;
    line-height: 40px;
  }
  .recharge-count {
    font-size: 1rem;
    font-family: FUTURA-MEDIUM;
    font-weight: bold;
    color: #161618;
  }
  .tip {
    font-size: 0.8rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    color: #000000;
    margin-top: 25px;
  }
  .charge-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    margin-top: 20px;
    // .left {
    //   flex: 1 0 auto;
    //   height: 500px;
    //   background: #f2f2f5;
    //   border-radius: 26px;
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: flex-start;
    //   flex-direction: column;
    //   padding: 39px 59px;
    //   box-sizing: border-box;
    //   margin-right: 50px;
    //   box-sizing: border-box;

    //   .mbm {
    //     font-size: 58px;
    //     font-family: FUTURA-MEDIUM;
    //     line-height: 102px;
    //     color: #221815;
    //   }
    //   .slogan-logo {
    //     width: 100%;
    //     height: 46px;
    //     display: flex;
    //     justify-content: flex-end;
    //     align-items: center;
    //     flex-wrap: wrap;
    //     .slogan {
    //       height: 36px;
    //       font-size: 20px;
    //       font-family: FUTURA-MEDIUM;
    //       font-weight: bold;
    //       color: #000000;
    //     }
    //     .line {
    //       width: 0px;
    //       height: 33px;
    //       border-left: 1px solid #707070;
    //       margin: 0 28px;
    //     }
    //     .logo {
    //       display: block;
    //       height: 100%;
    //     }
    //   }
    // }
    .right {
      width: 80vw;
      .compute {
        width: 100%;
        font-size: 1rem;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        color: #737379;
        .d {
          color: #000;
          font-weight: bold;
          font-family: FUTURA-MEDIUM;
        }
      }
      .money-list {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin-top: 16px;
        .money-item {
          width: 100%;
          height: 72px;
          background: #f2f2f5;
          border-radius: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 16px;
          font-size: 1.2rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #000000;
          cursor: pointer;
          box-sizing: border-box;
        }
        .select-money {
          border: 1px solid #000000;
          background: none;
        }
        .ipt-money {
          font-size: 1.2rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #000000;
          width: 100%;
          height: 74px;
          background: #f2f2f5;
          border-radius: 16px;
          margin-top: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          position: relative;
          .self-money {
            border: none;
            outline: none;
            display: block;
            height: 100%;
            width: 100%;
            background: transparent;
            text-align: center;
            font-size: 1.2rem;
            padding: 0 20px;
            box-sizing: border-box;
            &::placeholder {
              color: #000000;
            }
          }
          .yuan {
            width: 50px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            background: #f2f2f5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
          }
        }
      }
      .weChat-pay-code {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        .code {
          width: 204px;
          height: 204px;
          margin-top: 40px;
        }
        .icon-weChat {
          font-size: 1.2rem;
          height: 30px;
          line-height: 30px;
          background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/wechat-pay-icon.png")
            center left / contain no-repeat;
          padding-left: 40px;
          margin-top: 20px;
          color: #000;
        }
        .do-pay {
          width: 100%;
          height: 50px;
          line-height: 50px;
          border: 1px solid #000;
          font-size: 1.2rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.95);
          text-align: center;
          margin: 30px auto 0;
          cursor: pointer;
          @include hover5Style;
        }
      }
    }
  }
}
@media screen and (max-width: 1600px) {
  .recharge {
    // padding-top: 20px;
    .charge-box {
      overflow: hidden;
      .left {
        // height: 400px;
        padding: 39px 29px;
      }
      .right {
        // width: 300px;
        .compute {
          font-size: 21px;
        }
        .weChat-pay-code {
          .code {
            height: 150px;
            width: 150px;
            margin-top: 30px;
          }
        }
      }
    }
  }
}
</style>
