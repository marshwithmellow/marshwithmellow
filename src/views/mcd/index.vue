<template>
  <div class="px-common-layout px-no-trans">
    <el-container>
      <el-header class="header">
        <img
          class="logo"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png"
        />
        <div
          style="
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            position: relative;
          "
        >
          <img
            class="logo"
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png"
            alt=""
          />
        </div>
        <div class="avatar">M</div>
      </el-header>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100vw;
  background: #ffffff;
  padding: 0 20px;
  .logo {
    width: 10vw;
    min-width: 140px;
  }
  .avatar {
    width: 32px;
    height: 32px;
    background: #818da3;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 0.8rem;
    font-family: FUTURA-MEDIUM;
    font-weight: bold;
    color: #ffffff;
    z-index: 2;
    cursor: pointer;
  }
}
</style>
