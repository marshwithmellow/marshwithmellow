<template>
  <div class="px-common-layout px-no-trans">
    <div v-if="!agent">
      <div class="overlay" v-if="popoverShow || exchangeShow"></div>
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
          ></left-aside>
        </el-aside>
        <el-container>
          <el-aside class="content-aside">
            <div class="title-container">
              <div class="title">Hello，{{ userInfo.name }}</div>
            </div>
            <div class="aside-content">
              <div class="menu-container" @click="menuIndex = 0">
                <div class="menu" :class="menuIndex == 0 ? 'select' : ''">
                  <img
                    src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-user.png"
                    class="menu-icon"
                    :class="menuIndex == 0 ? 'select' : ''"
                  />
                  <div class="text">个人资料</div>
                </div>
              </div>
              <div class="menu-container" @click="menuIndex = 1">
                <div class="menu" :class="menuIndex == 1 ? 'select' : ''">
                  <img
                    src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-list.png"
                    class="menu-icon"
                    :class="menuIndex == 1 ? 'select' : ''"
                  />
                  <div class="text">消费明细</div>
                </div>
              </div>
              <div class="menu-container" @click="menuIndex = 2">
                <div class="menu" :class="menuIndex == 2 ? 'select' : ''">
                  <img
                    src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-dollar.png"
                    class="menu-icon"
                    :class="menuIndex == 2 ? 'select' : ''"
                  />
                  <div class="text">推荐奖励</div>
                </div>
              </div>
              <div
                class="menu-container"
                @click="
                  skip('https://www.showdoc.com.cn/2249626116233450', true)
                "
                v-show="userInfo.isAuth != 0"
              >
                <div class="menu">
                  <img
                    src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-documents.png"
                    class="menu-icon"
                  />
                  <div class="text">开发文档</div>
                </div>
              </div>
            </div>
            <div class="aside-foot">
              <div class="foot-container">
                <div class="foot">
                  <div class="desc">需要帮助？请联系我们</div>
                  <div class="cell">4008316028</div>
                </div>
              </div>
              <div class="foot-container">
                <div class="foot">
                  <div class="logout" @click="logout">退出登录</div>
                </div>
              </div>
            </div>
          </el-aside>
          <el-main class="main">
            <div v-if="userInfo.name" class="avatar" @click="back">
              {{ nickname }}
            </div>
            <el-scrollbar
              height="100vh"
              :wrap-style="{ background: '#1b1b1b', border: 'none' }"
              v-show="menuIndex == 0"
            >
              <div class="main-info">
                <div class="info-container">
                  <div class="info-label"><div class="text">账户类型</div></div>
                  <div
                    class="info-block"
                    :class="{ select: userInfo.accountType === 1 }"
                  >
                    <div class="text">个人</div>
                  </div>
                  <div
                    class="info-line"
                    v-if="userInfo.accountType === 2"
                  ></div>
                  <div
                    class="info-block"
                    :class="{ select: userInfo.accountType === 3 }"
                  >
                    <div class="text">团队</div>
                  </div>
                  <div
                    class="info-line"
                    v-if="userInfo.accountType === 1"
                  ></div>
                  <div
                    class="info-block"
                    :class="{ select: userInfo.accountType === 2 }"
                  >
                    <div class="text">企业</div>
                  </div>
                </div>
                <div class="info-container">
                  <div class="info-label"><div class="text">手机号码</div></div>
                  <div class="info-block-one">
                    <div class="text">{{ userInfo.mobile }}</div>
                  </div>
                </div>
                <div class="info-container">
                  <div class="info-label">
                    <div
                      class="tags"
                      v-if="userInfo.sex != 0 && userInfo.sex != 1"
                    >
                      完善
                    </div>
                    <div class="text">性别</div>
                  </div>
                  <div
                    class="info-block-big"
                    :class="{ select: userInfo.sex === 0 }"
                    @click="updateSex(0)"
                  >
                    <div class="text">先生</div>
                  </div>
                  <div class="info-line"></div>
                  <div
                    class="info-block-big"
                    :class="{ select: userInfo.sex === 1 }"
                    @click="updateSex(1)"
                  >
                    <div class="text">女士</div>
                  </div>
                </div>
                <div class="info-container">
                  <div class="info-label">
                    <div class="tags" v-if="!yearValue && !monthValue">
                      完善
                    </div>
                    <div class="text">生日</div>
                  </div>
                  <div class="info-block-big" :class="{ select: yearValue }">
                    <el-select
                      v-model="yearValue"
                      placeholder="请选择"
                      size="large"
                      popper-class="borther"
                      @change="changeYear"
                    >
                      <el-option
                        v-for="item in yearOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <div class="info-line"></div>
                  <div class="info-block-big" :class="{ select: monthValue }">
                    <el-cascader
                      v-model="monthValue"
                      :options="monthOptions"
                      separator=" "
                      popper-class="borther"
                      @change="changeMonth"
                    />
                  </div>
                </div>
                <div class="info-container">
                  <div class="info-label">
                    <div class="tags" v-if="!cityValue">完善</div>
                    <div class="text">城市</div>
                  </div>
                  <div
                    class="info-block-big-one"
                    :class="{ select: cityValue }"
                  >
                    <el-cascader
                      v-model="cityValue"
                      :options="cityOptions"
                      separator=" "
                      popper-class="city"
                      @change="changeCity"
                      :props="{ value: 'label' }"
                    />
                  </div>
                  <div class="info-desc">
                    <div class="desc">以便我们邀请您参加</div>
                    <div class="desc">MBM OpneAI 线下沙龙</div>
                  </div>
                </div>
                <div class="info-container">
                  <div class="info-label">
                    <div class="tags" v-if="!emailValue">完善</div>
                    <div class="text">邮箱</div>
                  </div>
                  <div class="info-block-one">
                    <input
                      v-model="emailValue"
                      class="info-mail"
                      @blur="emailBlur"
                      placeholder="you@example.com"
                      @keydown.enter="emailBlur"
                    />
                  </div>
                  <div class="info-desc">
                    <div class="desc">获取我们最新</div>
                    <div class="desc">产品介绍和优惠活动信息</div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <el-scrollbar
              height="100vh"
              :wrap-style="{ background: '#1b1b1b', border: 'none' }"
              v-show="menuIndex == 1"
            >
              <div class="main-details">
                <div class="main-title">
                  {{ userInfo.remainAmount ? userInfo.remainAmount : "0" }} 美元
                </div>
                <div class="main-layout">
                  <div class="layout-header">
                    <div class="left">
                      每天消耗提醒：{{ dailyReminder * 5 }} 美元
                    </div>
                    <div class="right">
                      <div class="txt select">GPT4</div>
                      <!-- <div class="txt" style="margin-left: 20px">GPT3.5</div> -->
                    </div>
                  </div>
                  <div style="padding: 0 22px; width: 100%">
                    <custom-slider
                      v-model="dailyReminder"
                      :remainAmount="userInfo.remainAmount"
                    ></custom-slider>
                  </div>
                </div>
                <div class="main-title-container">
                  <div class="main-title">{{ billTotal }} 次请求</div>
                  <div class="calendar-container">
                    <el-date-picker
                      v-model="nowCalendarFormat"
                      type="date"
                      placeholder="请选择查询日期"
                      :disabled-date="disabledCalendar"
                      :prefix-icon="Search"
                      :editable="false"
                      @change="changeCalendar"
                    />
                  </div>
                </div>
                <div class="table-container">
                  <div
                    class="table-arrow"
                    :style="{
                      cursor:
                        tablePageTotal === 0 || tablePageNo === 0
                          ? 'not-allowed'
                          : 'pointer',
                    }"
                    @click="clickArrowLeft"
                  >
                    <img
                      src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-arrow-left.png"
                      style="height: 40px; width: 40px"
                    />
                  </div>
                  <div class="table-contain">
                    <el-row style="width: 100%">
                      <el-col :span="8">
                        <div class="table-header"></div>
                      </el-col>
                      <el-col :span="4">
                        <div
                          class="table-header"
                          style="justify-content: flex-start; padding-left: 5px"
                        >
                          AI 模型
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div
                          class="table-header"
                          style="justify-content: center"
                        >
                          提示Tokens
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div
                          class="table-header"
                          style="justify-content: center"
                        >
                          完成Tokens
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div
                          class="table-header"
                          style="justify-content: flex-end; padding-right: 10px"
                        >
                          消耗美元
                        </div>
                      </el-col>
                    </el-row>
                    <div class="table-bg">
                      <!-- <el-scrollbar
                        height="280px"
                        :wrap-style="{
                          background: '#3a3a3a',
                          'border-radius': '6px',
                          padding: '0 10px 10px',
                        }"
                      >
                      </el-scrollbar> -->
                      <div
                        style="
                          width: 100%;
                          background: #3a3a3a;
                          border-radius: 6px;
                          padding: 0 10px 10px;
                          min-height: 438px;
                        "
                        v-if="tableData.length > 0"
                      >
                        <el-row
                          style="width: 100%"
                          v-for="(item, index) in tableData"
                          :key="index"
                        >
                          <el-col :span="8">
                            <div class="table-small">
                              {{ item.createTime }}
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <div
                              class="table-content"
                              style="
                                justify-content: flex-start;
                                padding-left: 5px;
                              "
                            >
                              {{ item.model }}
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <div
                              class="table-content"
                              style="justify-content: center"
                            >
                              {{ item.promptTokens }}
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <div
                              class="table-content"
                              style="justify-content: center"
                            >
                              {{ item.completionTokens }}
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <div
                              class="table-content"
                              style="
                                justify-content: flex-end;
                                padding-right: 10px;
                              "
                            >
                              {{ item.totalFee }}
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                      <div
                        v-else
                        style="
                          width: 100%;
                          background: #3a3a3a;
                          border-radius: 6px;
                          padding: 0 10px 10px;
                          min-height: 438px;
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                        "
                      >
                        <el-empty
                          description="这里空空如也！换个日期试试？"
                          :image-size="100"
                        />
                      </div>
                    </div>
                    <div class="table-foot">
                      <div class="txt">
                        {{ tablePageTotal === 0 ? "0" : tablePageNo + 1 }}/{{
                          tablePageTotal
                        }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="table-arrow"
                    :style="{
                      cursor:
                        tablePageTotal === 0 ||
                        tablePageNo === tablePageTotal - 1
                          ? 'not-allowed'
                          : 'pointer',
                    }"
                    @click="clickArrowRight"
                  >
                    <img
                      src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-arrow-right.png"
                      style="height: 40px; width: 40px"
                    />
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <el-scrollbar
              height="100vh"
              :wrap-style="{ background: '#1b1b1b', border: 'none' }"
              v-show="menuIndex == 2"
            >
              <div class="main-details">
                <div class="main-title-contain">
                  <div class="main-title">谢谢你的邀请</div>
                  <div class="right">
                    <img
                      src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-tree.png"
                      class="tree"
                    />
                    <div class="active-container">
                      <div class="active">夏季</div>
                      <div class="active">活动*</div>
                    </div>
                    <div class="sell-container">
                      <div class="sell">使用邀请链接首次充值</div>
                      <div class="sell">即可加送 1 美元体验金</div>
                    </div>
                  </div>
                </div>
                <div class="share-container">
                  <div class="content" @click="copyShare">分享我的推荐码：</div>
                  <div
                    class="content"
                    @click="copyShare"
                    style="text-decoration: underline"
                  >
                    {{ userInfo.inviteCode }}
                  </div>
                  <div class="desc">*截止至 2023年7月31日</div>
                </div>
                <div class="main-title-contain">
                  <div class="main-title">
                    {{
                      userInfo.inviteNumber > 0
                        ? userInfo.inviteNumber + "名已接受邀请"
                        : "暂无受邀用户"
                    }}
                  </div>
                  <div class="right2">
                    <div class="sell">获得10%</div>
                    <div class="sell">邀请好友充值奖励返还</div>
                  </div>
                </div>
                <div class="invite-container">
                  <div class="invite-header">
                    <div class="desc">累计获得</div>
                    <div class="title">{{ userInfo.cashBackAmount }} 美元</div>
                  </div>
                  <div class="invite-content">
                    <div
                      v-infinite-scroll="loadmore"
                      class="invite-list"
                      style="overflow: auto"
                      :infinite-scroll-immediate="false"
                      :infinite-scroll-disabled="status == 'nomore'"
                      v-if="inviteList.length > 0"
                    >
                      <div
                        class="content"
                        v-for="(item, index) in inviteList"
                        :key="index"
                      >
                        <div class="invite-avatar">
                          {{ item.userName }}
                        </div>
                        <div class="invite-contain">
                          <div class="time">{{ item.createTime }}</div>
                          <div class="right">
                            <img
                              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/setting-dollar-full.png"
                              class="dollar"
                            />
                            <div class="txt">+{{ item.amount }} 美元</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      style="
                        width: 5vw;
                        height: 280px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <el-divider />
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div v-else>
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
            "
          >
            <img
              class="logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png"
              alt=""
            />
          </div>
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
                  :class="{
                    'animate__animated animate__fadeIn animate__delay-1':
                      animate,
                  }"
                >
                  {{ item.title }}
                </div>
                <div
                  class="desc"
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
          </el-header>
          <el-main class="phone-main">
            <h1 class="title">
              当下热门 AI 应用
              <span class="app-num">(6)</span>
            </h1>
            <collect-item-small :ai-version="aiVersion"></collect-item-small>
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
                  :class="{
                    w128:
                      aiVersion.value === 'GPT-4' ||
                      aiVersion.value === 'GPT-3.5',
                    w171: aiVersion.value === 'GPT-4 32K',
                  }"
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
                  skip('http://visus.ai/', true);
                  drawer = false;
                "
              >
                <img
                  class="icon-ai"
                  src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/icon-ai-self.png"
                  alt=""
                />
                <div class="model-name">训练你自己的 ChatGPT</div>
              </div>
              <div
                class="default-model"
                @click="
                  // train('生成我的GPT4 API Key');
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
                <span class="code" @click="copy">
                  {{ userInfo.inviteCode }}
                </span>
              </div>
            </div>
          </el-aside>
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
                    <div class="desc">
                      {{ userInfo.accountType === 1 ? "团队或企业" : "企业" }}
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
                <div class="popover-part-a">
                  <div class="popover-block-a">访问 MBM OpenAI 开发文档</div>
                  <div class="popover-right">
                    <div class="desc2">
                      <div>密码</div>
                      <div>base123</div>
                    </div>
                  </div>
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
                  我们为个人、团队和企业开发者提供了 GPT
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
import { cityList } from "@/utils/city";
import {
  onBeforeMount,
  ref,
  nextTick,
  getCurrentInstance,
  onMounted,
  watch,
} from "vue";
import CollectItemSmall from "@/components/CollectItemSmall.vue";
import CustomSlider from "@/components/CustomSlider.vue";
import LeftAside from "@/components/Aside.vue";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import { pinyin } from "pinyin-pro";
import {
  queryInfo,
  getBillSum,
  getBillDetails,
  updateUserInfo,
  doLogout,
  getCashPage,
  getValidatyTime,
  doExchangeCode,
} from "@/api/index";
import { useRouter } from "vue-router";
import useClipboard from "vue-clipboard3";
import { isEmail, isHashMode, httpUrlAddKey } from "@/utils/utils";
import { Search } from "@element-plus/icons-vue";
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
type tableOption = {
  accessKey: string;
  completionTokens: number;
  createTime: string;
  gptId: string;
  model: string;
  promptTokens: number;
  totalFee: number;
};
type inviteOption = {
  id: string;
  createTime: string;
  accessKey: string;
  amount: number;
  name: string;
  userName: string;
};
const cityOptions = ref(cityList);
const tableData = ref<Array<tableOption>>([]);
const tablePageNo = ref(0);
const invitePageNo = ref(0);
let freshing = false;
const status = ref("loadmore");
const tableTotal = ref(0);
const tablePageTotal = ref(0);
const nowCalendarFormat = ref("");
const billTotal = ref(0);
const dailyReminder = ref(2);
// select opetion
const options = ref<Option[]>([
  { value: "gpt4", label: "GPT-4" },
  { value: "gpt432", label: "GPT-4 32K" },
  { value: "gpt3.5", label: "GPT-3.5" },
]);
const yearsArray: Option[] = [];
for (let year = 2023; year >= 1950; year--) {
  yearsArray.push({
    value: year.toString(),
    label: year.toString() + " 年",
  });
}
const yearOptions = ref<Option[]>(yearsArray);
const months = [
  { month: "1 月", value: "01", days: 31 },
  { month: "2 月", value: "02", days: 28 },
  { month: "3 月", value: "03", days: 31 },
  { month: "4 月", value: "04", days: 30 },
  { month: "5 月", value: "05", days: 31 },
  { month: "6 月", value: "06", days: 30 },
  { month: "7 月", value: "07", days: 31 },
  { month: "8 月", value: "08", days: 31 },
  { month: "9 月", value: "09", days: 30 },
  { month: "10 月", value: "10", days: 31 },
  { month: "11 月", value: "11", days: 30 },
  { month: "12 月", value: "12", days: 31 },
];
const monthArray = months.map((monthData, index) => {
  const daysArray = [];
  for (let i = 1; i <= monthData.days; i++) {
    daysArray.push({
      value: i < 10 ? "0" + i.toString() : i.toString(),
      label: i + " 日",
    });
  }
  return {
    value: monthData.value,
    label: monthData.month,
    children: daysArray,
  };
});
const monthOptions = ref(monthArray);
const popoverOptions = ref<popoverOption[]>([
  { title: "个人", price: 698, desc: "内含20美金" },
  { title: "团队(10人以内)", price: 1298, desc: "内含50美金" },
  { title: "企业", price: 6000, desc: "内含400美金" },
]);
const popoverIndex = ref(0);
const menuIndex = ref(0);
const aiVersion = ref<Option>(options.value[0]);
const showDialog = ref(false);
const popoverShow = ref(false);
const exchangeShow = ref(false);
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
  dailyReminder: 0,
  sex: -1,
  birthday: "",
  province: "",
  city: "",
  email: "",
  inviteNumber: 0,
  cashBackAmount: 0,
});
const inviteList = ref<Array<inviteOption>>([]);
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
const drawer = ref(false);
const keyDrawer = ref(false);
const qrCodeImgUrl = ref("");
// 使用插件
const { toClipboard } = useClipboard();
const proxy: any = getCurrentInstance()?.proxy ?? null;
const nickname = ref("");
const animate = ref(true);
const showUserInfo = ref(false);
const $router = useRouter();
const yearValue = ref();
const monthValue = ref<Array<string>>([]);
const emailValue = ref("");
const cityValue = ref();
const swiperList = ref([
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
  () => dailyReminder.value,
  async (newValue) => {
    await updateUserInfo({
      token: userInfo.value.token,
      accessKey: userInfo.value.accessKey,
      dailyReminder: newValue * 5,
    });
  }
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
const updateUser = () => {
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
};
//请求接口获取用户信息
const getUserInfo = async (token: string, accessKey: string) => {
  const res = await queryInfo({ token, accessKey });
  if (res.data.code === 11000) {
    userInfo.value = Object.assign({}, res.data.data, {
      mobile: res.data.data.mobile.replace(
        /(\d{3})(\d{0,4})(\d{0,4})/,
        "$1 $2 $3"
      ),
    });
    if (userInfo.value.province && userInfo.value.city) {
      cityValue.value = [userInfo.value.province, userInfo.value.city];
    }
    if (userInfo.value.birthday) {
      const val = userInfo.value.birthday.split("-");
      if (val.length > 2) {
        yearValue.value = val[0];
        monthValue.value = [val[1], val[2]];
      }
    }
    if (userInfo.value.email) {
      emailValue.value = userInfo.value.email;
    }
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
    dailyReminder.value = userInfo.value.dailyReminder
      ? userInfo.value.dailyReminder / 5
      : 2;
    getBills(nowCalendarFormat.value);
    getBillList(nowCalendarFormat.value, tablePageNo.value);
    getInvitList(invitePageNo.value);
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
      dailyReminder: 0,
      sex: -1,
      birthday: "",
      province: "",
      city: "",
      email: "",
      inviteNumber: 0,
      cashBackAmount: 0,
    };
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setUserInfo(userInfo.value);
    }
    nickname.value = "";
    showUserInfo.value = false;
    qrCodeImgUrl.value = "";
    $router.replace({
      name: "home",
    });
  }
};
const getExchangeTime = async (accountId: string) => {
  const res = await getValidatyTime({
    token: userInfo.value.token,
    accessKey: userInfo.value.accessKey,
    accountId: accountId,
  });
  if (res.data.code === 11000) {
    if (!agent.value) {
      if (res.data.data.length > 0) {
        const item = res.data.data[0];
        let cardType = 1;
        if (item && item.serialNumber) {
          const temp: string = item.serialNumber.replace("NO.", "");
          cardType = temp ? (temp.startsWith("8") ? 2 : 1) : 1;
        }
        const timeStr = dayjs(item.validityTime);
        proxy?.$refs["lf-side"]?.setExchangeItem(
          Object.assign({}, item, {
            cardType,
            timeArray: [timeStr.year(), timeStr.month() + 1, timeStr.date()],
          })
        );
      } else {
        proxy?.$refs["lf-side"]?.setExchangeItem(null);
      }
    }
  } else {
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setExchangeItem(null);
    }
  }
};
const getBills = async (createTime: string) => {
  const res = await getBillSum({
    token: userInfo.value.token,
    accessKey: userInfo.value.accessKey,
    createTime,
  });
  if (res.data.code == 11000) {
    billTotal.value = res.data.total;
  }
};
const getBillList = async (createTime: string, pageNo: number) => {
  freshing = true;
  const res = await getBillDetails({
    token: userInfo.value.token,
    accessKey: userInfo.value.accessKey,
    createTime,
    pageNo,
    pageSize: 8,
  });
  if (res.data.code === 11000) {
    tableData.value = res.data.data.map((item: tableOption) =>
      Object.assign({}, item, {
        model: item.model.replace("xy-", "").replace("openai-", ""),
      })
    );
    tableTotal.value = res.data.total;
    const temp = parseInt(tableTotal.value / 8 + "");
    tablePageTotal.value = tableTotal.value % 8 == 0 ? temp : temp + 1;
  }
  freshing = false;
};
const getInvitList = async (pageNo: number) => {
  freshing = true;
  status.value = "loading";
  const res = await getCashPage({
    token: userInfo.value.token,
    accessKey: userInfo.value.accessKey,
    pageNo,
    pageSize: 10,
  });
  if (res.data.code === 11000) {
    if (pageNo === 0) {
      inviteList.value = res.data.data.map((item: inviteOption) =>
        Object.assign({}, item, {
          userName: getFirstChar(item.name),
        })
      );
    } else {
      inviteList.value = inviteList.value.concat(
        res.data.data.map((item: inviteOption) =>
          Object.assign({}, item, {
            userName: getFirstChar(item.name),
          })
        )
      );
    }
  }
  inviteList.value.length >= res.data.total ? "nomore" : "loadmore";
  freshing = false;
};
const setPopoverShow = (show: boolean) => {
  popoverShow.value = show;
  if (show) {
    updateUser();
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
// 复制
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
    urlString = httpUrlAddKey(urlString, "version", aiVersion.value.value);
  }
  if (openNew) {
    window.open(urlString);
  } else {
    window.location.href = urlString;
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
// 跳转充值
const recharge = () => {
  if (isHashMode($router.options.history.base)) {
    window.open(`${window.location.href.split("#")[0]}#/recharge`);
  } else {
    window.open(`${$router.options.history.base}/recharge`);
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
      dailyReminder: 0,
      sex: -1,
      birthday: "",
      province: "",
      city: "",
      email: "",
      inviteNumber: 0,
      cashBackAmount: 0,
    };
    if (!agent.value) {
      proxy?.$refs["lf-side"]?.setUserInfo(userInfo.value);
    }
    nickname.value = "";
    showUserInfo.value = false;
    qrCodeImgUrl.value = "";
    $router.replace({
      name: "home",
    });
  });
};
const toNavQuestion = (e: any) => {
  const { blogType } = e;
  navQuestion(blogType);
};
const navQuestion = (blogType: string) => {
  $router.push({ name: "blog", query: { blogType } });
};
const showMessage = (params: any) => {
  ElMessage(params);
};
const toPopoverConfirm = (e: any) => {
  const { keyType } = e;
  popoverConfirm(keyType);
};
const popoverConfirm = (keyType: number) => {
  if (isHashMode($router.options.history.base)) {
    window.open(
      `${window.location.href.split("#")[0]}#/keycharge?keyType=${keyType}`
    );
  } else {
    window.open(`${$router.options.history.base}/keycharge?keyType=${keyType}`);
  }
};
const updateSex = async (sex: number) => {
  if (userInfo.value.sex == sex) {
    return;
  }
  const res = await updateUserInfo({
    token: userInfo.value.token,
    accessKey: userInfo.value.accessKey,
    sex,
  });
  if (res.data.code == 11000) {
    userInfo.value.sex = sex;
  }
};
const changeYear = async (val: string) => {
  if (val && monthValue.value) {
    await updateUserInfo({
      token: userInfo.value.token,
      accessKey: userInfo.value.accessKey,
      birthday: val + "-" + monthValue.value[0] + "-" + monthValue.value[1],
    });
  }
};
const changeMonth = async (value: any) => {
  if (value && yearValue.value) {
    await updateUserInfo({
      token: userInfo.value.token,
      accessKey: userInfo.value.accessKey,
      birthday: yearValue.value + "-" + value[0] + "-" + value[1],
    });
  }
};
const changeCity = async (value: any) => {
  await updateUserInfo({
    token: userInfo.value.token,
    accessKey: userInfo.value.accessKey,
    province: value[0],
    city: value[1],
  });
};
const emailBlur = async () => {
  if (emailValue.value) {
    if (isEmail(emailValue.value)) {
      const res = await updateUserInfo({
        token: userInfo.value.token,
        accessKey: userInfo.value.accessKey,
        email: emailValue.value,
      });
      if (res.data.code === 11000) {
        ElMessage({ message: "邮箱保存成功", type: "success" });
      } else {
        ElMessage({ message: "邮箱保存失败", type: "error" });
      }
    } else {
      ElMessage({ message: "请输入正确的邮箱", type: "error" });
    }
  } else {
    ElMessage({ message: "请输入邮箱", type: "error" });
  }
};
const disabledCalendar = (val: Date) => {
  return dayjs().isSameOrBefore(dayjs(val));
};
const clickArrowLeft = () => {
  if (freshing || tablePageNo.value == 0) {
    return;
  }
  tablePageNo.value--;
  getBillList(nowCalendarFormat.value, tablePageNo.value);
};
const clickArrowRight = () => {
  if (freshing || tablePageNo.value + 1 === tablePageTotal.value) {
    return;
  }
  tablePageNo.value++;
  getBillList(nowCalendarFormat.value, tablePageNo.value);
};
const changeCalendar = (val: Date) => {
  if (val) {
    nowCalendarFormat.value = dayjs(val).format("YYYY-MM-DD");
    tablePageNo.value = 0;
    getBills(nowCalendarFormat.value);
    getBillList(nowCalendarFormat.value, tablePageNo.value);
  } else {
    nowCalendarFormat.value = "";
    tablePageNo.value = 0;
    getBills(nowCalendarFormat.value);
    getBillList(nowCalendarFormat.value, tablePageNo.value);
  }
};
const back = () => {
  if ($router.hasRoute("home")) {
    $router.back();
  } else {
    $router.replace({ name: "home" });
  }
};
const loadmore = () => {
  if (status.value == "nomore" || freshing) {
    return;
  }
  invitePageNo.value++;
  getInvitList(invitePageNo.value);
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
const toExchangeConfirm = (e: { code: string }) => {
  ElMessageBox.confirm("是否使用该卡片?", "提示", {
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
  const res = await doExchangeCode({
    token: userInfo.value.token,
    accessKey: userInfo.value.accessKey,
    accountId: userInfo.value.id,
    code,
  });
  if (res.data.code === 11000) {
    getExchangeTime(userInfo.value.id);
  } else {
    ElMessage(res.data.msg);
  }
  if (!agent) {
    proxy?.$refs["lf-side"]?.setExchangeContinue(false);
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
.px-common-layout {
  min-width: 100vw;
  min-height: 100vh;
  background: #1b1b1b;
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
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
  .content-aside {
    width: 20vw;
    min-height: 100vh;
    min-width: 280px;
    background: #1b1b1b;
    color: #fff;
    box-sizing: border-box;
    border-left: #707070 solid 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    .title-container {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: row;
      padding-top: 20px;
      .title {
        font-size: 2rem;
        font-weight: bold;
        color: #ffffff;
        opacity: 1;
        font-family: Gotham-Rounded;
      }
    }
    .aside-content {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .menu-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: row;
        margin: 10px 0;
        cursor: pointer;
        .menu {
          height: 70px;
          width: 90%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: row;
          padding: 0 0 0 30px;
          opacity: 0.4;
          &.select {
            background: #07070d;
            opacity: 1;
          }
          &:active {
            background: #07070d;
            opacity: 1;
          }
          &:hover {
            opacity: 1;
          }
          .menu-icon {
            height: 22px;
            width: 22px;
            &.select {
              opacity: 1;
            }
            &:active {
              opacity: 1;
            }
          }
          .text {
            font-size: 1.5rem;
            font-weight: bold;
            color: #ffffff;
            font-family: Gotham-Rounded;
            margin-left: 15px;
          }
        }
      }
    }
    .aside-foot {
      width: 100%;
      height: 30vh;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: column;
      padding: 0 0 33px;
      .foot-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: row;
        .foot {
          height: 70px;
          width: 90%;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          flex-direction: column;
          padding: 0 0 0 30px;
          .desc {
            font-family: Gotham-Rounded;
            font-size: 0.6rem;
            font-weight: 500;
            color: #8a8b8b;
            opacity: 1;
          }
          .cell {
            font-size: 1.2rem;
            font-weight: 500;
            color: #8a8b8b;
            font-family: Gotham-Rounded;
            opacity: 1;
          }
          .logout {
            font-size: 1.2rem;
            font-weight: bold;
            color: #ffffff;
            text-decoration: underline;
            opacity: 0.8;
            cursor: pointer;
            font-family: Gotham-Rounded;
          }
        }
      }
    }
  }
  .main {
    min-height: 100vh;
    padding: 0;
    background: #1b1b1b;
    position: relative;
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
    .main-info {
      width: 100%;
      padding: 20vh 0 20vh 100px;
      .info-container {
        width: 80%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        margin-bottom: 40px;
        min-width: 600px;
        .info-label {
          opacity: 1;
          height: 100%;
          width: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          min-width: 180px;
          .tags {
            padding: 2px 8px;
            background: #2c2b2a;
            opacity: 1;
            border-radius: 10px;
            font-size: 0.6rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #707070;
            opacity: 1;
            margin-right: 5px;
          }
          .text {
            font-size: 1.2rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #707070;
          }
        }
        .info-block {
          width: 140px;
          height: 80px;
          background: #3e3c3a;
          opacity: 0.5;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          min-width: 140px;
          .text {
            font-size: 1.5rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #ffffff;
            opacity: 0.32;
          }
          &.select {
            background: #000000;
            opacity: 1;
            .text {
              font-size: 1.5rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: #ffffff;
              opacity: 1;
            }
          }
        }
        .info-block-one {
          width: 420px;
          height: 80px;
          background: #000000;
          opacity: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          min-width: 420px;
          .text {
            font-size: 1.5rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #ffffff;
            opacity: 1;
          }
          .info-mail {
            width: 80%;
            height: 100%;
            background: #000000;
            border: none;
            color: #fff;
            font-size: 1.5rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            &::placeholder {
              font-size: 1.5rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: #ffffff;
              opacity: 0.32;
            }
            &:focus {
              outline: none;
              box-shadow: none;
              border-color: transparent;
            }
          }
        }
        .info-block-big-one {
          width: 420px;
          height: 80px;
          background: #2c2b2a;
          opacity: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          min-width: 420px;
          .text {
            font-size: 1.5rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #ffffff;
            opacity: 0.32;
          }
          :deep(.el-select),
          :deep(.select-trigger),
          :deep(.el-input) {
            width: 100%;
            height: 100%;
          }
          :deep(.el-input__wrapper) {
            background: #2c2b2a;
            color: #ffffff;
            width: 100%;
            height: 100%;
            box-shadow: none !important;
            border: none;
            box-sizing: border-box;
            .el-input__inner {
              font-size: 1.5rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: rgba(255, 255, 255, 0.32);
              text-align: center;
            }
          }
          &.select {
            :deep(.el-input__wrapper) {
              background: #000;
              color: #ffffff;
              width: 100%;
              height: 100%;
              box-shadow: none !important;
              border: none;
              box-sizing: border-box;
              .el-input__inner {
                font-size: 1.5rem;
                font-family: Gotham-Rounded;
                font-weight: bold;
                color: #fff;
                text-align: center;
              }
            }
          }
        }
        .info-desc {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;
          margin-left: 10px;
          min-width: 150px;
          .desc {
            font-size: 0.8rem;
            font-family: FUTURA-MEDIUM;
            font-weight: 500;
            color: #ffffff;
            opacity: 0.8;
          }
        }
        .info-block-big {
          width: 210px;
          height: 80px;
          background: #2c2b2a;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          cursor: pointer;
          min-width: 210px;
          .text {
            font-size: 1.5rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #ffffff;
            opacity: 0.32;
          }
          &:hover {
            .text {
              opacity: 1;
            }
          }
          &.select {
            background: #000000;
            opacity: 1;
            .text {
              font-size: 1.5rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: #ffffff;
              opacity: 1;
            }
          }
          :deep(.el-select),
          :deep(.select-trigger),
          :deep(.el-input) {
            width: 100%;
            height: 100%;
          }
          :deep(.el-input__wrapper) {
            background: #2c2b2a;
            color: #ffffff;
            width: 100%;
            height: 100%;
            box-shadow: none !important;
            border: none;
            box-sizing: border-box;
            .el-input__inner {
              font-size: 1.5rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: rgba(255, 255, 255, 0.32);
              text-align: center;
            }
          }
          &.select {
            :deep(.el-input__wrapper) {
              background: #000;
              color: #ffffff;
              width: 100%;
              height: 100%;
              box-shadow: none !important;
              border: none;
              box-sizing: border-box;
              .el-input__inner {
                font-size: 1.5rem;
                font-family: Gotham-Rounded;
                font-weight: bold;
                color: #fff;
                text-align: center;
              }
            }
          }
        }
        .info-line {
          width: 1px;
          height: 80px;
          background: #707070;
          opacity: 0.5;
        }
      }
    }
    .main-details {
      width: 100%;
      padding: 20vh 0 20vh 100px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      .main-title-contain {
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        min-width: 600px;
        max-width: 800px;
        .right {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          .tree {
            height: 36px;
          }
          .active-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            .active {
              font-size: 1rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: #b4b4b4;
              opacity: 1;
            }
          }
          .sell-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            border-top: 1px solid #b4b4b4;
            margin-left: 10px;
            .sell {
              font-size: 1rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: #b4b4b4;
              opacity: 0.6;
            }
          }
        }
        .right2 {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          flex-direction: column;
          .sell {
            font-size: 1rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #b4b4b4;
            opacity: 0.6;
          }
        }
      }
      .main-title {
        font-size: 2rem;
        font-family: Gotham-Rounded;
        font-weight: bold;
        color: #ffffff;
        opacity: 1;
      }
      .main-title-container {
        width: 80%;
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        min-width: 600px;
        max-width: 800px;
        .calendar-container {
          background: #000000;
          opacity: 1;
          border-radius: 13px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: row;
        }
      }
      .main-layout {
        background: #000000;
        opacity: 1;
        border-radius: 6px;
        width: 80%;
        margin-top: 20px;
        padding-bottom: 100px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        max-width: 800px;
        min-width: 600px;
        .layout-header {
          width: 100%;
          padding: 20px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;
          .left {
            font-size: 0.8rem;
            font-family: Gotham-Rounded;
            font-weight: 500;
            color: #ffffff;
            opacity: 1;
          }
          .right {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            .txt {
              font-size: 0.6rem;
              font-family: Gotham-Rounded;
              font-weight: 500;
              color: #484747;
              opacity: 1;
              &.select {
                color: #fff;
              }
            }
          }
        }
      }
      .table-container {
        background: #000000;
        opacity: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        min-width: 600px;
        width: 80%;
        margin-top: 20px;
        max-width: 800px;
        .table-arrow {
          height: 100%;
          padding: 0 15px 0 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
        }
        .table-contain {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .table-header {
            padding: 20px 0 10px;
            font-size: 0.6rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #818181;
            opacity: 1;
            display: flex;
            align-items: center;
            flex-direction: row;
          }
          .table-bg {
            width: 100%;
            background: #3a3a3a;
            opacity: 0.65;
            border-radius: 6px;
            .table-small {
              font-size: 0.6rem;
              font-family: Gotham-Rounded;
              color: #a2a2a2;
              opacity: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: row;
              height: 100%;
            }
            .table-content {
              font-size: 0.8rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: #cecece;
              opacity: 0.9;
              display: flex;
              align-items: center;
              flex-direction: row;
              padding: 16px 0;
              border-bottom: 1px solid #707070;
              height: 100%;
            }
          }
          .table-foot {
            width: 100%;
            padding: 15px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            .txt {
              font-size: 0.6rem;
              font-family: Gotham-Rounded;
              font-weight: bold;
              color: #909090;
              opacity: 1;
            }
          }
        }
      }
      .share-container {
        background: #000000;
        opacity: 1;
        width: 80%;
        min-width: 600px;
        margin-top: 20px;
        min-height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        position: relative;
        margin-bottom: 40px;
        max-width: 800px;
        .content {
          font-size: 0.8rem;
          font-family: Gotham-Rounded;
          font-weight: bold;
          color: #ffffff;
          opacity: 0.8;
          cursor: pointer;
        }
        .desc {
          font-size: 0.6rem;
          font-family: Gotham-Rounded;
          color: #ffffff;
          opacity: 0.6;
          position: absolute;
          bottom: 14px;
          right: 10px;
        }
      }
      .invite-container {
        background: #000000;
        opacity: 1;
        width: 80%;
        min-width: 600px;
        max-width: 800px;
        margin-top: 20px;
        min-height: 300px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        padding: 0 9%;
        .invite-header {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border-bottom: 1px solid #707070;
          padding: 20px 0;
          .desc {
            font-size: 0.8rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #4383ea;
            opacity: 1;
          }
          .title {
            font-size: 1.5rem;
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #4383ea;
            opacity: 1;
          }
        }
        .invite-content {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 100%;
          .invite-list {
            height: 280px;
            width: 100%;
            padding-top: 20px;
            .content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-direction: row;
              margin-bottom: 20px;
              width: 100%;
              .invite-avatar {
                width: 40px;
                height: 40px;
                background: #818da3;
                box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.16);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                font-size: 16px;
                font-family: Gotham-Rounded;
                font-weight: bold;
                color: #ffffff;
                margin-right: 20px;
              }
              .invite-contain {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: row;
                flex: 1;
                background: #252525;
                opacity: 1;
                height: 40px;
                padding: 0 20px;
                .time {
                  flex: 1;
                  font-size: 0.6rem;
                  font-family: Gotham-Rounded;
                  color: #a2a2a2;
                  opacity: 1;
                }
                .right {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: row;
                  .dollar {
                    height: 14px;
                    width: 14px;
                    margin-right: 10px;
                  }
                  .txt {
                    font-size: 0.6rem;
                    font-family: Gotham-Rounded;
                    color: #a2a2a2;
                    opacity: 1;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .phone-aside {
    width: 80vw;
    min-height: 100vh;
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
      width: 100%;
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
      &:nth-of-type(3) {
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
      }
      .active {
        font-size: 12px;
        color: #fff;
      }
      .ai-select {
        ::placeholder {
          color: #fff;
        }

        :deep(.el-input__wrapper) {
          background: #202226;
          color: #ffffff;
          min-height: 33px;
          max-width: 106px;
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
        font-size: 14px;
        font-family: FUTURA-MEDIUM;
        font-weight: 400;
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
  .phone-main {
    padding: 0;
    height: calc(100vh - 320px);
    width: 100vw;
    box-sizing: border-box;
    padding: 20px 25px;
    background: #f5f5f7;
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
:global(td.el-table__cell) {
  border-bottom: 1px solid #707070 !important;
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
:global(.el-popper) {
  background: #000 !important;
  //   border: 1px dashed rgba(255, 255, 255, 0.6) !important;
  margin-top: -14px;
  box-sizing: border-box;
  border-radius: 0 0 3px 3px;
  border: none;
}
:global(.el-select-dropdown__list) {
  width: 100%;
  // border: 1px dashed rgba(255, 255, 255, 0.6) !important;
  border: none !important;
  border-top: none !important;
  margin: 0 !important;
}
:global(.borther .el-select-dropdown__item) {
  height: 60px;
  line-height: 60px;
  font-size: 1.5rem;
}
:global(.borther .el-select-dropdown__item.selected) {
  color: #fff;
}
:global(.borther .el-select-dropdown__item.selected.hover) {
  color: #000;
}
:global(.borther .el-cascader-node) {
  height: 60px;
  line-height: 60px;
  font-size: 1.5rem;
}
:global(.borther .el-cascader-node.is-active > .el-cascader-node__prefix) {
  display: none;
}
:global(.borther .el-cascader-menu__wrap.el-scrollbar__wrap) {
  height: 274px;
}
:global(.borther .el-cascader-node.is-active),
:global(.borther .el-cascader-node.in-active-path) {
  color: #000;
  background: #fff;
}
:global(.borther .el-cascader-node:hover) {
  color: #000;
}
:global(.borther .el-cascader-node:active) {
  color: #000;
}
:global(.borther .el-cascader-node.is-active),
:global(.el-cascader-node.in-active-path:hover) {
  color: #000;
}
:global(.borther .el-cascader-node.is-active),
:global(.borther .el-cascader-node.in-active-path:active) {
  color: #000;
}
:global(.borther .el-scrollbar.el-cascader-menu) {
  width: 120px !important;
  min-width: 120px !important;
}

:global(.el-cascader) {
  height: 100%;
  width: 100%;
}
:global(.borther .el-select-dropdown) {
  background: #000 !important;
  border: none;
}

:global(.city .el-cascader-node) {
  height: 60px;
  line-height: 60px;
  font-size: 1.5rem;
}
:global(.city .el-cascader-node.is-active > .el-cascader-node__prefix) {
  display: none;
}
:global(.city .el-cascader-menu__wrap.el-scrollbar__wrap) {
  height: 274px;
}
:global(.city .el-cascader-node.is-active),
:global(.city .el-cascader-node.in-active-path) {
  color: #000;
  background: #fff;
}
:global(.city .el-cascader-node:hover) {
  color: #000;
}
:global(.city .el-cascader-node:active) {
  color: #000;
}
:global(.city .el-cascader-node.is-active),
:global(.city .el-cascader-node.in-active-path:hover) {
  color: #000;
}
:global(.city .el-cascader-node.is-active),
:global(.city .el-cascader-node.in-active-path:active) {
  color: #000;
}
:global(.city .el-scrollbar.el-cascader-menu) {
  width: 240px !important;
  min-width: 240px !important;
}

:global(.el-picker-panel__body) {
  background: #000 !important;
}
:global(.el-date-table td.disabled .el-date-table-cell) {
  background: #1b1b1b !important;
}
:global(.el-date-table td.today .el-date-table-cell__text) {
  color: #fff !important;
}
:global(.el-date-table-cell:hover) {
  color: #fff;
}
:global(.el-date-table-cell__text:hover) {
  color: #fff;
}

:global(.el-date-editor.el-input, .el-date-editor) {
  height: 48px;
  width: 322px;
  background: #000 !important;
  border-radius: 100px !important;
}
:global(.el-date-editor .el-input__wrapper) {
  background: #000 !important;
  box-shadow: none !important;
  border-radius: 100px !important;
}
:global(.el-date-editor .el-input__wrapper .el-input__inner) {
  font-size: 1rem;
  font-family: FUTURA-MEDIUM;
  font-weight: 500;
  color: #b4b4b4;
  opacity: 1;
}
:global(.el-year-table td.today .cell),
:global(.el-month-table td.today .cell) {
  color: #fff;
  font-weight: 700;
}
:global(.el-year-table td.current:not(.disabled) .cell),
:global(.el-month-table td.current:not(.disabled) .cell) {
  color: #fff;
}
:global(.el-year-table td .cell:hover),
:global(.el-month-table td .cell:hover) {
  color: #fff;
}
:global(.el-year-table td.disabled .cell),
:global(.el-month-table td.disabled .cell) {
  background-color: #3a3a3a;
  cursor: not-allowed;
  color: #a2a2a2;
}
:global(.el-picker-panel__icon-btn) {
  font-size: 12px;
  color: #fff;
  border: 0;
  background: 0 0;
  cursor: pointer;
  outline: 0;
  margin-top: 8px;
}
:global(.el-picker-panel__icon-btn:hover) {
  color: #fff;
}
:global(.el-date-picker__header-label:hover) {
  color: #fff;
}
:global(.city .el-select-dropdown) {
  background: #000 !important;
  border: none;
}
// :global(.el-scrollbar) {
//   background: #1b1b1b !important;
//   border: none;
// }
:global(.el-popper.is-light) {
  background: #000 !important;
  border: none;
}
:global(.el-popper__arrow) {
  display: none;
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

.el-table .el-table__body-wrapper,
.el-table .el-table__footer-wrapper {
  border: none;
}
.el-table__footer-wrapper {
  border: none !important;
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
        }
        .desc2 {
          font-size: 0.6rem;
          font-family: FUTURA-MEDIUM;
          font-weight: 500;
          color: #ffffff;
          opacity: 0.6;
        }

        &:hover .desc {
          color: #fff;
        }
        &:active .desc {
          color: #89919e;
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
</style>
