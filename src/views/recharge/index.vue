<template>
  <div style="position: relative">
    <div class="recharge" v-if="!agent">
      <el-popover
        placement="bottom"
        :width="344"
        trigger="hover"
        v-if="userInfo.name"
        popper-class="user"
        v-model:visible="showUserInfo"
      >
        <template #reference>
          <div
            v-if="userInfo && userInfo.name"
            class="avatar"
            @click="
              updateUserInfo();
              navSetting();
            "
          >
            {{ nickname }}
          </div>
        </template>
        <div
          v-if="userInfo.name"
          class="popover-user-info"
          :class="{ 'popover-show-user': showUserInfo }"
        >
          <p class="nickname">
            Hello,
            <span class="underline">{{ userInfo.name }}！</span>
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
            <span class="code underline" @click="copyShare">
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
      </el-popover>
      <div class="charge-box">
        <div class="recharge-icon iconfont icon-shandian"></div>
        <div class="recharge-count">
          充值到{{ userInfo && userInfo.mobile ? userInfo.mobile : "" }}
        </div>
        <p class="tip">充值到个人账户</p>
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
      </div>
      <div class="right">
        <div class="right-content">
          <div
            class="compute"
            :style="{ 'text-align': paying ? 'center' : 'left' }"
          >
            <span class="d">充值:</span>
            {{
              !paying
                ? "到账按人民币兑美元汇率"
                : `${model || list[selectIndex]}元人民币`
            }}
          </div>
          <ul class="money-list" v-if="!paying">
            <li
              class="money-item"
              :class="{ 'select-money': selectIndex === index }"
              v-for="(item, index) in list"
              :key="item"
              @click="selectMoney(item, index)"
            >
              {{ item }}元
            </li>
            <li class="ipt-money">
              <input
                max="99999"
                v-model="model"
                class="self-money"
                type="number"
                :placeholder="holder"
                @focus="
                  showYuan(true);
                  holder = '';
                  selectIndex = 10;
                "
                @blur="
                  showYuan(!!model);
                  holder = '自定义充值';
                "
                @input="input"
              />
              <div v-if="showUnit" class="yuan">元</div>
            </li>
          </ul>
          <div class="weChat-pay-code">
            <img v-if="qrCodeImgUrl" class="code" :src="qrCodeImgUrl" alt="" />
            <div class="icon-weChat">微信支付</div>
            <div class="do-pay" @click="onPay" v-if="!paying">确认支付</div>
          </div>
        </div>
      </div>
    </div>
    <div class="phone-recharge" v-else>
      <div class="recharge-icon iconfont icon-shandian"></div>
      <div class="recharge-count">
        充值到{{ userInfo && userInfo.mobile ? userInfo.mobile : "" }}
      </div>
      <p class="tip">充值到个人账户</p>
      <div class="charge-box">
        <div class="right">
          <div
            class="compute"
            :style="{ 'text-align': paying ? 'center' : 'left' }"
          >
            <span class="d">充值:</span>
            {{
              !paying
                ? "到账按人民币兑美元汇率"
                : `${model || list[selectIndex]}元人民币`
            }}
          </div>
          <ul class="money-list" v-if="!paying">
            <li
              class="money-item"
              :class="{ 'select-money': selectIndex === index }"
              v-for="(item, index) in list"
              :key="item"
              @click="selectMoney(item, index)"
            >
              {{ item }}元
            </li>
            <li class="ipt-money">
              <input
                max="99999"
                v-model="model"
                class="self-money"
                type="number"
                :placeholder="holder"
                @focus="
                  showYuan(true);
                  holder = '';
                  selectIndex = 10;
                "
                @blur="
                  showYuan(!!model);
                  holder = '自定义充值';
                "
                @input="input"
              />
              <div v-if="showUnit" class="yuan">元</div>
            </li>
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
import { wechatPay, orderDetail, doGetInfo, doLogout } from "@/api/index";
import { isWeiXinBrowser } from "@/utils/utils";
import { useRouter } from "vue-router";
import useClipboard from "vue-clipboard3";
import { pinyin } from "pinyin-pro";
import { isHashMode } from "@/utils/utils";
const selectIndex = ref(10);
const showUnit = ref(false);
const model = ref<any>();
const userInfo = ref();
const nickname = ref("");
const qrCodeImgUrl = ref();
const holder = ref("自定义充值");
const list = [10, 30, 50, 100, 200, 300];
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
const selectMoney = (item: number, index: number) => {
  selectIndex.value = index;
  model.value = "";
  ElMessage({
    type: "success",
    message: `您已经选择了充值金额 ${item} 元人民币`,
  });
};
const input = () => {
  if (parseInt(model.value) > 999999) model.value = "999999";
};
const showYuan = (flag: boolean) => {
  showUnit.value = flag;
};
const onPay = async () => {
  let money = model.value || list[selectIndex.value];
  if (money) {
    paying.value = true;
    if (isWeiXinBrowser()) {
      $router.replace({ name: "home" }).then(() => {
        window.location.href =
          `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa1c2983ad99da4bc&redirect_uri=https%3A%2F%2F${
            import.meta.env.VITE_PUBLIC_URL
          }%2Fapi%2FgetOpenid&response_type=code&scope=snsapi_base&state=` +
          userInfo.value.id +
          "-" +
          money;
      });
    } else {
      const img = await wechatPay({
        accessKey: userInfo.value.accessKey,
        osType: agent.value ? 2 : 1,
        payAmount: +money,
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
        QRCode.toDataURL(img.data.data.codeUrl).then((res1: any) => {
          qrCodeImgUrl.value = res1;
          setTimeout(() => {
            loopOrderDetail(img.data.data.orderNo);
          }, 3000);
        });
      }
    }
  } else {
    ElMessage({
      type: "error",
      message: "请选择充值金额",
    });
  }
};
const loopOrderDetail = async (orderNo: string) => {
  const orderResult = await orderDetail({
    orderNo,
    accessKey: userInfo.value.accessKey,
  });
  if (orderResult.data.data.payStatus === 1) {
    // ElMessage({
    //   type: "success",
    //   message: "恭喜您，充值成功。5秒后，自动关闭本页面",
    // });
    // clearTimeout(timer.value);
    // timer.value = "";
    // setTimeout(() => {
    //   window.close();
    // }, 5000);
    $router.replace({
      name: "result",
      query: {
        orderNo: orderResult.data.data.orderNo,
      },
    });
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
const navSetting = () => {
  if (isHashMode($router.options.history.base)) {
    window.open(`${window.location.href.split("#")[0]}#/setting`);
  } else {
    window.open(`${$router.options.history.base}/setting`);
  }
};
const copyShare = async () => {
  let url = "";
  if (isHashMode($router.options.history.base)) {
    url = `${
      window.location.origin + import.meta.env.VITE_PUBLIC_BASE
    }/#/share?nickName=${encodeURIComponent(userInfo.value.name)}&inviteCode=${
      userInfo.value.inviteCode
    }`;
  } else {
    url = `${
      window.location.origin + import.meta.env.VITE_PUBLIC_BASE
    }/share?nickName=${encodeURIComponent(userInfo.value.name)}&inviteCode=${
      userInfo.value.inviteCode
    }`;
  }
  try {
    await toClipboard(url);
    ElMessage({ message: "复制成功", type: "success" });
  } catch (e) {
    ElMessage("复制失败");
  }
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
.popover-user-info {
  width: 0;
  height: 0;
  background: #ffffff;
  border: 1px solid #707070;
  border-radius: 11px;
  z-index: 1;
  box-sizing: border-box;
  padding: 0;
  transition: all 0.2s;
  overflow: hidden;
  .nickname {
    width: 100%;
    // height: 25px;
    font-size: 24px;
    font-family: FUTURA-MEDIUM;
    font-weight: bold;
    margin-bottom: 20px;
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
    .underline {
      font-size: 16px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #07070d;
      text-decoration: underline;
    }
  }
}
.popover-show-user {
  padding: 25px 20px 15px 15px;
  width: 304px;
  height: auto;
  transition: all 0.3s;
}
.recharge {
  min-height: 100vh;
  min-width: 100vw;
  // min-width: 1200px;
  box-sizing: border-box;
  background: #fff;
  overflow: hidden;
  margin: 0 auto;
  padding: 0 90px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  position: relative;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
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

  .charge-box {
    width: 100%;
    max-width: 1000px;
    min-width: 600px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-direction: column;
    .recharge-icon {
      color: #447eea;
      font-size: 3rem;
      height: 61px;
      line-height: 3rem;
      margin-top: 30px;
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
    .left {
      flex: 1 0 auto;
      max-height: 500px;
      max-width: 900px;
      width: 90%;
      background: #f2f2f5;
      border-radius: 26px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: column;
      padding: 39px 59px;
      box-sizing: border-box;
      margin: 30px 0;

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
  }
  .right {
    // width: 345px;
    max-width: 360px;
    min-width: 300px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .right-content {
      min-height: 70vh;
      max-width: 360px;
      min-width: 300px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: column;
      .compute {
        width: 100%;
        font-size: 24px;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        color: #737379;
        .d {
          color: #000;
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
          width: 30%;
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
          margin: 30px auto 0;
          cursor: pointer;
          @include hover5Style;
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
          width: 30%;
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
:global(.user.el-popover.el-popper) {
  // padding: 0;
  // // margin-top: 10px;
  // width: 304px !important;
  // border-radius: 11px;
  background: transparent !important;
  padding: 20px 50px 0 0;
  box-shadow: none;
  border: none;
}
</style>
