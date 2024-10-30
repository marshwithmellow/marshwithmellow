<template>
  <div class="px-common-layout px-no-trans">
    <div v-if="!agent">
      <div class="overlay" v-if="popoverShow || exchangeShow"></div>
      <div
        class="overlay-1"
        :style="{
          animation: fadeName + ' 1s',
        }"
        v-if="mpQrcodeShow"
        @click="hideQrcode"
      >
        <img
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/gh_d572d3f7d5db_1280.jpg"
          class="qrcode"
          :style="{
            animation: fadeName + ' 1s',
          }"
          @click.stop="() => {}"
        />
        <img
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/mp-content.png"
          class="content"
          :style="{
            animation: fadeName + ' 1s',
          }"
          @click.stop="() => {}"
        />
        <div
          class="back"
          :style="{
            animation: fadeName + ' 1s',
          }"
          @click="hideQrcode"
        >
          返回
        </div>
      </div>
      <div
        class="overlay-1"
        :style="{
          animation: fadeName + ' 1s',
        }"
        v-if="mpQrCodeShow2"
        @click="hideQrCode2"
      >
        <img
          src="@/assets/images/marsh-wx.png"
          class="qrcode"
          :style="{
            animation: fadeName + ' 1s',
          }"
          @click.stop="() => {}"
        />
        <div
          class="content2"
          :style="{
            animation: fadeName + ' 1s',
          }"
        >
          <div>微信机器人+定制知识库</div>
          <div>30元一月，MBM AI 自研大模型。</div>
          <div>如果没有备用手机，30元一月+300元手机租赁。</div>
          <div>租赁3个月以上免费获得一部手机。服务结束可寄给你。</div>
          <div>新增知识库，一次，6元。类似彩铃一样。</div>
        </div>
        <div
          class="back"
          :style="{
            animation: fadeName + ' 1s',
          }"
          @click="hideQrCode2"
        >
          返回
        </div>
      </div>
      <el-container>
        <el-aside class="aside">
          <left-aside
            ref="lf-side"
            @to-login="toLogin"
            @show-message="showMessage"
            @skip="toSkip"
            @recharge="recharge"
            @nav-question="toNavQuestion"
            @popover-confirm="toPopoverConfirm"
            @set-popover-show="setPopoverShow"
            @clip-text="copyShare"
            @exchange-confirm="toExchangeConfirm"
            @set-exchange-show="setExchangeShow"
            @change-ai-version="changeAiVersion"
            @open-overlay="mpQrCodeShow2 = true"
          ></left-aside>
        </el-aside>
        <el-container>
          <el-header class="header">
            <el-carousel
              ref="slide"
              trigger="click"
              arrow="never"
              :autoplay="true"
              :interval="5000"
              class="swiper"
              @change="changeSwiper"
            >
              <el-carousel-item
                class="swipe"
                :style="{
                  background: `url(${item.bg}) center / 100% 100% no-repeat`,
                }"
                v-for="(item, index) in swiperList"
                :key="item.desc"
              >
                <div
                  class="title"
                  :style="item.titleStyle"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-1':
                      animate,
                  }"
                >
                  {{ item.title }}
                </div>
                <div
                  class="desc"
                  :style="item.descStyle"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-2':
                      animate,
                  }"
                >
                  {{ item.desc }}
                </div>
                <button
                  class="open-ai"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-3':
                      animate,
                  }"
                  @click="navQuestion(index + 1 + '')"
                >
                  {{ item.button }}
                </button>
              </el-carousel-item>
            </el-carousel>
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
                  v-if="userInfo.name"
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
            <!-- <div
              v-if="userInfo.name"
              class="avatar"
              @click="
                updateUserInfo();
                navSetting();
              "
            >
              {{ nickname }}
            </div> -->
            <!-- <div
              v-if="userInfo.name"
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
            </div> -->
          </el-header>
          <el-main class="main">
            <div style="padding: 20px 50px 40px">
              <div class="main-header">
                <img
                  style="width: 24px; height: 24px; margin-top: 6px"
                  src="@/assets/images/cheron-down.png"
                />
                <div class="main-header-content">
                  <div class="main-header-content-top">
                    <div style="font-size: 18px; color: #999897">
                      换一种方式使用
                    </div>
                    <div style="font-size: 18px; color: #997917">
                      GPT 4o 新模型
                    </div>
                  </div>
                  <div style="color: #999897; opacity: 0.7; font-size: 14px">
                    Powered by MBM AI
                  </div>
                </div>
                <div class="main-header-content2">
                  <div class="main-header-content2-bg">
                    <div class="main-header-content2-title">
                      试试在微信里与 GPT 4o 对话, 超方便。
                    </div>
                    <div class="main-header-content2-right">It's so cool!</div>
                  </div>
                </div>
                <div class="main-header-content3">
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: row;
                      flex: 1;
                      height: 108px;
                    "
                  >
                    <img
                      style="width: 30px; height: 30px"
                      src="@/assets/images/scan-code.png"
                    />
                  </div>
                  <img
                    style="width: 108px; height: 108px"
                    src="@/assets/images/marsh-wx.png"
                  />
                </div>
              </div>
              <h1 class="title">
                当下热门 AI 应用
                <span class="app-num">(9)</span>
              </h1>
              <collect-item
                ref="collect"
                @open-overlay="mpQrcodeShow = true"
                @skip="collectSkip"
                @to-login="toLogin"
              ></collect-item>
            </div>
            <div class="foot">
              <div style="display: flex; flex-direction: row">
                <div class="txt">Copyright©2016-2023 MBM</div>
                <div class="txt" style="margin-left: 10px">
                  访问我们：
                  <a href="https://www.mbmzone.com" style="margin-left: 10px">
                    MBM环境音乐
                  </a>
                  <a
                    href="https://www.mbmzone.com/openai"
                    style="margin-left: 10px"
                  >
                    MBMOpenAI 服务
                  </a>
                  <a
                    href="https://www.mustlisten.com"
                    style="margin-left: 10px"
                  >
                    Mustlisten
                  </a>
                </div>
              </div>
              <div style="display: flex; flex-direction: row">
                <div class="txt">
                  地址：上海静安区南京西路1515号静安嘉里中心办公楼1座29楼
                </div>
                <div class="txt" style="margin-left: 10px">
                  电话：+86 4008316028
                </div>
                <div class="txt" style="margin-left: 10px">
                  咨询邮箱：<a href="mailto:help@mustlisten.com" target="_top">
                    help@mustlisten.com
                  </a>
                </div>
              </div>
              <div style="display: flex; flex-direction: row">
                <div class="txt">
                  关于我们：上海希荧信息科技有限公司提供 MBM OpenAI GPT-4
                  服务，为中国大陆企业及团体提供安全、可靠、企业级的 GPT
                  服务。与世界，更进一步。
                </div>
              </div>
              <div style="display: flex; flex-direction: row">
                <div class="txt">
                  <a href="https://beian.miit.gov.cn/#/Integrated/index">
                    沪ICP备17030457号-1
                  </a>
                </div>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
      <el-dialog
        v-model="showDialog"
        :close-on-click-modal="true"
        :close-on-press-escape="false"
        class="wrap-dialog"
        :show-close="false"
        title=""
      >
        <login-modal
          ref="login"
          :inviteCode="inviteCode"
          @show-message="showMessage"
          @complete="loginComplete"
        ></login-modal>
      </el-dialog>
    </div>
    <div v-else>
      <div
        class="overlay-2"
        :style="{
          animation: fadeName + ' 1s',
        }"
        v-if="mpQrCodeShow2"
        @click="hideQrCode2"
      >
        <img
          src="@/assets/images/marsh-wx.png"
          class="qrcode"
          :style="{
            animation: fadeName + ' 1s',
          }"
          @click.stop="() => {}"
        />
        <div
          class="content2"
          :style="{
            animation: fadeName + ' 1s',
          }"
        >
          <div>微信机器人+定制知识库</div>
          <div>30元一月，MBM AI 自研大模型。</div>
          <div>如果没有备用手机，30元一月+300元手机租赁。</div>
          <div>租赁3个月以上免费获得一部手机。服务结束可寄给你。</div>
          <div>新增知识库，一次，6元。类似彩铃一样。</div>
        </div>
        <div
          class="back"
          :style="{
            animation: fadeName + ' 1s',
          }"
          @click="hideQrCode2"
        >
          返回
        </div>
      </div>
      <el-container>
        <el-header class="toolbar">
          <img
            class="logo"
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/menu.png"
            @click="drawer = true"
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
            <div class="week" @click="drawer = true"><div>周卡</div></div>
            <img
              class="logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png"
              alt=""
            />
          </div>
          <div
            v-if="userInfo.name"
            class="avatar"
            @click="
              updateUserInfo();
              showUserInfo = !showUserInfo;
            "
          >
            {{ nickname }}
          </div>
          <div v-else style="height: 32px; width: 32px"></div>
        </el-header>
        <el-container>
          <el-header class="phone-header">
            <el-carousel
              ref="slide"
              trigger="click"
              arrow="never"
              :autoplay="true"
              :interval="5000"
              class="swiper"
              @change="changeSwiper"
            >
              <el-carousel-item
                class="swipe"
                :style="{
                  background: `url(${item.bg}) center / auto 100% no-repeat`,
                }"
                v-for="(item, index) in swiperList"
                :key="item.desc"
              >
                <div
                  class="title"
                  :style="item.titleStyle"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-1':
                      animate,
                  }"
                >
                  {{ item.title }}
                </div>
                <div
                  class="desc"
                  :style="item.descStyle"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-2':
                      animate,
                  }"
                >
                  {{ item.desc }}
                </div>
                <button
                  class="open-ai"
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-3':
                      animate,
                  }"
                  @click="navQuestion(index + 1 + '')"
                >
                  {{ item.button }}
                </button>
              </el-carousel-item>
            </el-carousel>
            <div
              v-if="userInfo.name"
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
          </el-header>
          <el-main class="phone-main">
            <!-- <h1 class="title">
            我收藏的应用
            <span class="app-num">(2)</span>
          </h1>
          <collect-item></collect-item> -->
            <div style="padding: 20px 25px">
              <div class="phone-main-header">
                <div
                  style="
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-direction: row;
                  "
                >
                  <img
                    style="width: 24px; height: 24px; margin-top: 6px"
                    src="@/assets/images/cheron-down.png"
                  />
                  <div class="phone-main-header-content">
                    <div class="phone-main-header-content-top">
                      <div style="font-size: 18px; color: #999897">
                        换一种方式使用
                      </div>
                      <div style="font-size: 18px; color: #997917">
                        GPT 4o 新模型
                      </div>
                    </div>
                    <div style="color: #999897; opacity: 0.7; font-size: 12px">
                      保存到相册，使用微信扫一扫添加
                    </div>
                  </div>
                </div>
                <img
                  style="width: 108px; height: 108px"
                  src="@/assets/images/marsh-wx.png"
                />
                <!-- <div class="main-header-content2">
                  <div class="main-header-content2-bg">
                    <div class="main-header-content2-title">
                      试试在微信里与 GPT 4o 对话, 超方便。
                    </div>
                    <div class="main-header-content2-right">It's so cool!</div>
                  </div>
                </div>
                <div class="main-header-content3">
                  <img
                    style="width: 30px; height: 30px"
                    src="@/assets/images/scan-code.png"
                  />
                  <img
                    style="width: 108px; height: 108px"
                    src="@/assets/images/marsh-wx.png"
                  />
                </div> -->
              </div>
              <div class="phone-main-header-content2">
                <div class="phone-main-header-content2-title">
                  试试在微信里与 GPT 4o 对话, 超方便。
                </div>
              </div>
              <h1 class="title">
                当下热门 AI 应用
                <span class="app-num">(7)</span>
              </h1>
              <collect-item-small
                ref="collect"
                @skip="collectSkip"
                @to-login="toLogin"
              ></collect-item-small>
            </div>
            <!-- <div class="foot">
              <div class="txt">
                地址：上海静安区南京西路1515号静安嘉里中心办公楼1座29楼
              </div>
              <div class="txt" style="margin-left: 10px">
                咨询邮箱：<a href="mailto:help@mustlisten.com" target="_top">
                  help@mustlisten.com
                </a>
              </div>
              <div class="txt" style="margin-left: 10px">
                电话：+86 4008316028
              </div>
              <div class="txt">2016-2023©上海希荧信息科技有限公司</div>
              <div class="txt" style="margin-left: 10px">
                <a href="https://beian.miit.gov.cn/#/Integrated/index">
                  沪ICP备17030457号-1
                </a>
              </div>
            </div> -->
          </el-main>
        </el-container>
        <el-drawer
          v-model="drawer"
          direction="ltr"
          size="80%"
          :with-header="false"
        >
          <el-aside class="phone-aside">
            <div class="flex">
              <img
                class="logo"
                src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
                alt=""
              />
              <button
                v-if="userInfo.name"
                class="gpt-button"
                @click="
                  skip('https://mchat.mbmzone.com/', true);
                  drawer = false;
                "
              >
                和我的 ChatGPT 聊天
              </button>
              <button
                v-else
                class="gpt-button"
                @click="
                  toLogin();
                  drawer = false;
                "
              >
                登录 MBM OpenAI 账号
              </button>
              <div class="default-model">
                <img
                  class="icon-ai"
                  src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai.png"
                  alt=""
                />
                <div class="model-name active">默认模型</div>
                <el-select
                  v-model="aiVersion"
                  :fit-input-width="false"
                  popper-class="select-down"
                  :popper-append-to-body="false"
                  class="ai-select"
                  :placeholder="options[0].label"
                  size="small"
                >
                  <el-option
                    class="phone-options"
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div
                class="default-model"
                @click="
                  mpQrCodeShow2 = true;
                  drawer = false;
                "
              >
                <img
                  class="icon-ai"
                  src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-self.png"
                  alt=""
                />
                <div class="model-name">创建你自己的 微信机器人</div>
              </div>
              <div class="default-model" @click="openExchangeDrawer">
                <img
                  class="icon-ai"
                  src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-documents.png"
                  alt=""
                />
                <div class="model-name">兑换无限次对话周卡</div>
              </div>
              <div
                class="default-model"
                @click="
                  keyDrawer = true;
                  drawer = false;
                "
              >
                <img
                  class="icon-ai"
                  src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-key.png"
                  alt=""
                />
                <div class="model-name">生成我的 GPT4 API Key</div>
              </div>
            </div>
            <div class="flex">
              <ul class="question-box">
                <li
                  class="question"
                  v-for="(item, index) in questionList"
                  :key="index"
                  @click="
                    navQuestion(item.value);
                    drawer = false;
                  "
                >
                  {{ item.label }}
                </li>
              </ul>
              <button
                v-if="userInfo.name"
                class="gpt-button color-button"
                @click="
                  recharge();
                  drawer = false;
                "
              >
                充值我的账户
                <div class="my-count-hover"></div>
                <span class="light iconfont icon-shandian"></span>
              </button>
              <button
                v-else
                class="gpt-button color-button"
                @click="
                  toLogin();
                  drawer = false;
                "
              >
                <!-- 现在领取 1 美元体验金！ -->
                现在开启你的 AI 时刻！
                <div class="my-count-hover"></div>
              </button>
              <div v-if="userInfo.name" class="share-my-code">
                分享我的推荐码：
                <span class="code" @click="copyShare">
                  {{ userInfo.inviteCode }}
                </span>
              </div>
            </div>
          </el-aside>
        </el-drawer>
        <el-drawer
          v-model="exchangeDrawer"
          direction="ltr"
          size="80%"
          :with-header="false"
        >
          <div class="popover-container">
            <img
              class="popover-logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
              alt=""
            />
            <div
              class="popover-content"
              v-if="!exchangeItem || exchangeContinue"
            >
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                  flex: 1;
                  max-height: 380px;
                "
              >
                <div class="popover-title" style="margin-bottom: 20px">
                  兑换我的无限次周卡
                </div>
                <img
                  :src="
                    cardType == 2
                      ? 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-black.png'
                      : cardType == 1
                      ? 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-red.png'
                      : 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-default.png'
                  "
                  style="width: 100%"
                />
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin-top: 30px;
                  "
                >
                  <el-input
                    v-model="exchangeCode"
                    class="exchange-input"
                    placeholder="在此填入兑换码"
                    :maxlength="8"
                  >
                    <template #suffix>
                      <div
                        class="clear"
                        v-if="exchangeCode.length > 0"
                        @click="exchangeCode = ''"
                      >
                        清空
                      </div>
                    </template>
                  </el-input>
                </div>
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin-top: 30px;
                  "
                >
                  <div
                    style="
                      width: 90%;
                      display: flex;
                      justify-content: flex-start;
                      align-items: flex-start;
                      flex-direction: row;
                    "
                  >
                    <div
                      class="exchange-confirm"
                      @click="toExchangeConfirm({ code: exchangeCode })"
                    >
                      立即兑换
                    </div>
                  </div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  flex-direction: column;
                  min-height: 120px;
                "
              >
                <div style="width: 90%">
                  <div class="description">
                    ChatGPT 每张周卡兑换码仅可使用一次；
                  </div>
                </div>
                <div style="width: 90%">
                  <div class="description">
                    您可在激活后的 7 天内无限次使用 GPT3.5 模型进行回答。
                  </div>
                </div>
              </div>
            </div>
            <div class="popover-content" v-else>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                  flex: 1;
                  max-height: 380px;
                "
              >
                <div class="popover-title" style="margin-bottom: 20px">
                  兑换我的无限次周卡
                </div>
                <img
                  :src="
                    exchangeItem?.cardType == 2
                      ? 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-black.png'
                      : 'https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/exchange-red.png'
                  "
                  style="width: 100%"
                />
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin-top: 30px;
                  "
                >
                  <div class="exchange-text">
                    <span>您</span>
                    <span>可</span>
                    <span>于</span>
                    <span class="space">&nbsp;</span>
                    <span>{{ exchangeItem?.timeArray[0] }}</span>
                    <span class="space">&nbsp;</span>
                    <span>年</span>
                    <span class="space">&nbsp;</span>
                    <span>{{ exchangeItem?.timeArray[1] }}</span>
                    <span class="space">&nbsp;</span>
                    <span>月</span>
                    <span class="space">&nbsp;</span>
                    <span>{{ exchangeItem?.timeArray[2] }}</span>
                    <span class="space">&nbsp;</span>
                    <span>日</span>
                    <span>前</span>
                    <span>无</span>
                    <span>限</span>
                    <span>次</span>
                    <span>使</span>
                    <span>用</span>
                    <span>服</span>
                    <span>务</span>
                  </div>
                </div>
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin-top: 30px;
                  "
                >
                  <div
                    style="
                      width: 90%;
                      display: flex;
                      justify-content: flex-start;
                      align-items: flex-start;
                      flex-direction: row;
                    "
                  >
                    <div class="exchange-confirm-2">兑换成功</div>
                  </div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  flex-direction: column;
                  min-height: 150px;
                "
              >
                <div style="width: 90%">
                  <div class="description">
                    ChatGPT 每张周卡兑换码仅可使用一次；
                  </div>
                </div>
                <div style="width: 90%">
                  <div class="description">
                    您可在激活后的 7 天内无限次使用 GPT3.5 模型进行回答。
                  </div>
                </div>
                <div class="resume-container" @click="exchangeContinue = true">
                  <div class="txt">继续兑换</div>
                  ？
                </div>
              </div>
            </div>
          </div>
        </el-drawer>
        <el-drawer
          v-model="keyDrawer"
          direction="ltr"
          size="80%"
          :with-header="false"
        >
          <div class="popover-container">
            <img
              class="popover-logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/logo.png"
              alt=""
            />
            <div class="popover-content">
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                "
                v-if="userInfo.isAuth === 1"
              >
                <div class="popover-title">我的 GPT4 API Key</div>
                <div class="popover-part">
                  <div class="popover-block">
                    <div class="internal">
                      <div>
                        {{
                          userInfo.accountType === 2
                            ? "企业"
                            : userInfo.accountType === 3
                            ? "团队"
                            : "个人"
                        }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="popover-right"
                    v-if="
                      userInfo.accountType === 1 || userInfo.accountType === 3
                    "
                  >
                    <div class="price">升级至</div>
                    <div style="display: flex; flex-direction: row">
                      <div
                        class="desc"
                        v-if="
                          userInfo.accountType === 1 ||
                          userInfo.accountType === 3
                        "
                        @click="popoverConfirm(2)"
                      >
                        企业
                      </div>
                      <div
                        class="desc"
                        v-if="userInfo.accountType === 1"
                        style="margin-left: 20px"
                        @click="popoverConfirm(1)"
                      >
                        团队
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="popover-part-a"
                  style="cursor: pointer"
                  @click="copyText(userInfo.accessKey)"
                >
                  <div class="popover-block-a">
                    {{ userInfo.accessKey }}
                  </div>
                  <div class="popover-right">
                    <div class="desc2">复制</div>
                  </div>
                </div>
                <div
                  class="popover-part-a"
                  @click="
                    skip('https://www.showdoc.com.cn/2249626116233450', true)
                  "
                >
                  <div class="popover-block-a">访问 MBM OpenAI 开发文档</div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                "
                v-else
              >
                <div class="popover-title">生成 GPT4 API Key</div>
                <div class="popover-desc">
                  我们为个人、团队和企业开发者提供了GPT
                  开发接口，并集成了内容审查服务。
                </div>
                <div
                  class="popover-part"
                  :class="index == popoverIndex ? '' : 'normal'"
                  v-for="(item, index) in popoverOptions"
                  :key="index"
                  @click="popoverIndex = index"
                >
                  <div class="popover-block">
                    <div class="internal">
                      <div>{{ item.title }}</div>
                    </div>
                  </div>
                  <div class="popover-right">
                    <div class="price">{{ item.price }}元</div>
                    <div class="desc">{{ item.desc }}</div>
                  </div>
                </div>
                <div class="popover-btn" @click="popoverConfirm(popoverIndex)">
                  <div>立即申请</div>
                </div>
              </div>
              <!-- <div
                      style="
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                        align-items: flex-start;
                        flex-direction: column;
                        flex: 1;
                        padding-top: 20px;
                      "
                      v-if="userInfo.isAuth === 1"
                    >
                      <el-divider>开发者社区</el-divider>
                      <div v-if="isUploadHead"></div>
                      <div class="popover-ready-upload" v-else>
                        <div class="popover-upload">
                          <div>+</div>
                        </div>
                        <img
                          class="popover-head-1"
                          src="@/assets/images/head1.png"
                          fit="scale-down"
                        />
                        <img
                          class="popover-head-2"
                          src="@/assets/images/head2.png"
                          fit="scale-down"
                        />
                        <img
                          class="popover-head-3"
                          src="@/assets/images/head3.png"
                          fit="scale-down"
                        />
                        <div class="popover-question-1">
                          现在，请更新你独一无二的头像。
                        </div>
                        <div class="popover-question-2">
                          Hi 开发者，欢迎加入社区。
                        </div>
                      </div>
                    </div> v-else -->
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-direction: column;
                "
                v-if="userInfo.isAuth === 0"
              >
                <div class="popover-foot-desc">
                  GPT4 API key 均包含 GPT-4、GPT-4 32K 和 GPT-3.5-Turbo
                  模型。由于计算资源紧张，GPT-4 模型将优先保证企业和团队
                  用户的开发调用请求。
                </div>
                <div
                  class="popover-foot-a"
                  @click="
                    skip(
                      'https://openai.mbmzone.com/mbm-gpt/blog?blogType=3',
                      true
                    )
                  "
                >
                  了解企业级 OpenAI 服务与个人服务的区别
                </div>
              </div>
            </div>
          </div>
        </el-drawer>
      </el-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import QRCode from "qrcode";
import {
  onBeforeMount,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
  computed,
} from "vue";
import CollectItem from "@/components/CollectItem.vue";
import CollectItemSmall from "@/components/CollectItemSmall.vue";
import LeftAside from "@/components/Aside.vue";
import LoginModal from "@/components/LoginModal.vue";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import { pinyin } from "pinyin-pro";
import {
  doLogout,
  doGetInfo,
  getValidatyTime,
  doExchangeCode,
  getSerialNumber,
} from "@/api/index";
import { useRouter } from "vue-router";
import useClipboard from "vue-clipboard3";
import { isHashMode, httpUrlAddKey } from "@/utils/utils";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
type Option = {
  value: string;
  label: string;
};
type popoverOption = {
  title: string;
  price: number;
  desc: string;
};

type exchangeOption = {
  validityTime: string;
  accountId: string;
  model: string;
  serialNumber: string;
  cardType: number; //卡片类型，1、红卡（编号5开头）。2、黑卡（编号8开头）。
  timeArray: Array<string>; //数组[年，月，日]
};
// select opetion
// const options = ref<Option[]>([
//   { value: "gpt4", label: "GPT-4" },
//   { value: "gpt432", label: "GPT-4 32K" },
//   { value: "gpt-35-turbo", label: "GPT-3.5" },
//   { value: "xy-openai-gpt35-16k", label: "GPT-3.5 16K" },
// ]);
const popoverOptions = ref<popoverOption[]>([
  { title: "个人", price: 698, desc: "内含20美金" },
  { title: "团队(10人以内)", price: 1298, desc: "内含50美金" },
  { title: "企业", price: 6000, desc: "内含400美金" },
]);
const exchangeItem = ref<exchangeOption | null>(null);
const exchangeContinue = ref(false);
const popoverIndex = ref(0);
const options = computed<Option[]>(() => {
  return exchangeItem.value
    ? [
        { value: "gpt-4", label: "GPT-4" },
        { value: "gpt432", label: "GPT-4 32K" },
        { value: "gpt-35-turbo", label: "GPT-周卡" },
        { value: "xy-openai-gpt35-16k", label: "GPT-3.5 16K" },
      ]
    : [
        { value: "gpt-4", label: "GPT-4" },
        { value: "gpt432", label: "GPT-4 32K" },
        { value: "gpt-35-turbo", label: "GPT-3.5" },
        { value: "xy-openai-gpt35-16k", label: "GPT-3.5 16K" },
      ];
});
const aiVersion = ref<string>(options.value[0].value);
const showDialog = ref(false);
const popoverShow = ref(false);
const mpQrcodeShow = ref(false);
const mpQrCodeShow2 = ref(false);
const exchangeShow = ref(false);
const fadeName = ref("fadeIn");
const inviteCode = ref<any>("");
const userInfo = ref({
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
});
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
const drawer = ref(false);
const keyDrawer = ref(false);
const exchangeDrawer = ref(false);
const qrCodeImgUrl = ref("");
const exchangeCode = ref("");
const cardType = ref(0); //0是默认卡片，1是红卡，2是黑卡
let requestLock = false;
// 使用插件
const { toClipboard } = useClipboard();
const proxy: any = getCurrentInstance()?.proxy ?? null;
const nickname = ref("");
const animate = ref(true);
const showUserInfo = ref(false);
const $router = useRouter();
const redirectUrl = ref<any>("");
const swiperList = ref([
  {
    title: "MBM OpenAI GPT-4 新模型更新",
    titleStyle: { color: "black" },
    desc: "2023年12月，我们更新了 Azure OpenAI 一系列新模型到我们的服务中。包括：新增 GPT-4 Turbo，Dall.E 3 图像模型，GPT-3.5模型。\n并为开发者额外新增：GPT-4 Turbo with Version，GPT3.5 Fine Tuning 微调功能和 Whisper 模型。",
    descStyle: { color: "black" },
    bg: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/bg1.jpg",
    button: "了解更多",
  },
  {
    title: "MBM 城市聚会",
    desc: "想与身边的人一起讨论 AI 带来的有趣变化？\n 加入我们精心为你准备的城市组局活动，\n 学习更多，朋友更多。",
    bg: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/bg2.jpg",
    button: "加入我们",
  },
  {
    title: "MBM OpenAI GPT-4 服务",
    desc: "作为 微软 Azure OpenAI 中国合作伙伴，MBM 为\n企业用户和个人消费者提供可靠、企业级 OpenAI 服务，\n实现快速访问，无需代理的先进体验。",
    bg: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider1.png",
    button: "探索与 OpenAI 的区别",
  },
  {
    title: "MBM OpenAI GPT-4 服务",
    desc: "我们仅按您使用的内容收取费用，计费标准\n通常还取决于你调用了哪种模型，GPT-3.5 擅长日常会话，而 GPT-4 在专业性和推理能力上则更为强大。",
    bg: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider2.png",
    button: "MBM OpenAI 服务如何计费",
  },
  {
    title: "MBM OpenAI GPT-4 服务",
    desc: "为了满足你对商用级别 OpenAI 服务的苛刻要求，\n我们从产品设计的一开始便考虑了安全的重要性，以此确保\n每一个从你访问到的数据，都受到隐私保护和加密处理。",
    bg: "https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/slider3.png",
    button: "企业级 OpenAI 是什么",
  },
]);
// faq list
const questionList = ref<Option[]>([
  {
    value: "3",
    label: "企业级 OpenAI 服务是什么意思？",
  },
  { value: "2", label: "MBM OpenAI 服务如何计费" },
  { value: "1", label: "探索与 OpenAI 的区别" },
]);
watch(
  () => exchangeCode.value,
  async (newValue) => {
    if (newValue.length >= 8) {
      if (requestLock) {
        return;
      }
      requestLock = true;
      let usr = localStorage.getItem("userInfo");
      const res = await getSerialNumber({
        token: usr ? JSON.parse(usr).token : "",
        accessKey: userInfo.value.accessKey,
        code: newValue,
      });
      if (res.data.code == 11000) {
        const num: string = res.data.data.serialNumber;
        if (num) {
          cardType.value = num.replace("NO.", "").startsWith("8")
            ? 2
            : num.replace("NO.", "").startsWith("5")
            ? 1
            : 0;
        } else {
          cardType.value = 0;
        }
      } else {
        cardType.value = 0;
      }
      requestLock = false;
    } else {
      cardType.value = 0;
    }
  }
);
watch(
  () => exchangeDrawer.value,
  (newValue) => {
    if (!newValue) {
      setTimeout(() => {
        exchangeContinue.value = false;
        exchangeCode.value = "";
      }, 500);
    }
  }
);
watch(
  () => aiVersion.value,
  (newValue) => {
    proxy?.$refs["collect"]?.setAIVersion(newValue);
  }
);
// watch(
//   () => showDialog.value,
//   (newValue) => {
//     if (!newValue) {
//       if (proxy?.$refs["login"]) {
//         proxy?.$refs["login"].reset();
//       }
//     }
//   }
// );
onMounted(() => {
  slideBanner();
});
onBeforeMount(() => {
  if ($router.currentRoute.value.query.redirectUrl) {
    redirectUrl.value = $router.currentRoute.value.query.redirectUrl;
  }
  if ($router.currentRoute.value.query.inviteCode) {
    inviteCode.value = $router.currentRoute.value.query.inviteCode;
  }
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
  }
});
const updateUserInfo = () => {
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
  }
};
//请求接口获取用户信息
const getUserInfo = async (token: string, accessKey: string) => {
  const res = await doGetInfo({ token, accessKey });
  if (res.data.code === 11000) {
    userInfo.value = res.data.data;
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setUserInfo(userInfo.value);
    }
    const firstC = getFirstChar(userInfo.value.name);
    nickname.value = firstC;
    if (
      qrCodeImgUrl.value.length == 0 &&
      userInfo.value.inviteCode &&
      userInfo.value.inviteCode.length > 0
    ) {
      QRCode.toDataURL(userInfo.value.inviteCode).then((res1: any) => {
        qrCodeImgUrl.value = res1;
      });
    }
    getExchangeTime(userInfo.value.id);
  } else if (res.data.code === 12004) {
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
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setUserInfo(userInfo.value);
    }
    nickname.value = "";
    showUserInfo.value = false;
    qrCodeImgUrl.value = "";
  }
};
const getExchangeTime = async (accountId: string) => {
  let usr = localStorage.getItem("userInfo");
  const res = await getValidatyTime({
    token: usr ? JSON.parse(usr).token : "",
    accessKey: userInfo.value.accessKey,
    accountId: accountId,
  });
  if (res.data.code === 11000) {
    if (!agent.value) {
      if (res.data.data.length > 0) {
        const item = res.data.data[0];
        const timeStr = dayjs(item.validityTime);
        if (dayjs().isSameOrBefore(timeStr)) {
          let cardType = 1;
          if (item && item.serialNumber) {
            const temp: string = item.serialNumber.replace("NO.", "");
            cardType = temp ? (temp.startsWith("8") ? 2 : 1) : 1;
          }
          proxy?.$refs["lf-side"]?.setExchangeItem(
            Object.assign({}, item, {
              cardType,
              timeArray: [timeStr.year(), timeStr.month() + 1, timeStr.date()],
            })
          );
          proxy?.$refs["lf-side"]?.setAiVersion(2);
        } else {
          //周卡已过期
          proxy?.$refs["lf-side"]?.setExchangeItem(null);
          proxy?.$refs["lf-side"]?.setAiVersion(0);
        }
      } else {
        proxy?.$refs["lf-side"]?.setExchangeItem(null);
        proxy?.$refs["lf-side"]?.setAiVersion(0);
      }
    } else {
      if (res.data.data.length > 0) {
        const item = res.data.data[0];
        const timeStr = dayjs(item.validityTime);
        if (dayjs().isSameOrBefore(timeStr)) {
          let cardType = 1;
          if (item && item.serialNumber) {
            const temp: string = item.serialNumber.replace("NO.", "");
            cardType = temp ? (temp.startsWith("8") ? 2 : 1) : 1;
          }
          exchangeItem.value = Object.assign({}, item, {
            cardType,
            timeArray: [timeStr.year(), timeStr.month() + 1, timeStr.date()],
          });
          aiVersion.value = options.value[2].value;
        } else {
          //周卡已过期
          exchangeItem.value = null;
          aiVersion.value = options.value[0].value;
        }
      } else {
        exchangeItem.value = null;
        aiVersion.value = options.value[0].value;
      }
    }
  } else {
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setExchangeItem(null);
      proxy?.$refs["lf-side"]?.setAiVersion(0);
    } else {
      exchangeItem.value = null;
      aiVersion.value = options.value[0].value;
    }
  }
};
const setPopoverShow = (show: boolean) => {
  popoverShow.value = show;
  if (show) {
    updateUserInfo();
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};
const setExchangeShow = (show: boolean) => {
  exchangeShow.value = show;
  if (show) {
    getExchangeTime(userInfo.value.id);
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};
// 显示登录选项
const toLogin = () => {
  let usr = localStorage.getItem("userInfo");
  if (!usr) {
    if (!agent.value) {
      nextTick(() => {
        showDialog.value = true;
      });
    } else {
      $router.push({
        name: "singleLogin",
        query: {
          redirectUrl: window.location.href,
        },
      });
    }
  }
};
// swiper slide
const changeSwiper = () => {
  animate.value = false;
  setTimeout(() => {
    animate.value = true;
  }, 100);
};
// // 复制
// const copy = async () => {
//   try {
//     if (isHashMode($router.options.history.base)) {
//       // 复制
//       await toClipboard(
//         `${
//           window.location.origin + import.meta.env.VITE_PUBLIC_BASE
//         }#/?inviteCode=${userInfo.value.inviteCode}`
//       );
//     } else {
//       // 复制
//       await toClipboard(
//         `${
//           window.location.origin + import.meta.env.VITE_PUBLIC_BASE
//         }?inviteCode=${userInfo.value.inviteCode}`
//       );
//     }
//     ElMessage({ message: "复制成功", type: "success" });
//   } catch (e) {
//     ElMessage("复制失败");
//   }
// };
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
const copyText = async (txt: string) => {
  try {
    // 复制
    await toClipboard(txt);
    ElMessage({ message: "复制成功", type: "success" });
  } catch (e) {
    ElMessage("复制失败");
  }
};
const toSkip = (e: any) => {
  const { url, openNew } = e;
  skip(url, openNew);
};
// 跳转url
const skip = (url: string, openNew: boolean) => {
  let usr: any = localStorage.getItem("userInfo");
  let urlString = url;
  if (usr) {
    usr = JSON.parse(usr);
    urlString = httpUrlAddKey(url, "token", usr.token);
    urlString = httpUrlAddKey(urlString, "version", aiVersion.value);
  }
  if (openNew) {
    window.open(urlString);
  } else {
    window.location.href = urlString;
  }
};
const navSetting = () => {
  $router.push({ name: "setting" });
  // if (isHashMode($router.options.history.base)) {
  //   window.open(`${window.location.href.split("#")[0]}#/setting`);
  // } else {
  //   window.open(`${window.location.href.split("?")[0]}setting`);
  // }
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
// 跳转充值
const recharge = () => {
  if (isHashMode($router.options.history.base)) {
    window.open(`${window.location.href.split("#")[0]}#/recharge`);
  } else {
    window.open(`${window.location.href.split("?")[0]}recharge`);
  }
};
// 滑动切换
const slideBanner = () => {
  //选中的轮播图
  var box = document.querySelector(".el-carousel__container");
  var startPoint = 0;
  var stopPoint = 0;
  //重置坐标
  var resetPoint = function () {
    startPoint = 0;
    stopPoint = 0;
  };
  //手指按下
  box?.addEventListener("touchstart", function (e: any) {
    //手指点击位置的X坐标
    startPoint = e.changedTouches[0].pageX;
  });
  //手指滑动
  box?.addEventListener("touchmove", function (e: any) {
    //手指滑动后终点位置X的坐标
    stopPoint = e.changedTouches[0].pageX;
  });
  //当手指抬起的时候，判断图片滚动离左右的距离
  box?.addEventListener("touchend", function () {
    if (stopPoint == 0 || startPoint - stopPoint == 0) {
      resetPoint();
      return;
    }
    if (startPoint - stopPoint > 0) {
      resetPoint();
      proxy?.$refs["slide"].next();
      return;
    }
    if (startPoint - stopPoint < 0) {
      resetPoint();
      proxy?.$refs["slide"].prev();
      return;
    }
  });
};
const logout = () => {
  ElMessageBox.confirm("是否退出登录?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let usr = localStorage.getItem("userInfo");
    doLogout({
      token: usr ? JSON.parse(usr).token : "",
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
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setUserInfo(userInfo.value);
    } else {
      exchangeItem.value = null;
    }
    nickname.value = "";
    showUserInfo.value = false;
    qrCodeImgUrl.value = "";
  });
};
const toNavQuestion = (e: any) => {
  const { blogType } = e;
  navQuestion(blogType);
};
const navQuestion = (blogType: string) => {
  $router.push({ name: "blog", query: { blogType } });
};
const hideQrcode = () => {
  fadeName.value = "fadeOut";
  setTimeout(() => {
    mpQrcodeShow.value = false;
    fadeName.value = "fadeIn";
  }, 1000);
};
const hideQrCode2 = () => {
  fadeName.value = "fadeOut";
  setTimeout(() => {
    mpQrCodeShow2.value = false;
    fadeName.value = "fadeIn";
  }, 1000);
};
const showMessage = (params: any) => {
  ElMessage(params);
};
const loginComplete = (data: any) => {
  if (data) {
    showDialog.value = false;
    localStorage.setItem("userInfo", JSON.stringify(data));
    userInfo.value = data;
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setUserInfo(userInfo.value);
    }
    const firstC = getFirstChar(userInfo.value.name);
    nickname.value = firstC;
    getUserInfo(userInfo.value.token, userInfo.value.accessKey);
    if (redirectUrl.value) {
      skip(redirectUrl.value, false);
    } else {
      if (
        qrCodeImgUrl.value.length == 0 &&
        userInfo.value.inviteCode &&
        userInfo.value.inviteCode.length > 0
      ) {
        QRCode.toDataURL(userInfo.value.inviteCode).then((res1: any) => {
          qrCodeImgUrl.value = res1;
        });
      }
    }
  }
};
const toPopoverConfirm = (e: any) => {
  const { keyType } = e;
  popoverConfirm(keyType);
};
const toExchangeConfirm = (e: { code: string }) => {
  if (agent.value) {
    if (exchangeCode.value.length == 0) {
      ElMessage({ message: "请输入密钥", type: "error" });
      return;
    }
    if (cardType.value == 0) {
      ElMessage({ message: "密钥不正确，请重新输入", type: "error" });
      return;
    }
  }
  ElMessageBox.confirm("是否使用该卡片？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    exchangeConfirm(e);
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.changeExchange(true);
    }
  });
};
const exchangeConfirm = async (e: { code: string }) => {
  const { code } = e;
  let usr = localStorage.getItem("userInfo");
  const res = await doExchangeCode({
    token: usr ? JSON.parse(usr).token : "",
    accessKey: userInfo.value.accessKey,
    accountId: userInfo.value.id,
    code,
  });
  if (res.data.code === 11000) {
    getExchangeTime(userInfo.value.id);
  } else {
    ElMessage(res.data.msg);
  }
  if (!agent.value) {
    proxy?.$refs["lf-side"]?.setExchangeContinue(false);
  } else {
    exchangeContinue.value = false;
    cardType.value = 0;
    exchangeCode.value = "";
  }
};
const popoverConfirm = (keyType: number) => {
  if (isHashMode($router.options.history.base)) {
    window.open(
      `${window.location.href.split("#")[0]}#/keycharge?keyType=${keyType}`
    );
  } else {
    window.open(
      `${window.location.href.split("?")[0]}keycharge?keyType=${keyType}`
    );
  }
};
const openExchangeDrawer = () => {
  if (userInfo.value.name) {
    exchangeDrawer.value = true;
    drawer.value = false;
  } else {
    toLogin();
  }
};
const changeAiVersion = (val: string) => {
  aiVersion.value = val;
};
const collectSkip = (e: { urlString: string; openNew: boolean }) => {
  let { urlString, openNew } = e;
  if (userInfo.value.isAuth == 1) {
    urlString = httpUrlAddKey(urlString, "active", "true");
  }
  if (openNew) {
    window.open(urlString);
  } else {
    window.location.href = urlString;
  }
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
@mixin hover5Style {
  &:hover {
    color: #fff;
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
@mixin chargeHover5Style {
  &:hover {
    color: #fff;
    .my-count-hover {
      width: 100%;
      transition: all 0.3s;
    }
    // .top {
    //   top: 0;
    //   background: rgba(255, 255, 255, 0.15);
    // }
    // .right {
    //   right: 0;
    //   background: rgba(255, 255, 255, 0.15);
    // }
    // .bottom {
    //   bottom: 0;
    //   background: rgba(255, 255, 255, 0.15);
    // }
    // .left {
    //   left: 0;
    //   background: rgba(255, 255, 255, 0.15);
    // }
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
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
.px-common-layout {
  // height: 100vh;
  //   min-width: 1200px;
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
  .overlay-1 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .qrcode {
      width: 300px;
      height: 300px;
    }
    .content {
      width: 200px;
      margin-top: 20px;
    }
    .content2 {
      width: 500px;
      margin-top: 20px;
      color: #ffffff;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
    }
    .back {
      color: #fff;
      opacity: 0.6;
      text-decoration: underline;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 20px;
    }
  }
  .overlay-2 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .qrcode {
      width: 200px;
      height: 200px;
    }
    .content {
      width: 200px;
      margin-top: 20px;
    }
    .content2 {
      width: 100%;
      margin-top: 20px;
      color: #ffffff;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
    }
    .back {
      color: #fff;
      opacity: 0.6;
      text-decoration: underline;
      cursor: pointer;
      font-size: 0.8rem;
      margin-top: 20px;
    }
  }
  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 100vw;
    background: #ffffff;
    padding: 0 20px;
    .logo {
      //   height: 33px;
      height: 20px;
    }
    .week {
      position: absolute;
      left: 5px;
      top: 0;
      background: rgba(7, 25, 54, 0.8);
      border-radius: 100px;
      padding: 0 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      div {
        color: rgba(255, 255, 255, 0.94);
        font-size: 0.6rem;
        line-height: 20px;
        font-weight: bold;
        font-family: Gotham-Rounded;
        transform: translateY(1px);
      }
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
  .aside {
    width: 20vw;
    min-height: 100vh;
    min-width: 280px;
    background: #07070d;
    color: #fff;
    box-sizing: border-box;
  }
  .phone-aside {
    width: 80vw;
    min-height: 100vh;
    // height: 100vh;
    // overflow: hidden;
    background: #07070d;
    color: #fff;
    box-sizing: border-box;
    padding: 33px 30px 33px 30px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    .flex {
      width: 100%;
    }
    .logo {
      //   height: 33px;
      height: 32px;
    }
    .gpt-button {
      width: 100%;
      height: 55px;
      background: #4383ea;
      border-radius: 8px;
      font-size: 12px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      // line-height: 40px;
      margin: 80px auto 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
    }
    .color-button {
      margin-top: 20px;
      background: linear-gradient(23deg, #4383ea 0%, #4861eb 49%, #8748eb 100%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      font-family: FUTURA-MEDIUM;
      @include chargeHover5Style;
      position: relative;
      .light {
        font-size: 18px;
        margin-left: 5px;
      }
      .my-count-hover {
        width: 0;
        height: 100%;
        background: rgba(255, 255, 255, 0.15);
        transition: all 0.3s;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 10px;
      }
    }
    .get-one-dollar {
      font-family: FUTURA-MEDIUM;
    }
    .share-my-code {
      width: 100%;
      box-sizing: border-box;
      padding: o 10px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.8);
      .code {
        text-decoration: underline;
        cursor: pointer;
        font-size: 16px;
      }
    }
    .default-model {
      // width: 235px;
      width: 100%;
      // height: 47px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      margin-bottom: 30px;
      @include hover2Style;
      .icon-ai {
        display: block;
      }
      &:nth-of-type(1) {
        .icon-ai {
          width: 30px;
        }
      }
      &:nth-of-type(2),
      &:nth-of-type(3),
      &:nth-of-type(4) {
        .icon-ai {
          width: 24px;
          margin-right: 3px;
          filter: brightness(0.4);
        }
      }
      .model-name {
        margin: 0 3px 0 10px;
        font-size: 16px;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        flex: 1;
      }
      .active {
        font-size: 12px;
        color: #fff;
        white-space: nowrap;
      }
      .ai-select {
        ::placeholder {
          color: #fff;
        }

        :deep(.el-input__wrapper) {
          background: #202226;
          color: #ffffff;
          min-height: 33px;
          max-width: 140px;
          min-width: 100px;
          box-shadow: none !important;
          border: 1px dashed rgba(255, 255, 255, 0.6);
          box-sizing: border-box;
          .el-input__inner {
            font-size: 16px;
            font-family: FUTURA-MEDIUM;
            font-weight: bold;
            color: #ffffff;
          }
        }
      }
      //   .w128 {
      //     width: 128px;
      //   }
      //   .w171 {
      //     width: 171px;
      //   }
    }
    .default-model:nth-last-child(1) {
      margin-bottom: 80px;
    }
    .question-box {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0 auto;
      .question {
        font-size: 12px;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.4);
        margin: 11px 0;
        cursor: pointer;
        @include hover5Style;
      }
    }
  }
  .header {
    height: 36vh;
    position: relative;
    padding: 0;
    .open-ai {
      // min-width: 19vw;
      height: 5vh;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #000000;
      font-size: 1rem;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      position: absolute;
      left: 7vw;
      bottom: 5vh;
      transition: all 0.3s;
      padding: 0 20px;
      &:hover {
        padding: 0 50px;
        transition: all 0.3s;
      }
    }
    .swiper {
      height: 36vh;
      :deep(.el-carousel__container) {
        height: 36vh;
      }
      :deep(.el-carousel__indicator--horizontal) {
        flex-shrink: 0;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 10px;
        padding: 0;
        bottom: 10px;
        border: none;
      }
      :deep(.el-carousel__indicator.is-active) {
        background: #fff;
      }
      :deep(.el-carousel__button) {
        display: none;
      }
    }

    .swipe {
      height: 100%;
      width: 100%;
      color: #fff;
      box-sizing: border-box;
      padding: 3vh 4vw;
      .title {
        margin-left: 2vw;
        font-size: 1.8rem;
        font-family: FUTURA-MEDIUM;
        font-weight: 500;
        color: #ffffff;
      }
      .animate__delay-1 {
        animation-delay: 0.1s;
      }
      .animate__delay-2 {
        animation-delay: 0.2s;
      }
      .animate__delay-3 {
        animation-delay: 0.3s;
      }
      .desc {
        width: 50vw;
        height: 14vh;
        margin-top: 1.5vh;
        font-size: 1.4rem;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        line-height: 1.8rem;
        color: rgba(255, 255, 255, 0.95);
        white-space: pre-wrap;
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
  }
  .phone-header {
    height: 260px;
    position: relative;
    padding: 0;
    .open-ai {
      min-width: 128px;
      height: 23px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #000000;
      font-size: 12px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      position: absolute;
      left: 50px;
      bottom: 40px;
      transition: all 0.3s;
      padding: 0 20px;
      &:hover {
        padding: 0 50px;
        transition: all 0.3s;
      }
    }
    .swiper {
      height: 260px;
      :deep(.el-carousel__container) {
        height: 260px;
      }
      :deep(.el-carousel__indicator--horizontal) {
        flex-shrink: 0;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 10px;
        padding: 0;
        bottom: 10px;
        border: none;
      }
      :deep(.el-carousel__indicator.is-active) {
        background: #fff;
      }
      :deep(.el-carousel__button) {
        display: none;
      }
    }

    .swipe {
      height: 260px;
      width: 100vw;
      color: #fff;
      box-sizing: border-box;
      padding: 20px 36px;
      .title {
        font-size: 18px;
        font-family: FUTURA-MEDIUM;
        font-weight: 500;
        color: #ffffff;
      }
      .animate__delay-1 {
        animation-delay: 0.1s;
      }
      .animate__delay-2 {
        animation-delay: 0.2s;
      }
      .animate__delay-3 {
        animation-delay: 0.3s;
      }
      .desc {
        // width: 764px;
        // height: 150px;
        // margin-top: 40px;
        font-size: 14px;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        // line-height: 16px;
        color: rgba(255, 255, 255, 0.95);
        white-space: pre-wrap;
      }
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
    }
    .show-user {
      padding: 25px 20px 15px 15px;
      width: 80vw;
      height: 300px;
      transition: all 0.3s;
    }
  }
  .main {
    padding: 0;
    height: 64vh;
    box-sizing: border-box;
    // padding: 40px 50px;
    background: #f5f5f7;
    .main-header {
      background: #ffffff;
      width: calc(100% - 30px);
      height: 148px;
      border: 1px solid #707070;
      margin-bottom: 20px;
      border-radius: 79px;
      padding: 20px 60px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: row;
      .main-header-content {
        height: 108px;
        width: 220px;
        min-width: 160px;
        display: flex;
        padding-left: 30px;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        .main-header-content-top {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
        }
      }
      .main-header-content2 {
        height: 108px;
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        .main-header-content2-bg {
          background: #3bad4f;
          width: 100%;
          max-width: 520px;
          min-width: 400px;
          // height: 56px;
          border-radius: 79px;
          padding: 16px 30px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-direction: row;
          .main-header-content2-title {
            font-size: 14px;
            color: #ffffff;
          }
          .main-header-content2-right {
            font-size: 12px;
            color: #ffeaa8;
          }
        }
      }
      .main-header-content3 {
        height: 108px;
        width: 228px;
        min-width: 148px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
      }
    }
    .title {
      font-size: 23px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #333333;
      margin: 0 auto 23px;
      .app-num {
        font-size: 14px;
        margin-left: 8px;
        font-weight: bold;
      }
    }
    .foot {
      width: 100%;
      // height: 8vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background-color: #000;
      padding: 10px 0;
      .txt {
        font-size: 0.6rem;
        line-height: 1rem;
        color: #fff;
        a {
          color: #fff;
        }
      }
    }
  }
  .phone-main {
    padding: 0;
    height: calc(100vh - 320px);
    width: 100vw;
    box-sizing: border-box;
    // padding: 20px 25px;
    background: #f5f5f7;
    .phone-main-header {
      width: 100%;
      height: 108px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: row;
      .phone-main-header-content {
        height: 108px;
        display: flex;
        padding-left: 10px;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        .phone-main-header-content-top {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
        }
      }
    }
    .phone-main-header-content2 {
      background: #3bad4f;
      width: 100%;
      border-radius: 79px;
      padding: 16px 30px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-direction: row;
      .phone-main-header-content2-title {
        font-size: 14px;
        color: #ffffff;
      }
    }
    .title {
      font-size: 16px;
      font-family: FUTURA-MEDIUM;
      font-weight: bold;
      color: #333333;
      margin: 0 auto 20px;
      .app-num {
        font-size: 16px;
        margin-left: 8px;
        font-weight: bold;
      }
    }

    .foot {
      width: 100%;
      padding: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background-color: #000;
      .txt {
        font-size: 0.6rem;
        line-height: 1rem;
        color: #fff;
        a {
          color: #fff;
        }
      }
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

.phone-dialog {
  width: 80vw;
  height: 280px;
  background: #ffffff;
  border: 1px solid #707070;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
  border-radius: 11px;
  overflow: hidden;
  .type-word {
    width: 100%;
    height: 120px;
    background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/type-word.png")
      center / cover no-repeat;
    border-radius: 11px 11px 0px 0px;
    padding: 56px 10px 65px 90px;
    box-sizing: border-box;
    .mask {
      width: 100%;
      height: 120px;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: #818da3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
    border-radius: 50%;
    margin: 0 auto;
    position: absolute;
    top: 100px;
    left: 56%;
    transform: translateX(-38.5px);
    color: #fff;
    font-size: 20px;
    font-family: FUTURA-MEDIUM;
    font-weight: bold;
    color: #ffffff;
  }
  .one-key {
    width: 60vw;
    height: 32px;
    background: #ffffff;
    border: 1px solid #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 40px auto 30px;
    font-size: 12px;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
  }
  .ipt-box {
    position: relative;
    margin: 10px auto 10px;
    .tel {
      width: calc(80vw - 104px);
      border: none;
      margin: 40px 52px 0;
      ::placeholder {
        letter-spacing: 5px;
      }
      :deep(.el-input__wrapper) {
        border-bottom: 1px solid #000;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      :deep(.el-input__inner) {
        text-align: left;
        font-size: 14px;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
        color: #000000;
        letter-spacing: 7.9px;
      }
    }
    .btm {
      height: 33px;
      width: 9px;
      background: #fff;
      position: absolute;
      top: 40px;
      left: 95px;
    }
    .btm2 {
      left: 167px;
    }
  }
  .square-box {
    position: relative;
    margin: 10px auto 10px;
    .tel {
      width: 80vw;
      border: none;
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        position: relative;
        z-index: 3;
        background: none;
        top: 30px;
      }
      :deep(.el-input__inner) {
        padding: 0 36px;
        font-size: 16px;
        font-family: FUTURA-MEDIUM;
        font-weight: 600;
        color: #000000;
        letter-spacing: 62px;
        text-align: left;
        overflow-x: hidden;
        overflow: hidden;
      }
    }
    .bb {
      // width: calc(80vw - 40px);
      height: 32px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      left: 30px;
      .square {
        height: 32px;
        width: 23px;
        border: 1px solid #000000;
        // margin-right:3px;
      }
      //   .square2 {
      //     left: 140px;
      //   }
      //   .square3 {
      //     left: 210px;
      //   }
      //   .square4 {
      //     left: 280px;
      //   }
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
      width: 80px;
      margin: 20px auto 0;
      border-radius: 50%;
      background: url("https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/hudu.png")
        center / contain no-repeat;
    }
  }
  .resend {
    height: 30px;
    font-size: 14px;
    font-family: FUTURA-MEDIUM;
    font-weight: 400;
    color: #000000;
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
      color: rgba(0, 0, 0, 0.3);
    }
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
  }
}
:deep(.phone-wrap-dialog) {
  width: 80vw;
  overflow: hidden;
  border-radius: 11px;
}
:deep(.wrap-dialog) {
  width: 588px;
  overflow: hidden;
  border-radius: 11px;
}
:deep(.el-dialog__header) {
  display: none;
}
:deep(.el-dialog__body) {
  width: auto;
  height: auto;
  padding: 0;
  border-radius: 11px;
  overflow: hidden;
}
:deep(.el-overlay) {
  background: rgba(0, 0, 0, 0.8);
}
.options {
  width: 100%;
  font-size: 1rem;
  font-family: FUTURA-MEDIUM;
  font-weight: bold;
  color: #ffffff;
  background: #000 !important;
  padding: 0 7px;
  &:hover {
    background: #1b1c21 !important;
  }
}
.phone-options {
  width: 100%;
  font-size: 16px;
  font-family: FUTURA-MEDIUM;
  font-weight: bold;
  color: #ffffff;
  background: #000 !important;
  padding: 0 7px;
  &:hover {
    background: #1b1c21 !important;
  }
}
// :global(.el-popper) {
//   background: #000 !important;
//   //   border: 1px dashed rgba(255, 255, 255, 0.6) !important;
//   margin-top: -14px;
//   box-sizing: border-box;
//   border-radius: 0 0 3px 3px;
//   border: none;
// }
:global(.el-select-dropdown__list) {
  width: 100%;
  border: 1px dashed rgba(255, 255, 255, 0.6) !important;
  border-top: none !important;
  margin: 0 !important;
}
:global(.el-select-dropdown) {
  background: #000 !important;
  border: none;
}
:deep(.el-scrollbar) {
  background: #000 !important;
  border: none;
}
:global(.user.el-popper.is-light) {
  background: #fff !important;
  border: none;
}
:global(.el-popper__arrow) {
  display: none;
}
:global(.select-down) {
  width: 140px;
  min-width: 140px !important;
}
:v-deep(.select-down) {
  display: none;
}
.bg-block {
  background: #07070d;
}
:deep(.el-drawer__body) {
  flex: 1;
  padding: 0;
  overflow: auto;
}
.popover-container {
  width: 80vw;
  height: 100vh;
  background: #07070d;
  box-sizing: border-box;
  padding: 33px 20px 33px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  .popover-logo {
    width: 10vw;
    min-width: 140px;
    visibility: hidden;
    margin-bottom: 4vh;
  }
  .popover-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    .popover-title {
      font-size: 1.5rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      opacity: 1;
    }
    .popover-desc {
      font-size: 1rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #89919e;
      opacity: 1;
      margin-top: 10px;
    }
    .description {
      color: rgba(225, 225, 225, 0.7);
      font-size: 0.6rem;
    }
    .resume-container {
      width: 90%;
      color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: row;
      font-size: 1.2rem;
      margin-top: 20px;
      cursor: pointer;
      .txt {
        text-decoration: underline;
      }
    }
    .exchange-input {
      width: 90%;
      border-bottom: #fff solid 1px;
      :deep(.el-input__wrapper) {
        background-color: transparent;
        box-shadow: none;
        padding: 3px 0;
      }
      :deep(.el-input__inner) {
        font-size: 1.2rem;
        font-family: PingFangTC-Semibold;
        color: #fff;
        &::placeholder {
          font-size: 1rem;
          font-family: PingFangTC-Semibold;
          color: #fff;
          opacity: 0.6;
        }
      }
      .clear {
        font-size: 1rem;
        font-family: PingFangTC-Semibold;
        color: #fff;
        opacity: 0.6;
        cursor: pointer;
      }
    }
    .exchange-text {
      display: flex;
      justify-content: space-between;
      width: 90%;
      color: #fff;
      padding-bottom: 10px;
      border-bottom: #fff solid 1px;
      font-size: 0.6rem;
      .space {
        // flex-grow: 1;
      }
      span {
        font-family: PingFangTC-Semibold;
        white-space: nowrap;
      }
    }
    .exchange-confirm {
      padding: 10px 0;
      width: 70%;
      background: rgba(255, 255, 255, 0.1);
      border: #fff solid 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      &:active {
        background: rgba(255, 255, 255, 0.5);
      }
    }
    .exchange-confirm-2 {
      padding: 10px 0;
      width: 70%;
      background: #fff;
      border: #fff solid 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      color: #000;
      font-size: 1.2rem;
    }
    .popover-part {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      margin: 14px 0;
      opacity: 1;
      cursor: pointer;
      &.normal {
        opacity: 0.6;
      }
      .popover-block {
        width: 60%;
        height: 100%;
        background: linear-gradient(
          23deg,
          #4383ea 0%,
          #4861eb 49%,
          #8748eb 100%
        );
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        .internal {
          width: calc(100% - 4px);
          height: calc(100% - 4px);
          box-sizing: border-box;
          border-radius: 12px;
          background: #07070d;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: row;
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
          padding: 0 20px;
        }
      }
      .popover-block-a {
        font-size: 0.6rem;
        font-family: FUTURA-MEDIUM;
        font-weight: 500;
        color: #ffffff;
        text-decoration: underline;
        opacity: 0.9;
      }
      .popover-right {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-direction: column;
        .price {
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
        }
        .desc {
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #89919e;

          &:hover {
            color: #fff;
          }
          &:active {
            color: #89919e;
          }
        }
        .desc2 {
          font-size: 0.6rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
          opacity: 0.6;
        }
      }
    }
    .popover-part-a {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      margin: 14px 0;
      cursor: pointer;
      .popover-block-a {
        font-size: 0.6rem;
        font-family: FUTURA-MEDIUM;
        font-weight: 500;
        color: #ffffff;
        text-decoration: underline;
        opacity: 0.9;
      }
      .popover-right {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-direction: column;
        .price {
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
        }
        .desc {
          font-size: 1rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #89919e;
        }
        .desc2 {
          font-size: 0.6rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
          opacity: 0.6;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          flex-direction: column;
          &:hover {
            opacity: 1;
          }
          &:active {
            opacity: 0.5;
          }
        }
      }
    }
    .popover-btn {
      width: 60%;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #ffffff;
      opacity: 1;
      font-size: 1.2rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      margin-top: 14px;
      cursor: pointer;
    }
  }
  .popover-foot-desc {
    font-size: 0.8rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    line-height: 1.2rem;
    color: #ffffff;
    opacity: 0.7;
  }
  .popover-foot-a {
    margin-top: 20px;
    font-size: 0.8rem;
    font-family: FUTURA-MEDIUM;
    font-weight: 500;
    color: #fff;
    opacity: 0.7;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
    &:active {
      opacity: 0.5;
    }
  }
  .popover-ready-upload {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    position: relative;
    .popover-upload {
      width: 70px;
      height: 70px;
      background: url("@/assets/images/head-upload.png") center / 100% 100%
        no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      font-size: 1.4rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
    }
    .popover-head-1 {
      position: absolute;
      width: 70px;
      height: 70px;
      left: 10px;
      top: 30px;
    }
    .popover-head-2 {
      position: absolute;
      width: 70px;
      height: 70px;
      right: 10px;
      top: 0;
    }
    .popover-head-3 {
      position: absolute;
      width: 70px;
      height: 70px;
      right: 30px;
      bottom: 0;
    }
    .popover-question-1 {
      background: linear-gradient(
        352deg,
        #2680eb 0%,
        #276ec3 42%,
        #bfd5f0 100%
      );
      border-radius: 22px;
      font-size: 0.4rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      padding: 4px 8px;
      position: absolute;
      left: 10px;
      bottom: 40px;
    }
    .popover-question-2 {
      background: linear-gradient(
        352deg,
        #2680eb 0%,
        #276ec3 42%,
        #bfd5f0 100%
      );
      border-radius: 22px;
      font-size: 0.4rem;
      font-family: FUTURA-MEDIUM;
      font-weight: 500;
      color: #ffffff;
      padding: 4px 8px;
      position: absolute;
      left: 10px;
      bottom: 0;
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
