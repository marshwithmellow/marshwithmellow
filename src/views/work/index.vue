<template>
  <div class="px-common-layout px-no-trans">
    <el-container>
      <el-header style="height: auto">
        <img class="logo" :src="logo" alt="" />
      </el-header>
      <el-main class="main">
        <!-- <video
          class="video-container"
          id="video"
          playsinline="true"
          autoplay="true"
          muted="false"
          loop="true"
          src="@/assets/animation.mp4"
          type="video/mp4"
        ></video> -->
        <div
          v-if="status == 0"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            height: calc(100vh - 76px);
            width: 100%;
          "
        >
          <img :src="cardImg" class="video-container" />
          <div class="right-container">
            <div class="small">AI 与 你</div>
            <div class="normal">工作中，携手合作。</div>
            <div class="input-container">
              <input
                ref="input"
                class="input"
                v-model="inputValue"
                placeholder="#自动添加客户"
                @keyup.enter.native="navInput(1)"
              />
              <!-- <div class="input">
                <el-cascader
                  v-model="inputValue"
                  :options="inputOptions"
                  separator=" "
                  popper-class="city"
                  @change="changeInput"
                  :props="{ value: 'label' }"
                />
                
              </div> -->
              <!-- <el-select
                v-model="inputValue"
                placeholder="#自动添加客户"
                size="large"
                class="input"
                suffix-icon=""
              >
                <el-option
                  v-for="item in inputOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
              <img :src="enter" class="enter" @click="navInput(1)" />
            </div>
          </div>
        </div>
        <div
          v-else-if="status == 1"
          style="
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: row;
            height: 100%;
            width: 100%;
          "
        >
          <div
            style="
              flex: 1;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              flex-direction: row;
              padding-top: 50px;
            "
          >
            <div
              style="
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                flex-direction: column;
              "
            >
              <div
                style="
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-end;
                  flex-direction: row;
                "
              >
                <img :src="tagImg" style="width: 50px; height: 75px" />
                <div class="left-title">自动添加客户</div>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: row;
                  padding-top: 80px;
                "
              >
                <img :src="wechatImg" style="height: 113px" />
                <div class="left-content">关联你的企业微信</div>
              </div>
            </div>
          </div>
          <img :src="workImg1" style="height: 70vh" />
          <div
            style="
              flex: 1;
              height: 70vh;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              flex-direction: column;
              padding-left: 120px;
              padding-top: 200px;
            "
            v-if="!codeComplete"
          >
            <div class="right-content">手机号登陆</div>
            <div class="ipt-box">
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
            <div class="right-small">发送验证码</div>
          </div>
          <div
            style="
              flex: 1;
              height: 70vh;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              flex-direction: column;
              padding-left: 120px;
              padding-top: 200px;
            "
            v-else
          >
            <div class="right-content">请输入验证码</div>
            <div class="square-box">
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
            <div class="right-small">重新发送</div>
          </div>
        </div>
        <div
          v-else-if="status == 2"
          style="
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: row;
            height: 100%;
            width: 100%;
          "
        >
          <div
            style="
              flex: 1;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              flex-direction: row;
              padding-top: 50px;
            "
          >
            <div
              style="
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                flex-direction: column;
              "
            >
              <div
                style="
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-end;
                  flex-direction: row;
                "
              >
                <img :src="tagImg" style="width: 50px; height: 75px" />
                <div class="left-title">自动添加客户</div>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: row;
                  padding-top: 80px;
                "
              >
                <img :src="wechatImg" style="height: 113px" />
                <div class="left-content">上传客户手机号</div>
              </div>
            </div>
          </div>
          <div
            style="
              width: 50vh;
              height: calc(100vh - 76px - 86px);
              display: flex;
              justify-content: center;
              align-items: flex-start;
              flex-direction: column;
            "
          >
            <div style="height: 60vh; width: 50vh" class="upload-container">
              <img :src="workExcelImg" style="width: 64px; width: 70px" />
              <div class="upload-title">拖拽 & 上传客户手机号到这里</div>
              <div class="upload-desc">支持格式：xls,xlsx 或者 csv</div>
              <div class="upload-desc">文件大小限制：20MB</div>
              <el-button
                round
                color="#4383EA"
                style="
                  width: 140px;
                  height: 64px;
                  border-radius: 60px;
                  margin-top: 30px;
                "
              >
                <img :src="uploadPlusImg" style="width: 24px; height: 24px" />
                <div class="upload-text">上传</div>
              </el-button>
            </div>
            <div
              style="
                flex: 1;
                width: 50vh;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: row;
              "
            >
              <el-button
                round
                color="rgba(149,149,149,0.2)"
                style="
                  width: 160px;
                  height: 64px;
                  border-radius: 60px;
                  border: 2px solid #ffffff;
                "
              >
                <div class="download-text">下载模板</div>
              </el-button>
            </div>
          </div>
          <div
            style="
              flex: 1;
              height: 70vh;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              flex-direction: column;
            "
          ></div>
        </div>
      </el-main>
      <el-footer class="footer" v-if="status != 0">
        <div class="foot-text">第一步：关联你的企业微信</div>
        <div class="foot-text-next" style="left: 64vw">
          第二步：上传客户手机号
        </div>
        <div class="foot-text-next" style="left: 80vw">第三步：开始运行</div>
      </el-footer>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";
