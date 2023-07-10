<template>
  <div class="wrap">
    <div
      class="item border"
      :class="!item.collect ? 'inset' : 'unset'"
      v-for="(item, index) in appList"
      :key="index"
    >
      <div class="app-name-box">
        <img :src="item.img" class="app-logo" alt="" />
        <div class="app-name">{{ item.name }}</div>
        <img
          v-if="item.collect"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/collect-0.png"
          class="collect"
          alt=""
          @click="doCollect(item)"
        />
        <img
          v-else
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/collect-1.png"
          class="collect"
          alt=""
          @click="doCollect(item)"
        />
      </div>
      <div class="brief">{{ item.desc }}</div>
      <!--set different status button here-->
      <!-- <el-button class="btn star" type="primary" color="#4622E6">IOS APP</el-button>
      <el-button class="btn star popular" type="primary" color="#EE385C">最受欢迎</el-button>
      <el-button class="btn" type="primary" color="#333333">￥999/申请</el-button>
      <el-button class="btn" round>$ 1 即可体验</el-button> -->
      <el-button
        class="btn"
        type="primary"
        color="#4622E6"
        v-if="item.btnType == 1"
        :icon="StarFilled"
        @click="nav(item)"
      >
        {{ item.btnText }}
      </el-button>
      <el-button
        class="btn"
        type="primary"
        color="#EE385C"
        v-else-if="item.btnType == 2"
        :icon="StarFilled"
        @click="nav(item)"
      >
        {{ item.btnText }}
      </el-button>
      <el-button
        class="btn"
        type="primary"
        color="#333333"
        v-else
        @click="nav(item)"
      >
        {{ item.btnText }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
// import logo from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png";
// import collect0 from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/collect-0.png";
// import collect1 from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/collect-1.png";
// import musicIcon from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/music-icon.png";
// import gptNextWebIcon from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/gpt-next-web-icon.png";
// import gpt4Icon from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/gpt-4-icon.png";
// import autoIcon from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/gpt-auto-icon.png";
// import paperIcon from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/paper-icon.png";
// import lawIcon from "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/law-icon.png";
import { ref } from "vue";
import { ElNotification } from "element-plus";
import { StarFilled } from "@element-plus/icons-vue";
import { httpUrlAddKey } from "@/utils/utils";
const emits = defineEmits(["skip"]);
// type Option = {
//   value: string;
//   label: string;
// };
// const props = defineProps({
//   aiVersion: {
//     type: Object,
//     default: () => {
//       return { value: "gpt4", label: "GPT-4" };
//     },
//   },
// });
const aiVersion = ref<string>("gpt4");
const appList = ref([
  {
    name: "ChatGPT Next Web",
    desc: "即刻体验当前最强大的对话式人工智能 ChatGPT ，可以与您聊天，回答后续问题，并挑战错误的假设。模型包含 GPT-4 和 GPT-4 32K ，优先获得 OpenAI 新功能和改进。",
    img: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/gpt-next-web-icon.png",
    url: "https://mchat.mbmzone.com/",
    useToken: true,
    btnType: 0,
    btnText: "立即体验",
    collect: false,
  },
  // {
  //   name: "MusicAI",
  //   desc: "通过GPT来推荐你喜欢的音乐，并且立即播放。\niPhone 用户现在可访问 App Store 以免费下载 MusicAI 。",
  //   img: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/music-icon.png",
  //   url: "https://apps.apple.com/cn/app/musicai/id6447292442",
  //   useToken: false,
  //   btnType: 1,
  //   btnText: "iOS APP",
  //   collect: false,
  // },
  {
    name: "ChatBot with GPT4",
    desc: "倍受硅谷欢迎的全新 OpenAI 聊天机器人，支持自定义提示词，设置回复随机性和导出聊天文本，同样支持 GPT-4 和 GPT-4-32K，欢迎尝鲜。",
    img: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/gpt-4-icon.png",
    url: "https://chatbot.mbmzone.com/",
    useToken: true,
    btnType: 0,
    btnText: "立即体验",
    collect: false,
  },
  {
    name: "AutoGPT Next Web",
    desc: "这个由 GPT-4 驱动的项目将 LLM 的“思想”链接在一起，以自主实现你设定的任何目标。作为 GPT-4 完全自主运行的首批示例之一，Auto-GPT 突破了 AI 可能性的界限。",
    img: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/gpt-auto-icon.png",
    url: "http://autogpt.mbmzone.com/",
    useToken: true,
    btnType: 0,
    btnText: "立即体验",
    collect: false,
  },
  {
    name: "Paper - ChatGPT 学术优化",
    desc: "科研工作专用 ChatGPT 拓展，特别优化学术 Paper 润色体验，支持自定义快捷按钮，支持 markdown 表格显示，Tex公式双显示，代码显示功能完善，新增本地Python工程剖析功能/自我部析功能。",
    img: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/paper-icon.png",
    url: "http://paper.mbmzone.com/",
    useToken: true,
    btnType: 0,
    btnText: "需要 API",
    collect: false,
  },
  {
    name: "Law - AI法律助手",
    desc: "学习了中国法律的 AI 法律助手。",
    img: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/law-icon.png",
    url: "https://law.ai2045.com",
    useToken: false,
    btnType: 2,
    btnText: "免费使用",
    collect: false,
  },
  {
    name: "ChatGPT With GPT4",
    desc: "标准的 ChatGPT 聊天机器人，包含提示词商店。\n可选择 GPT-4 、 GPT-4 32K 和 GPT-3.5 turbo 模型。\n拥有快速充值入口。",
    img: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/gpt-4-icon.png",
    url: "https://chat.mbmzone.com/",
    useToken: true,
    btnType: 0,
    btnText: "立即体验",
    collect: false,
  },
]);

// do collect / uncollect
const doCollect = (item: any) => {
  item.collect = !item.collect;
  ElNotification({
    title: "Success",
    message: item.collect ? "取消收藏成功" : "收藏成功",
    type: "success",
    duration: 2000,
    showClose: false,
  });
};
// 跳转url
const skip = (url: string, openNew: boolean, useToken: boolean) => {
  let urlString = url;
  if (useToken) {
    let usr = localStorage.getItem("userInfo");
    if (usr) {
      const user = JSON.parse(usr);
      urlString = httpUrlAddKey(urlString, "token", user.token);
      urlString = httpUrlAddKey(urlString, "version", aiVersion.value);
    } else {
      urlString = httpUrlAddKey(urlString, "version", aiVersion.value);
    }
  }
  emits("skip", {
    urlString,
    openNew,
  });
  // if (openNew) {
  //   window.open(urlString);
  // } else {
  //   window.location.href = urlString;
  // }
};
const nav = (item: any) => {
  skip(item.url, true, item.useToken);
};
const setAIVersion = (val: string) => {
  aiVersion.value = val;
};
defineExpose({
  setAIVersion,
});
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .item {
    flex: 1;
    // min-width: 150px;
    height: 250px;
    width: 80vw;
    background: #ffffff;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    padding: 22px 30px;
    border-radius: 24px;
    margin: 0 0 30px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: column;
    &.inset {
      box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.1);
    }
    &.unset {
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    }
    .app-name-box {
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: fs;
      align-items: center;
      flex-wrap: nowrap;
      .app-logo {
        display: block;
        width: 30px;
        height: 30px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16);
        margin-right: 10px;
        border-radius: 5px;
      }
      .app-name {
        text-align: left;
        flex: 1 0 auto;
        font-size: 14px;
        width: 120px;
        font-weight: 600;
        color: #333333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: FUTURA-MEDIUM;
      }
      .collect {
        height: 24px;
        width: 24px;
        cursor: pointer;
      }
    }
    .brief {
      height: 116px;
      width: 100%;
      font-size: 14px;
      font-family: Gotham-Rounded;
      font-weight: bold;
      color: #868686;
      margin: 15px 0;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .btn {
      float: right;
      width: 100px;
      height: 28px;
      line-height: 28px;
      border-radius: 17px;
      font-size: 14px;
      font-family: Gotham-Rounded;
      padding: 4px 20px;
    }
    // .star {
    //   background: url("../assets/images/white-star.png") center left 5px / 17px
    //     auto no-repeat #4622e6;
    //   padding-left: 15px;
    // }
    // .popular {
    //   background: url("../assets/images/white-star.png") center left 5px / 17px
    //     auto no-repeat #ee385c;
    // }
  }
  .border {
    box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.16);
  }
}
</style>
