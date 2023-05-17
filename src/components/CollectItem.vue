<template>
  <div class="wrap">
    <div class="item border" v-for="(item, index) in appList" :key="index">
      <div class="app-name-box">
        <img :src="item.img" class="app-logo" alt="" />
        <div class="app-name">{{ item.name }}</div>
        <img
          v-if="collect"
          :src="collect0"
          class="collect"
          alt=""
          @click="doCollect"
        />
        <img v-else :src="collect1" class="collect" alt="" @click="doCollect" />
      </div>
      <div class="brief">{{ item.desc }}</div>
      <!--set different status button here-->
      <!-- <el-button class="btn star" type="primary" color="#4622E6">IOS APP</el-button>
      <el-button class="btn star popular" type="primary" color="#EE385C">最受欢迎</el-button>
      <el-button class="btn" type="primary" color="#333333">￥999/申请</el-button>
      <el-button class="btn" round>$ 1 即可体验</el-button> -->
      <el-button class="btn" type="primary" color="#333333" @click="nav(index)">
        立即体验
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import logo from "@/assets/images/logo.png";
import collect0 from "@/assets/images/collect-0.png";
import collect1 from "@/assets/images/collect-1.png";
import musicIcon from "@/assets/images/music-icon.png";
import openaiIcon from "@/assets/images/openai-icon.png";
import { ref } from "vue";
import { ElNotification } from "element-plus";
const collect = ref<boolean>(false);
const appList = ref([
  {
    name: "MusicAI",
    desc: "通过GPT来推荐你喜欢的音乐，并且立即播放。\niPhone 用户现在可访问 App Store 以免费下载 MusicAI 。",
    img: musicIcon,
  },
  {
    name: "OpenAI ChatGPT 聊天机器人",
    desc: "还没体验过GPT-4？\n现在注册账户，立即赠送你 1 美元体验金，即刻体验。",
    img: openaiIcon,
  },
]);

// do collect / uncollect
const doCollect = () => {
  collect.value = !collect.value;
  ElNotification({
    title: "Success",
    message: collect.value ? "取消收藏成功" : "收藏成功",
    type: "success",
    duration: 2000,
    showClose: false,
  });
};
// 跳转url
const skip = (url: string, openNew: boolean) => {
  if (openNew) {
    window.open(`${url}`);
  } else {
    window.location.href = `${url}`;
  }
};
const nav = (index: number) => {
  if (index == 1) {
    skip("https://mchat.mbmzone.com/", true);
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .item {
    flex: 1;
    width: calc((100vw - 560px) / 2 - 30px);
    min-width: 300px;
    max-width: 533px;
    height: 250px;
    width: 40%;
    background: #ffffff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.16);
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    padding: 22px 30px;
    border-radius: 24px;
    margin: 0 30px 30px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: column;
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
        font-family: Futurafont;
        font-weight: 600;
        color: #333333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .collect {
        height: 24px;
        width: 24px;
        cursor: pointer;
      }
    }
    .brief {
      height: 80px;
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
    .star {
      background: url("../assets/images/white-star.png") center left 5px / 17px
        auto no-repeat #4622e6;
      padding-left: 15px;
    }
    .popular {
      background: url("../assets/images/white-star.png") center left 5px / 17px
        auto no-repeat #ee385c;
    }
  }
  .border {
    box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.16);
  }
}
</style>
