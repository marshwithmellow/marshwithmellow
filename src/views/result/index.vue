<template>
  <div style="position: relative">
    <div class="recharge" v-if="!agent">
      <div class="charge-box">
        <div class="recharge-icon iconfont icon-shandian"></div>
        <div class="recharge-count">
          充值成功 - {{ userInfo && userInfo.mobile ? userInfo.mobile : "" }}
        </div>
        <p class="tip">充值到个人账户</p>
        <!-- <div class="left">
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
        </div> -->
        <img
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/thank-you.png"
          class="thank-you"
        />
      </div>
      <div class="right">
        <div class="right-content">
          <div class="compute" style="text-align: left; margin-bottom: 20px">
            订单号：{{ orderNo }}
          </div>
          <div class="compute" style="text-align: left">充值</div>
          <ul class="money-list">
            <li class="money-item">{{ orderItem.payAmount }}元</li>
          </ul>
          <div class="compute" style="text-align: left; margin-top: 30px">
            到账
          </div>
          <ul class="money-list">
            <li class="money-item">{{ orderItem.amount }}美元</li>
          </ul>
        </div>
        <div class="right-content2">
          <el-divider />
        </div>
      </div>
    </div>
    <div class="phone-recharge" v-else>
      <div class="recharge-icon iconfont icon-shandian"></div>
      <div class="recharge-count">
        充值成功 - {{ userInfo && userInfo.mobile ? userInfo.mobile : "" }}
      </div>
      <p class="tip">充值到个人账户</p>
      <div class="charge-box">
        <div class="right">
          <div class="compute" style="text-align: left; margin-bottom: 20px">
            订单号：{{ orderNo }}
          </div>
          <div class="compute" style="text-align: left">充值</div>
          <ul class="money-list">
            <li class="money-item">{{ orderItem.payAmount }}元</li>
          </ul>
          <div class="compute" style="text-align: left; margin-top: 30px">
            到账
          </div>
          <ul class="money-list">
            <li class="money-item">{{ orderItem.amount }}美元</li>
          </ul>
          <!-- <div class="weChat-pay-code">
            <img v-if="qrCodeImgUrl" class="code" :src="qrCodeImgUrl" alt="" />
            <div class="icon-weChat">微信支付</div>
            <div class="do-pay" @click="onPay" v-if="!paying">确认支付</div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { orderDetail, doGetInfo } from "@/api/index";
import { useRouter } from "vue-router";
import { pinyin } from "pinyin-pro";
const userInfo = ref();
const nickname = ref("");
const timer = ref();
const $router = useRouter();
const orderItem = ref({
  accessKey: "",
  accountId: "",
  afterAmount: 0,
  amount: 0,
  beforeAmount: 0,
  cashBackAmount: 0,
  cashBackOrderNo: "",
  chargeName: "",
  ip: "",
  orderNo: "",
  outTradeNo: "",
  payAmount: 0,
  payStatus: 0,
  payTime: "",
  payWay: 0,
  refundStatus: 0,
});
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
const orderNo = ref<any>("");
onBeforeMount(() => {
  if ($router.currentRoute.value.query.orderNo) {
    orderNo.value = $router.currentRoute.value.query.orderNo;
  }
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
    if (orderNo.value) {
      loopOrderDetail(orderNo.value);
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
onUnmounted(() => {
  clearTimeout(timer.value);
  timer.value = "";
});
const loopOrderDetail = async (orderNo: string) => {
  const orderResult = await orderDetail({
    orderNo,
    accessKey: userInfo.value.accessKey,
  });
  if (orderResult.data.data.payStatus === 1) {
    ElMessage({
      type: "success",
      message: "恭喜您，充值成功。5秒后，自动关闭本页面",
    });
    clearTimeout(timer.value);
    timer.value = "";
    setTimeout(() => {
      $router.replace({ name: "home" });
    }, 5000);
    orderItem.value = orderResult.data.data;
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
      font-family: Gotham-Rounded;
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

    .thank-you {
      margin-top: 50px;
      width: 90%;
      max-width: 900px;
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
        font-size: 20px;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        color: #737379;
        white-space: nowrap;
        .d {
          color: #000;
        }
      }
      .money-list {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin-top: 16px;
        .money-item {
          width: 60%;
          height: 96px;
          background: #f2f2f5;
          border-radius: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 16px;
          font-size: 2rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #000000;
          cursor: pointer;
          box-sizing: border-box;
          border: 1px solid #000000;
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
    .right-content2 {
      margin-top: 30px;
      height: 35px;
      max-width: 360px;
      min-width: 300px;
      border-bottom: 4px solid #000;
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
    font-family: Gotham-Rounded;
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
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin-top: 16px;
        .money-item {
          width: 60%;
          height: 96px;
          background: #f2f2f5;
          border-radius: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 16px;
          font-size: 2rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #000000;
          cursor: pointer;
          box-sizing: border-box;
          border: 1px solid #000000;
        }
        .select-money {
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
:global(.el-divider--horizontal) {
  border-top: 1px #000 solid;
}
</style>