import logo from "@/assets/images/ai-logo.png";
import cardImg from "@/assets/images/card-logo.png";
import enter from "@/assets/images/enter.png";
import workImg1 from "@/assets/images/work-status-1.png";
import tagImg from "@/assets/images/tag.png";
import wechatImg from "@/assets/images/wechat-work.png";
import workExcelImg from "@/assets/images/work-excel.png";
import uploadPlusImg from "@/assets/images/upload-plus.png";
const inputValue = ref("");
const status = ref(1);
const tel = ref("");
const tel1 = ref("");
const tel2 = ref("");
const tel3 = ref("");
const sms = ref("");
const sms1 = ref("");
const sms2 = ref("");
const sms3 = ref("");
const sms4 = ref("");
const telholder1 = ref("xxx");
const telholder2 = ref("xxxx");
const telholder3 = ref("xxxx");
const proxy: any = getCurrentInstance()?.proxy ?? null;
const codeComplete = ref(false);
const pasteTel = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData("text");
  const arrText = text?.split(/ [(\r\n)\r\n] +/);
  if (arrText && arrText.length > 0 && arrText[0].length >= 11) {
    tel1.value = arrText[0][0] + arrText[0][1] + arrText[0][2];
    tel2.value = arrText[0][3] + arrText[0][4] + arrText[0][5] + arrText[0][6];
    tel3.value = arrText[0][7] + arrText[0][8] + arrText[0][9] + arrText[0][10];
    // getTelCode(tel1.value + tel2.value + tel3.value);
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
    // inputCode(sms1.value + sms2.value + sms3.value + sms4.value);
  }
};
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
    // getTelCode(tel1.value + tel2.value + tel3.value);
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
    // inputCode(sms1.value + sms2.value + sms3.value + sms4.value);
  }
};
const navInput = (index: number) => {
  status.value = index;
};
const inputOptions = ref([
  {
    value: 1,
    label: "#自动添加客户",
  },
]);
</script>
<style lang="scss" scoped>
.px-common-layout {
  min-width: 100vw;
  min-height: 100vh;
  background: #07070d;
  .logo {
    height: 40px;
    margin-top: 36px;
    margin-left: 18px;
  }
  .main {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    min-height: calc(100vh - 76px - 46px);
    .video-container {
      width: 480px;
      height: 323px;
    }
    .right-container {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      height: 323px;
      padding-left: 40px;
      padding-top: 20px;
      width: 360px;
      .small {
        color: #f9f8fa;
        font-size: 20px;
      }
      .normal {
        color: #f9f8fa;
        margin-top: 16px;
        font-size: 26px;
      }
      .input-container {
        padding: 10px 0;
        border-bottom: 1px solid #707070;
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        .input {
          width: 340px;
          border: none;
          box-shadow: none;
          border-radius: 0;
          background: rgba(0, 0, 0, 0);
          padding: 0;
          font-size: 26px;
          font-family: FUTURA-MEDIUM;
          font-weight: 400;
          color: #ffffff;
        }
        .enter {
          width: 20px;
          height: 13px;
          cursor: pointer;
        }
      }
    }
    .left-title {
      font-size: 24px;
      color: #ffffff;
      margin-left: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #dddddd;
    }
    .left-content {
      font-size: 24px;
      color: #ffffff;
      margin-left: 20px;
    }
    .right-content {
      font-size: 24px;
      color: #ffffff;
    }
    .right-small {
      font-size: 18px;
      color: #ffffff;
      cursor: pointer;
    }
    .ipt-box {
      position: relative;
      margin: 0 0 19px;
      display: flex;
      justify-content: center;
      align-items: center;
      .tel-container {
        margin: 10px 10px 0;
        border-bottom: 1px solid #fff;
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
        color: #ffffff;
        letter-spacing: 6px;
        background: rgba(0, 0, 0, 0);
        ::placeholder {
          letter-spacing: 9.6px;
          color: #ffffff;
        }
        &:focus,
        & :focus {
          outline: none;
        }
      }
      .tel1::placeholder {
        color: #ffffff;
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
        color: #ffffff;
        letter-spacing: 6px;
        background: rgba(0, 0, 0, 0);
        ::placeholder {
          letter-spacing: 9.6px;
          color: #ffffff;
        }
        &:focus,
        & :focus {
          outline: none;
        }
      }
      .tel2::placeholder {
        color: #ffffff;
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
        color: #ffffff;
        letter-spacing: 6px;
        background: rgba(0, 0, 0, 0);
        ::placeholder {
          letter-spacing: 9.6px;
          color: #ffffff;
        }
        &:focus,
        & :focus {
          outline: none;
        }
      }
      .tel3::placeholder {
        color: #ffffff;
      }
    }
    .square-box {
      position: relative;
      margin: 50px 0 19px;
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
          border: 1px solid #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
        }
        .square7 {
          border: none;
          background: #fff;
          position: relative;
          z-index: 99;
        }
      }
    }
    .upload-container {
      background: rgba(149, 149, 149, 0.1);
      border: 4px dashed #717171;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .upload-title {
        color: #ffffff;
        font-size: 28px;
        margin: 30px 0 20px;
      }
      .upload-desc {
        color: #919191;
        font-size: 16px;
        margin-bottom: 14px;
      }
      .upload-text {
        color: #ffffff;
        font-size: 28px;
        margin-left: 10px;
      }
    }
    .download-text {
      color: #ffffff;
      font-size: 24px;
    }
  }
  .footer {
    background: #4383ea;
    width: 100vw;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    .foot-text {
      color: #ffffff;
      font-size: 14px;
    }
    .foot-text-next {
      color: #ffffff;
      font-size: 12px;
      position: absolute;
      top: 10px;
      opacity: 0.6;
    }
  }
}
</style>
