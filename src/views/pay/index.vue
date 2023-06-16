<template>
  <div class="container">
    <div class="top">MBM OpenAI</div>
    <div class="price">
      ￥
      <div class="big">{{ price }}</div>
    </div>
    <div style="flex: 1">
      <div class="content">
        <div class="label">收款方</div>
        <div class="company">MBM环境音乐</div>
      </div>
    </div>
    <div class="bottom">
      <div class="button" @click="payment"><div>支付</div></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
const $router = useRouter();
const price = ref<any>("");
onBeforeMount(() => {
  if ($router.currentRoute.value.query.price) {
    price.value = $router.currentRoute.value.query.price;
  }
});
const payment = () => {
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    window.location.href =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa1c2983ad99da4bc&redirect_uri=https%3A%2F%2Fopenai-service.mbmzone.com%2Fapi%2FgetOpenid&response_type=code&scope=snsapi_base&state=" +
      info.token +
      "-" +
      price.value;
  }
  //https://open.weixin.qq.com/connect/oauth2/authorize?appid=你的appid（openai-service项目为wxa1c2983ad99da4bc）&redirect_uri=https%3A%2F%2Fopenai-service.mbmzone.com%2Fapi%2FgetOpenid&response_type=code&scope=snsapi_base&state=你的key-充值金额；
  //（最后的state参数需要代码里动态拼接，格式为要充值的key-充值金额）
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10vh 0;
  min-height: 100vh;
  .top {
    font-size: 1rem;
    color: #000;
  }
  .price {
    font-size: 2rem;
    margin-top: 20px;
    color: #000;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    .big {
      font-size: 3rem;
    }
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 40px;
    padding: 20px 0;
    width: 80vw;
    border-bottom: rgba(237, 237, 237) solid 1px;
    border-top: rgba(237, 237, 237) solid 1px;
    .label {
      color: rgb(150, 150, 150);
    }
    .company {
      color: #000;
      font-size: 1rem;
      margin-left: 40px;
    }
  }
  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 50px;
      width: 200px;
      background: rgb(87, 191, 106);
      color: #fff;
      font-size: 1rem;
      border-radius: 6px;
    }
  }
}
</style>
