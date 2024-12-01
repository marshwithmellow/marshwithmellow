<template>
  <div class="px-common-layout px-no-trans">
    <div v-if="!agent">
      <el-container>
        <el-header
          class="header"
          :style="{
            'box-shadow': showDrawer
              ? 'none'
              : '0px 6px 9px rgba(0, 0, 0, 0.16)',
          }"
        >
          <div class="header-left">
            <img
              class="logo"
              src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/blue-logo.png"
              @click="goHome"
              alt=""
            />
          </div>
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
            <img class="center-logo" :src="logoImg" alt="" />
          </div>
          <div class="header-right">
            <div class="info" @click="showDrawer = true" v-if="userInfo.name">
              <div class="txt">
                {{
                  userInfo.rmbBalance == 0
                    ? "充值我的钱包"
                    : "AI 钱包：" + userInfo.rmbBalance + " 元"
                }}
              </div>
            </div>
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
                  {{ nickName }}
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
          </div>
        </el-header>
        <el-main class="main">
          <div
            class="address-container"
            v-if="addressList.length > 0 && processStatus == 0"
          >
            <div v-for="(item, index) in addressList" :key="item.id">
              <div
                class="part"
                :class="
                  currentAddress == index &&
                  (!dialogEditVisible || addressStatus != 1)
                    ? 'check'
                    : ''
                "
                @click="chooseAddress(index)"
              >
                <el-icon v-if="item.lab == '办公地址'">
                  <OfficeBuilding />
                </el-icon>
                <el-icon v-else><HomeFilled /></el-icon>
                <div class="title">{{ item.lab }}</div>
              </div>
              <el-divider v-if="addressList.length < 5" style="margin: 0" />
            </div>
            <div v-if="addressList.length < 5">
              <div
                class="part"
                @click="add(addressList.length)"
                :class="dialogEditVisible && addressStatus == 1 ? 'check' : ''"
              >
                <el-icon><Plus /></el-icon>
                <div class="title">新建地址</div>
              </div>
            </div>
          </div>
          <div class="edit-address" v-if="dialogEditVisible">
            <div class="back" @click="addressBack">返回</div>
            <div class="del" @click="del" v-if="editAddressId.length > 0">
              删除
            </div>
            <div class="edit-label-container">
              <!-- <div class="label">{{ addressEditForm.lab }}</div> -->
              <el-input
                v-model="detailLab"
                placeholder=""
                class="label"
                @blur="blurLab"
              />
              <el-divider style="margin: 0 0 20px 0" />
            </div>
            <div
              class="edit-input-container"
              :class="addressRules[0] ? 'rule' : ''"
            >
              <el-input
                @focus="addressRules[0] = false"
                v-model="addressEditForm.userName"
                placeholder="*联系人："
              />
            </div>
            <div
              class="edit-input-container"
              :class="addressRules[1] ? 'rule' : ''"
            >
              <el-input
                @focus="addressRules[1] = false"
                v-model="addressEditForm.mobile"
                placeholder="*联系电话："
                :maxlength="11"
                @blur="blurTel"
              />
            </div>
            <div
              class="edit-input-container"
              :class="addressRules[2] ? 'rule' : ''"
            >
              <el-cascader
                @focus="addressRules[2] = false"
                v-model="addressEditForm.cityName"
                :options="pcaData"
                :props="{ value: 'name', label: 'name' }"
                placeholder="*省/市/区"
              />
            </div>
            <div
              class="edit-input-container"
              :class="addressRules[3] ? 'rule' : ''"
            >
              <el-autocomplete
                @focus="addressRules[3] = false"
                v-model="detailInfo"
                :fetch-suggestions="queryPoi"
                clearable
                :trigger-on-focus="false"
                popper-class="my-autocomplete"
                placeholder="*详细地址"
                @select="handlePoi"
                fit-input-width
                @blur="blurPoi"
              >
                <template #default="{ item }">
                  <div class="complete-container">
                    <div class="value">{{ item.name }}</div>
                    <span class="link">
                      {{ item.adname + " " + item.address }}
                    </span>
                  </div>
                </template>
              </el-autocomplete>
            </div>
            <div class="edit-input-container">
              <el-input
                v-model="addressEditForm.userDetailInfo"
                placeholder="门牌号"
              />
            </div>
            <div
              class="confirm"
              :style="{ opacity: addDisabled ? '1' : '0.5' }"
              @click="saveAddress"
            >
              好了!
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
            v-else
          >
            <div class="tag-container" v-show="false">
              <div class="tag-part" @click="currentTag = 0">
                <div :class="currentTag === 0 ? 'check' : 'normal'">
                  <div class="tag">新品优先</div>
                </div>
              </div>
              <div class="tag-part" @click="currentTag = 1">
                <div :class="currentTag === 1 ? 'check' : 'normal'">
                  <div class="tag">低价大师</div>
                </div>
              </div>
              <div class="tag-part" @click="currentTag = 2">
                <div :class="currentTag === 2 ? 'check' : 'normal'">
                  <div class="tag">自助点餐</div>
                </div>
              </div>
            </div>
            <div class="big">
              {{
                processStatus == 1
                  ? "正在点餐"
                  : processStatus == 2
                  ? "正在取餐"
                  : processStatus == 3
                  ? "正在送餐"
                  : "麦当劳外卖"
              }}
              <div
                v-if="processStatus == 3"
                style="cursor: pointer"
                @click="openReport"
              >
                (查看点餐报告)
              </div>
            </div>
            <div class="big-desc">(营业时间：10:30-21:00)</div>
            <div
              class="address"
              v-if="
                addressList.length > 0 &&
                processStatus != 5 &&
                processStatus != 4
              "
            >
              <img class="hamburger" :src="hamburgerImg" alt="" />
              <div style="margin: 0 30px">
                送至：{{
                  addressList[currentAddress].provinceName +
                  " " +
                  addressList[currentAddress].cityName +
                  " " +
                  addressList[currentAddress].countyName +
                  " " +
                  addressList[currentAddress].detailInfo +
                  (addressList[currentAddress].userDetailInfo
                    ? " " + addressList[currentAddress].userDetailInfo
                    : "")
                }}
              </div>
            </div>
            <div
              class="address"
              v-else-if="processStatus != 5 && processStatus != 4"
            >
              <!-- <div
                style="text-decoration: underline; cursor: pointer"
                @click="dialogEditVisible = true"
              >
                填写送餐地址
              </div> -->
              <img class="hamburger" :src="hamburgerImg" alt="" />
              <div style="margin-left: 20px">新建：</div>
              <div class="part" @click="add(0)">
                <el-icon><HomeFilled /></el-icon>
                <div class="title">住宅地址</div>
              </div>
              <div class="part" @click="add(1)">
                <el-icon><OfficeBuilding /></el-icon>
                <div class="title">办公地址</div>
              </div>
            </div>
            <div
              class="contact"
              v-if="
                addressList.length > 0 &&
                processStatus != 5 &&
                processStatus != 4
              "
            >
              <div class="label">联系人：</div>
              {{ addressList[currentAddress].userName }}
              <img class="phone" :src="phoneImg" alt="" />
              <div style="margin-left: 10px">
                电话：{{ addressList[currentAddress].mobile }}
              </div>
              <div
                v-if="processStatus == 0"
                :style="{
                  'margin-left': '30px',
                  cursor: submitLoading ? 'not-allowed' : 'pointer',
                  'text-decoration': 'underline',
                }"
                @click="edit()"
              >
                编辑地址
              </div>
            </div>
            <el-row
              class="count-container"
              v-if="processStatus == 0 && !submitLoading"
            >
              <el-col :span="6" v-for="item in counts">
                <div
                  :class="item.num == currentCount ? 'count' : 'count-normal'"
                >
                  <div
                    class="txt"
                    @click="changeCount(item)"
                    style="cursor: pointer"
                  >
                    <view class="num">{{ item.num }}</view>
                    人份
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="count" v-else-if="submitLoading">
              <div class="txt">
                <view class="num">{{ currentCount }}</view>
                人份
              </div>
            </div>
            <div
              class="count"
              v-else-if="processStatus != 5 && processStatus != 4"
            >
              <div class="txt">
                <view class="num">{{ currentCount }}</view>
                人份
              </div>
            </div>
            <div class="area" v-if="processStatus == 0">
              <div class="want-container" v-if="currentTag == 2">
                <div class="label">我想要:</div>
                <div class="tags-container">
                  <el-tag
                    v-for="tag in checkChoose"
                    :key="tag.id"
                    class="tags"
                    closable
                    color="#000000"
                    effect="dark"
                    @close="removeChoose(tag.id)"
                  >
                    {{ tag.txt }}
                  </el-tag>
                </div>
              </div>
              <el-input
                v-model="inputValue"
                :rows="5"
                type="textarea"
                placeholder="首次运行，AI 将自动为您点餐。如果您有用餐偏好，请在这里输入。"
                :disabled="submitLoading"
                resize="none"
                class="area-container"
              />
              <div class="check-container" v-if="currentTag == 2">
                <el-check-tag
                  :style="{
                    'margin-left': '20px',
                    border: item.check
                      ? '1px #000000 solid'
                      : '1px #a0a0a0 solid',
                    background: item.check ? '#000000' : '#ebebeb',
                    'border-radius': '17px',
                    color: item.check ? '#ffffff' : '#555555',
                  }"
                  :checked="item.check"
                  v-for="(item, index) in checkList"
                  :key="item.id"
                  @change="onCheck($event, index)"
                >
                  {{ item.txt }}
                </el-check-tag>
              </div>
            </div>
            <el-button
              class="button"
              color="#000000"
              @click="clickRun"
              :loading="submitLoading"
              v-if="processStatus == 0"
              :disabled="submitDisabled"
            >
              <template #loading>
                <div class="custom-loading">
                  <svg class="circular" viewBox="-10, -10, 50, 50">
                    <path
                      class="path"
                      d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          "
                      style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
                    />
                  </svg>
                </div>
              </template>
              {{
                submitLoading
                  ? "正在下单..."
                  : submitDisabled
                  ? "稍后回来"
                  : "下单"
              }}
            </el-button>
            <el-row
              :gutter="2"
              class="process-container"
              v-if="
                processStatus == 1 || processStatus == 2 || processStatus == 3
              "
            >
              <el-col :span="6">
                <div class="pro">
                  <div class="txt">
                    {{ processStatus == 1 ? "正在点餐" : "已点餐" }}
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div
                  class="pro"
                  :style="{ opacity: processStatus == 1 ? 0.75 : 1 }"
                >
                  <div class="txt">
                    {{
                      processStatus == 1 || processStatus == 2
                        ? "正在取餐"
                        : "已取餐"
                    }}
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div
                  class="pro"
                  :style="{
                    opacity:
                      processStatus == 1 ? 0.5 : processStatus == 2 ? 0.75 : 1,
                  }"
                >
                  <div class="txt">
                    {{
                      processStatus == 1 ||
                      processStatus == 2 ||
                      processStatus == 3
                        ? "正在送餐"
                        : "已送餐"
                    }}
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div
                  class="pro"
                  :style="{
                    opacity:
                      processStatus == 1 || processStatus == 2
                        ? 0.5
                        : processStatus == 3
                        ? 0.75
                        : 1,
                    cursor: processStatus == 3 ? 'pointer' : 'auto',
                  }"
                  @click="openReport"
                >
                  <div class="txt">
                    {{ processStatus == 3 ? "点餐报告" : "等待接收" }}
                  </div>
                </div>
              </el-col>
            </el-row>
            <div
              class="count-down"
              v-if="
                processStatus != 0 && processStatus != 5 && processStatus != 4
              "
            >
              <div
                class="column"
                :style="{
                  transform: `translateY(${-lineHeight * timeObject.index4}px)`,
                }"
              >
                <div
                  class="num"
                  v-for="(item, index) in timeObject.arr4"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </div>
              </div>
              <div
                class="column"
                :style="{
                  transform: `translateY(${-lineHeight * timeObject.index3}px)`,
                }"
              >
                <div
                  class="num"
                  v-for="(item, index) in timeObject.arr3"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </div>
              </div>
              <div
                style="
                  width: 10px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                "
              >
                <div style="height: 30px">:</div>
              </div>
              <div
                class="column"
                :style="{
                  transform: `translateY(${-lineHeight * timeObject.index2}px)`,
                }"
              >
                <div
                  class="num"
                  v-for="(item, index) in timeObject.arr2"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </div>
              </div>
              <div
                class="column"
                :style="{
                  transform: `translateY(${-lineHeight * timeObject.index1}px)`,
                }"
              >
                <div
                  class="num"
                  v-for="(item, index) in timeObject.arr1"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </div>
              </div>
            </div>
            <div style="color: #000; font-size: 1rem" v-if="processStatus == 5">
              Hi，{{
                addressList.length > 0
                  ? addressList[currentAddress].userName
                  : ""
              }}，很高兴为您完成本次订单。
            </div>
            <div style="color: #000; font-size: 1rem" v-if="processStatus == 4">
              很抱歉！{{
                addressList.length > 0
                  ? addressList[currentAddress].userName
                  : ""
              }}，本次为您点餐失败。
            </div>
            <div
              class="report-container"
              v-if="processStatus == 5 || processStatus == 4"
            >
              <img class="hamburger" :src="reportHamburgerImg" />
              <div class="solid"></div>
              <div class="report-part">
                <div class="desc">本次点餐</div>
                <div class="content">
                  <div class="large">
                    {{ reportOrder.combinationPrice + reportOrder.paidCharge }}
                  </div>
                  元
                </div>
                <div class="desc">包含餐食+配送费</div>
              </div>
              <div class="report-part">
                <div class="desc">为您节约</div>
                <div class="content">
                  <div class="large">
                    {{
                      (
                        reportOrder.originalPrice +
                        reportOrder.originalCharge -
                        (reportOrder.combinationPrice + reportOrder.paidCharge)
                      ).toFixed(2)
                    }}
                  </div>
                  元
                </div>
                <div class="desc">相比原餐食和配送价</div>
              </div>
              <div class="report-part">
                <div class="desc">相当于</div>
                <div class="content">
                  <div class="large">
                    {{ reportOrder.originalPrice + reportOrder.originalCharge }}
                  </div>
                  元
                </div>
                <div class="desc">购买了相同的商品</div>
              </div>
              <div class="report-part" v-if="reportOrder.useTime">
                <div class="desc">并且节约您</div>
                <div class="content">
                  <div class="large">{{ reportOrder.useTime }}</div>
                  分钟
                </div>
                <div class="desc">点单时间</div>
              </div>
            </div>
            <div class="evaluate" v-if="processStatus == 5">
              <el-input
                v-model="evaluateValue"
                :rows="5"
                type="textarea"
                placeholder="欢迎您留下评价。"
              />
              <div class="evaluate-group">
                <el-button
                  :class="evaluateButton == 1 ? 'selected' : 'normal'"
                  @click="clickEvaluate(1)"
                >
                  喜欢
                </el-button>
                <el-button
                  :class="evaluateButton == 2 ? 'selected' : 'normal'"
                  @click="clickEvaluate(2)"
                >
                  不喜欢
                </el-button>
              </div>
            </div>
            <div
              class="button-group"
              v-if="processStatus == 5 || processStatus == 4"
            >
              <el-button color="#000" style="border-radius: 12px; width: 100px">
                <div class="button-count-down">
                  <div
                    class="column"
                    :style="{
                      transform: `translateY(${-30 * timeObject.index4}px)`,
                    }"
                  >
                    <div
                      class="num"
                      v-for="(item, index) in timeObject.arr4"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                  <div
                    class="column"
                    :style="{
                      transform: `translateY(${-30 * timeObject.index3}px)`,
                    }"
                  >
                    <div
                      class="num"
                      v-for="(item, index) in timeObject.arr3"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                  <div
                    style="
                      width: 10px;
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <div style="height: 20px">:</div>
                  </div>
                  <div
                    class="column"
                    :style="{
                      transform: `translateY(${-30 * timeObject.index2}px)`,
                    }"
                  >
                    <div
                      class="num"
                      v-for="(item, index) in timeObject.arr2"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                  <div
                    class="column"
                    :style="{
                      transform: `translateY(${-30 * timeObject.index1}px)`,
                    }"
                  >
                    <div
                      class="num"
                      v-for="(item, index) in timeObject.arr1"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                </div>
              </el-button>
              <el-button
                color="#000"
                style="border-radius: 12px; width: 100px"
                @click="processStatus = 0"
              >
                再来一份
              </el-button>
            </div>
            <div class="order-no" v-if="processStatus != 0">
              订单号：{{ reportOrder.orderId }}
            </div>
          </div>
        </el-main>
        <el-footer class="foot-container">
          <a style="color: #ffffff" href="tel:18511623202">
            客服电话：18511623202
            张先生,微信同手机,有任何问题或优化建议可联系我们。
          </a>
        </el-footer>
      </el-container>
      <el-dialog
        v-model="showDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="wrap-dialog"
        :show-close="false"
        title=""
      >
        <mcd-modal
          ref="login"
          :inviteCode="inviteCode"
          @show-message="showMessage"
          @complete="loginComplete"
        ></mcd-modal>
      </el-dialog>
      <el-drawer
        v-model="showDrawer"
        :with-header="false"
        direction="ttb"
        :size="468"
      >
        <el-container>
          <el-header style="height: 100px; padding: 0"></el-header>
          <el-container>
            <el-aside class="aside">
              <div class="aside-left">
                <div class="label-container">
                  <div
                    class="label"
                    :class="currentAside == 0 ? 'check' : ''"
                    @click="currentAside = 0"
                  >
                    预充值
                  </div>
                  <div class="price-container" v-if="currentPrice.length > 0">
                    ￥
                    <div class="price">{{ currentPrice }}</div>
                  </div>
                </div>
                <el-divider style="margin: 15px 0" />
                <div
                  class="label"
                  :class="currentAside == 1 ? 'check' : ''"
                  @click="currentAside = 1"
                >
                  历史订单
                </div>
              </div>
            </el-aside>
            <el-main class="main-content">
              <swiper
                :initialSlide="0"
                :loopedSlides="2"
                slidesPerView="auto"
                :spaceBetween="0"
                :scrollbar="false"
                style="margin-top: 50px"
                :loop="false"
                class="album-swiper"
                v-show="currentAside == 0"
              >
                <swiper-slide v-for="(item, index) in albumList" :key="item.id">
                  <div class="album-container">
                    <div
                      class="part-container"
                      :class="currentAlbum === item.id ? 'check' : ''"
                    >
                      <div
                        class="part"
                        :style="{
                          background:
                            qrCodeImgUrl && currentAlbum === item.id
                              ? '#ffffff'
                              : `url(${item.img}) 100% no-repeat`,
                        }"
                        @click="clickAlbum(item)"
                      >
                        <img
                          v-if="qrCodeImgUrl && currentAlbum === item.id"
                          style="height: 136px; width: 136px"
                          :src="qrCodeImgUrl"
                          alt=""
                        />
                        <div :class="index < 2 ? 'txt' : 'txt2'" v-else>
                          ￥
                          <div class="big">{{ item.money }}</div>
                        </div>
                      </div>
                    </div>
                    <el-button
                      size="large"
                      color="#FFD800"
                      class="pay-disable"
                      v-if="qrCodeImgUrl && currentAlbum === item.id"
                      disabled
                    >
                      <img
                        :src="wechatText"
                        style="height: 25px; width: 112px"
                      />
                    </el-button>
                    <el-button
                      size="large"
                      color="#FFD800"
                      class="pay"
                      v-else-if="currentAlbum === item.id"
                      @click="payAmount(item)"
                    >
                      确认支付
                    </el-button>
                  </div>
                </swiper-slide>
              </swiper>
              <swiper
                :initialSlide="0"
                :loopedSlides="2"
                slidesPerView="auto"
                :spaceBetween="0"
                :scrollbar="false"
                :loop="false"
                class="history-swiper"
                v-show="currentAside == 1"
                v-if="historyList.length > 0"
              >
                <swiper-slide v-for="item in historyList" :key="item.orderId">
                  <div class="history-container">
                    <div
                      class="history-row"
                      style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                      "
                    >
                      <div
                        class="history-left"
                        style="
                          display: flex;
                          flex-direction: row;
                          align-items: center;
                          justify-content: flex-start;
                        "
                      >
                        <img :src="logoImg" class="history-logo" />
                      </div>
                      <div class="history-right">
                        <div class="big">AI麦当劳外卖</div>
                        <div class="desc">{{ item.diningPeople }}人份</div>
                      </div>
                    </div>
                    <div class="history-row">
                      <div class="history-left">下单时间</div>
                      <div class="history-right">{{ item.createTime }}</div>
                    </div>
                    <div class="history-row">
                      <div class="history-left">收货地址</div>
                      <div class="history-right">
                        <div>{{ item.userName + " " + item.mobile }}</div>
                        <div>
                          {{
                            item.provinceName +
                            " " +
                            item.cityName +
                            " " +
                            item.countyName +
                            " " +
                            item.detailInfo
                          }}
                        </div>
                      </div>
                    </div>
                    <div class="history-row">
                      <div class="history-left">点餐内容</div>
                      <div class="history-right">
                        <div>{{ item.combinationArray }}</div>
                        <div v-if="item.combinationPrice">
                          {{ item.combinationPrice }}
                          元（包含餐品+配送费+服务费）
                        </div>
                        <div v-if="item.originalPrice && item.combinationPrice">
                          为您节约{{
                            item.originalPrice - item.combinationPrice
                          }}元
                        </div>
                      </div>
                    </div>
                    <div class="history-row">
                      <div class="history-left">订单编号</div>
                      <div class="history-right">{{ item.orderId }}</div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
              <div v-else v-show="currentAside == 1">
                <el-empty description="这里空空如也！" />
              </div>
            </el-main>
          </el-container>
        </el-container>
      </el-drawer>
    </div>
    <div v-else>
      <el-container>
        <el-header class="phone-header">
          <img
            class="logo"
            src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/blue-logo.png"
            @click="goHome"
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
            <img class="center-logo" :src="logoImg" alt="" />
          </div>
          <div class="header-right">
            <div class="info" @click="showDrawer = true" v-if="userInfo.name">
              <div class="txt">
                {{
                  userInfo.rmbBalance == 0
                    ? "充值我的钱包"
                    : "AI 钱包：" + userInfo.rmbBalance + " 元"
                }}
              </div>
            </div>
            <!-- <el-popover
              placement="bottom"
              :width="344"
              trigger="click"
              v-if="userInfo.name"
              popper-class="user"
              v-model:visible="showUserInfo"
            >
              <template #reference>
                <div v-if="userInfo.name" class="avatar">
                  {{ nickName }}
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
            </el-popover> -->
          </div>
        </el-header>
        <el-main class="phone-main">
          <div class="edit-address" v-if="dialogEditVisible">
            <div class="back" @click="addressBack">返回</div>
            <div class="del" @click="del" v-if="editAddressId.length > 0">
              删除
            </div>
            <div class="edit-label-container">
              <!-- <div class="label">{{ addressEditForm.lab }}</div> -->
              <el-input
                v-model="detailLab"
                placeholder=""
                class="label"
                @blur="blurLab"
              />
              <el-divider style="margin: 0 0 20px 0" />
            </div>
            <div
              class="edit-input-container"
              :class="addressRules[0] ? 'rule' : ''"
            >
              <el-input
                @focus="addressRules[0] = false"
                v-model="addressEditForm.userName"
                placeholder="*联系人："
              />
            </div>
            <div
              class="edit-input-container"
              :class="addressRules[1] ? 'rule' : ''"
            >
              <el-input
                @focus="addressRules[1] = false"
                v-model="addressEditForm.mobile"
                placeholder="*联系电话："
                :maxlength="11"
                @blur="blurTel"
              />
            </div>
            <div
              class="edit-input-container"
              :class="addressRules[2] ? 'rule' : ''"
              @click="openCascader"
            >
              <!-- <el-cascader
                @focus="addressRules[2] = false"
                v-model="addressEditForm.cityName"
                :options="pcaData"
                :props="{ value: 'name', label: 'name' }"
                placeholder="*省/市/区"
              /> -->
              <!-- <el-input
                @focus="addressRules[2] = false"
                v-model="cascaderValue"
                placeholder="*省/市/区"
                disabled
                @click="cascaderShow = true"
              /> -->
              <div
                class="input-content"
                :style="{
                  color:
                    addressEditForm.cityName.length > 0 ? '#606266' : '#c0c4cc',
                }"
              >
                {{
                  addressEditForm.cityName.length > 0
                    ? addressEditForm.cityName[0] +
                      "/" +
                      addressEditForm.cityName[1] +
                      "/" +
                      addressEditForm.cityName[2]
                    : "*省/市/区"
                }}
              </div>
              <span class="el-input__suffix">
                <span class="el-input__suffix-inner">
                  <i class="el-icon el-input__icon icon-arrow-down">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1024 1024"
                    >
                      <path
                        fill="currentColor"
                        d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
                      ></path>
                    </svg>
                  </i>
                </span>
              </span>
            </div>
            <div
              class="edit-input-container"
              :class="addressRules[3] ? 'rule' : ''"
            >
              <el-autocomplete
                @focus="addressRules[3] = false"
                v-model="detailInfo"
                :fetch-suggestions="queryPoi"
                clearable
                :trigger-on-focus="false"
                popper-class="my-autocomplete"
                placeholder="*详细地址"
                @select="handlePoi"
                fit-input-width
                @blur="blurPoi"
              >
                <template #default="{ item }">
                  <div class="complete-container">
                    <div class="value">{{ item.name }}</div>
                    <span class="link">
                      {{ item.adname + " " + item.address }}
                    </span>
                  </div>
                </template>
              </el-autocomplete>
            </div>
            <div class="edit-input-container">
              <el-input
                v-model="addressEditForm.userDetailInfo"
                placeholder="门牌号"
              />
            </div>
            <div
              class="confirm"
              :style="{ opacity: addDisabled ? '1' : '0.5' }"
              @click="saveAddress"
            >
              好了!
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
            v-else
          >
            <div class="big">
              {{
                processStatus == 1
                  ? "正在点餐"
                  : processStatus == 2
                  ? "正在取餐"
                  : processStatus == 3
                  ? "正在送餐"
                  : "麦当劳外卖"
              }}
              <div
                v-if="processStatus == 3"
                style="cursor: pointer"
                @click="openReport"
              >
                (查看点餐报告)
              </div>
            </div>
            <div class="big-desc">(营业时间：10:30-21:00)</div>
            <div class="tag-container" v-show="false">
              <div class="tag-part" @click="currentTag = 0">
                <div :class="currentTag === 0 ? 'check' : 'normal'">
                  <div class="tag">新品优先</div>
                </div>
              </div>
              <div class="tag-part" @click="currentTag = 1">
                <div :class="currentTag === 1 ? 'check' : 'normal'">
                  <div class="tag">低价大师</div>
                </div>
              </div>
              <div class="tag-part" @click="currentTag = 2">
                <div :class="currentTag === 2 ? 'check' : 'normal'">
                  <div class="tag">自助点餐</div>
                </div>
              </div>
            </div>
            <el-popover
              placement="bottom"
              :width="320"
              trigger="click"
              v-if="
                addressList.length > 0 &&
                processStatus != 5 &&
                processStatus != 4
              "
              v-model:visible="addressPopoverVisible"
              :disabled="processStatus != 0"
            >
              <template #reference>
                <div class="address">
                  <el-icon :size="18"><Location /></el-icon>
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      align-items: flex-start;
                      justify-content: flex-start;
                      margin: 0 12px;
                      width: 100%;
                    "
                  >
                    <div class="hamburger-container">
                      {{
                        addressList[currentAddress].provinceName +
                        " " +
                        addressList[currentAddress].cityName +
                        " " +
                        addressList[currentAddress].countyName
                      }}
                      {{
                        addressList[currentAddress].detailInfo +
                        (addressList[currentAddress].userDetailInfo
                          ? " " + addressList[currentAddress].userDetailInfo
                          : "")
                      }}
                    </div>
                    <div class="phone-container">
                      <div>{{ addressList[currentAddress].userName }}</div>
                      <div style="margin-left: 10px">
                        {{ addressList[currentAddress].mobile }}
                      </div>
                    </div>
                  </div>
                  <el-icon :size="18"><ArrowDown /></el-icon>
                </div>
              </template>
              <el-scrollbar :max-height="200">
                <div
                  class="address-list-container"
                  v-for="(item, index) in addressList"
                  :key="item.id"
                  @click="chooseAddress(index)"
                >
                  <el-icon
                    :size="18"
                    :style="{
                      color: index == currentAddress ? '#ffbc0d' : '#aaa',
                    }"
                  >
                    <CircleCheckFilled v-if="index == currentAddress" />
                    <CircleCheck v-else />
                  </el-icon>
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      align-items: flex-start;
                      justify-content: flex-start;
                      margin: 0 12px;
                      width: 100%;
                    "
                  >
                    <div class="hamburger-container">
                      {{
                        item.provinceName +
                        " " +
                        item.cityName +
                        " " +
                        item.countyName
                      }}
                      {{
                        item.detailInfo +
                        (item.userDetailInfo ? " " + item.userDetailInfo : "")
                      }}
                    </div>
                    <div class="phone-container">
                      <div>{{ item.userName }}</div>
                      <div style="margin-left: 10px">
                        {{ item.mobile }}
                      </div>
                    </div>
                  </div>
                  <el-icon @click.stop="editPhoneAddress(index)" :size="18">
                    <Edit />
                  </el-icon>
                </div>
              </el-scrollbar>
              <div
                style="width: 100%; padding: 12px 0 0"
                v-if="addressList.length < 5"
              >
                <el-button
                  color="#ffbc0d"
                  style="width: 100%; color: #000"
                  round
                  size="large"
                  @click="add(addressList.length)"
                >
                  添加地址
                </el-button>
              </div>
            </el-popover>
            <div
              class="address"
              v-else-if="processStatus != 5 && processStatus != 4"
            >
              <div
                style="text-decoration: underline; cursor: pointer"
                @click="add(0)"
              >
                填写送餐地址
              </div>
            </div>
            <el-row
              class="count-container"
              v-if="processStatus == 0 && !submitLoading"
            >
              <el-col :span="6" v-for="item in counts">
                <div
                  :class="item.num == currentCount ? 'count' : 'count-normal'"
                >
                  <div
                    class="txt"
                    @click="changeCount(item)"
                    style="cursor: pointer"
                  >
                    <view class="num">{{ item.num }}</view>
                    人份
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="count" v-else-if="submitLoading">
              <div class="txt">
                <view class="num">{{ currentCount }}</view>
                人份
              </div>
            </div>
            <div
              class="count"
              v-else-if="processStatus != 5 && processStatus != 4"
            >
              <div class="txt">
                <view class="num">{{ currentCount }}</view>
                人份
              </div>
            </div>
            <div class="area" v-if="processStatus == 0">
              <div class="want-container" v-if="currentTag == 2">
                <div class="label">我想要:</div>
                <div class="tags-container">
                  <el-tag
                    v-for="tag in checkChoose"
                    :key="tag.id"
                    class="tags"
                    closable
                    color="#000000"
                    effect="dark"
                    @close="removeChoose(tag.id)"
                  >
                    {{ tag.txt }}
                  </el-tag>
                </div>
              </div>
              <el-input
                v-model="inputValue"
                :rows="5"
                type="textarea"
                placeholder="首次运行，AI 将自动为您点餐。如果您有用餐偏好，请在这里输入。"
                :disabled="submitLoading"
                resize="none"
                class="area-container"
              />
              <!-- <div class="check-container" v-if="currentTag == 2">
                <el-check-tag
                  :style="{
                    'margin-left': '20px',
                    border: item.check
                      ? '1px #000000 solid'
                      : '1px #a0a0a0 solid',
                    background: item.check ? '#000000' : '#ebebeb',
                    'border-radius': '17px',
                    color: item.check ? '#ffffff' : '#555555',
                  }"
                  :checked="item.check"
                  v-for="(item, index) in checkList"
                  :key="item.id"
                  @change="onCheck($event, index)"
                >
                  {{ item.txt }}
                </el-check-tag>
              </div> -->
            </div>
            <el-button
              class="button"
              color="#000000"
              @click="clickRun"
              :loading="submitLoading"
              v-if="processStatus == 0"
              :disabled="submitDisabled"
            >
              <template #loading>
                <div class="custom-loading">
                  <svg class="circular" viewBox="-10, -10, 50, 50">
                    <path
                      class="path"
                      d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          "
                      style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
                    />
                  </svg>
                </div>
              </template>
              {{
                submitLoading
                  ? "正在下单..."
                  : submitDisabled
                  ? "稍后回来"
                  : "下单"
              }}
            </el-button>
            <el-row
              :gutter="2"
              class="process-container"
              v-if="
                processStatus == 1 || processStatus == 2 || processStatus == 3
              "
            >
              <el-col :span="6">
                <div class="pro">
                  <div class="txt">
                    {{ processStatus == 1 ? "正在点餐" : "已点餐" }}
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div
                  class="pro"
                  :style="{ opacity: processStatus == 1 ? 0.75 : 1 }"
                >
                  <div class="txt">
                    {{
                      processStatus == 1 || processStatus == 2
                        ? "正在取餐"
                        : "已取餐"
                    }}
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div
                  class="pro"
                  :style="{
                    opacity:
                      processStatus == 1 ? 0.5 : processStatus == 2 ? 0.75 : 1,
                  }"
                >
                  <div class="txt">
                    {{
                      processStatus == 1 ||
                      processStatus == 2 ||
                      processStatus == 3
                        ? "正在送餐"
                        : "已送餐"
                    }}
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div
                  class="pro"
                  :style="{
                    opacity:
                      processStatus == 1 || processStatus == 2
                        ? 0.5
                        : processStatus == 3
                        ? 0.75
                        : 1,
                    cursor: processStatus == 3 ? 'pointer' : 'auto',
                  }"
                  @click="openReport"
                >
                  <div class="txt">
                    {{ processStatus == 3 ? "点餐报告" : "等待接收" }}
                  </div>
                </div>
              </el-col>
            </el-row>
            <div
              class="count-down"
              v-if="
                processStatus != 0 && processStatus != 5 && processStatus != 4
              "
            >
              <div
                class="column"
                :style="{
                  transform: `translateY(${-lineHeight * timeObject.index4}px)`,
                }"
              >
                <div
                  class="num"
                  v-for="(item, index) in timeObject.arr4"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </div>
              </div>
              <div
                class="column"
                :style="{
                  transform: `translateY(${-lineHeight * timeObject.index3}px)`,
                }"
              >
                <div
                  class="num"
                  v-for="(item, index) in timeObject.arr3"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </div>
              </div>
              <div
                style="
                  width: 10px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                "
              >
                <div style="height: 30px">:</div>
              </div>
              <div
                class="column"
                :style="{
                  transform: `translateY(${-lineHeight * timeObject.index2}px)`,
                }"
              >
                <div
                  class="num"
                  v-for="(item, index) in timeObject.arr2"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </div>
              </div>
              <div
                class="column"
                :style="{
                  transform: `translateY(${-lineHeight * timeObject.index1}px)`,
                }"
              >
                <div
                  class="num"
                  v-for="(item, index) in timeObject.arr1"
                  :key="index"
                >
                  <div>{{ item }}</div>
                </div>
              </div>
            </div>
            <div style="color: #000; font-size: 16px" v-if="processStatus == 5">
              Hi，{{
                addressList.length > 0
                  ? addressList[currentAddress].userName
                  : ""
              }}，很高兴为您完成本次订单。
            </div>
            <div style="color: #000; font-size: 16px" v-if="processStatus == 4">
              很抱歉！{{
                addressList.length > 0
                  ? addressList[currentAddress].userName
                  : ""
              }}，本次为您点餐失败。
            </div>
            <div
              class="report-container"
              v-if="processStatus == 5 || processStatus == 4"
            >
              <!-- <img class="hamburger" :src="reportHamburgerImg" />
              <div class="solid"></div> -->
              <div class="report-part">
                <div class="desc">本次点餐</div>
                <div class="content">
                  <div class="large">
                    {{ reportOrder.combinationPrice + reportOrder.paidCharge }}
                  </div>
                  元
                </div>
                <div class="desc">包含餐食+配送费</div>
              </div>
              <div class="report-part">
                <div class="desc">为您节约</div>
                <div class="content">
                  <div class="large">
                    {{
                      (
                        reportOrder.originalPrice +
                        reportOrder.originalCharge -
                        (reportOrder.combinationPrice + reportOrder.paidCharge)
                      ).toFixed(2)
                    }}
                  </div>
                  元
                </div>
                <div class="desc">相比原餐食和配送价</div>
              </div>
              <div class="report-part">
                <div class="desc">相当于</div>
                <div class="content">
                  <div class="large">
                    {{ reportOrder.originalPrice + reportOrder.originalCharge }}
                  </div>
                  元
                </div>
                <div class="desc">购买了相同的商品</div>
              </div>
              <div class="report-part" v-if="reportOrder.useTime">
                <div class="desc">并且节约您</div>
                <div class="content">
                  <div class="large">{{ reportOrder.useTime }}</div>
                  分钟
                </div>
                <div class="desc">点单时间</div>
              </div>
            </div>
            <div class="evaluate" v-if="processStatus == 5">
              <el-input
                v-model="evaluateValue"
                :rows="5"
                type="textarea"
                placeholder="欢迎您留下评价。"
              />
              <div class="evaluate-group">
                <el-button
                  :class="evaluateButton == 1 ? 'selected' : 'normal'"
                  @click="clickEvaluate(1)"
                >
                  喜欢
                </el-button>
                <el-button
                  :class="evaluateButton == 2 ? 'selected' : 'normal'"
                  @click="clickEvaluate(2)"
                >
                  不喜欢
                </el-button>
              </div>
            </div>
            <div
              class="button-group"
              v-if="processStatus == 5 || processStatus == 4"
            >
              <el-button color="#000" style="border-radius: 12px; width: 100px">
                <div class="button-count-down">
                  <div
                    class="column"
                    :style="{
                      transform: `translateY(${-30 * timeObject.index4}px)`,
                    }"
                  >
                    <div
                      class="num"
                      v-for="(item, index) in timeObject.arr4"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                  <div
                    class="column"
                    :style="{
                      transform: `translateY(${-30 * timeObject.index3}px)`,
                    }"
                  >
                    <div
                      class="num"
                      v-for="(item, index) in timeObject.arr3"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                  <div
                    style="
                      width: 10px;
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <div style="height: 20px">:</div>
                  </div>
                  <div
                    class="column"
                    :style="{
                      transform: `translateY(${-30 * timeObject.index2}px)`,
                    }"
                  >
                    <div
                      class="num"
                      v-for="(item, index) in timeObject.arr2"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                  <div
                    class="column"
                    :style="{
                      transform: `translateY(${-30 * timeObject.index1}px)`,
                    }"
                  >
                    <div
                      class="num"
                      v-for="(item, index) in timeObject.arr1"
                      :key="index"
                    >
                      <div>{{ item }}</div>
                    </div>
                  </div>
                </div>
              </el-button>
              <el-button
                color="#000"
                style="border-radius: 12px; width: 100px"
                @click="processStatus = 0"
              >
                再来一份
              </el-button>
            </div>
            <div class="order-no" v-if="processStatus != 0">
              订单号：{{ reportOrder.orderId }}
            </div>
          </div>
        </el-main>
        <el-footer class="phone-foot-container">
          <a style="color: #ffffff" href="tel:18511623202">
            客服电话：18511623202
            张先生,微信同手机,有任何问题或优化建议可联系我们。
          </a>
        </el-footer>
      </el-container>
      <el-drawer
        v-model="showDrawer"
        :with-header="false"
        direction="ttb"
        :size="308"
      >
        <el-container>
          <el-header style="height: 60px; padding: 0"></el-header>
          <el-container>
            <el-aside class="phone-aside">
              <div class="aside-left">
                <div class="label-container">
                  <div
                    class="label"
                    :class="currentAside == 0 ? 'check' : ''"
                    @click="currentAside = 0"
                  >
                    预充值
                  </div>
                  <div class="price-container" v-if="currentPrice.length > 0">
                    ￥
                    <div class="price">{{ currentPrice }}</div>
                  </div>
                </div>
                <el-divider style="margin: 15px 0" />
                <div
                  class="label"
                  :class="currentAside == 1 ? 'check' : ''"
                  @click="currentAside = 1"
                >
                  历史订单
                </div>
              </div>
            </el-aside>
            <el-main class="phone-main-content">
              <el-scrollbar height="248px" v-show="currentAside == 0">
                <div
                  class="phone-album-container"
                  v-for="(item, index) in albumList"
                  :key="item.id"
                >
                  <div
                    class="part-container"
                    :class="currentAlbum === item.id ? 'check' : ''"
                  >
                    <div
                      class="part"
                      :style="{
                        background:
                          qrCodeImgUrl && currentAlbum === item.id
                            ? '#ffffff'
                            : `url(${item.img}) 100% no-repeat`,
                      }"
                      @click="clickAlbum(item)"
                    >
                      <img
                        v-if="qrCodeImgUrl && currentAlbum === item.id"
                        style="height: 136px; width: 136px"
                        :src="qrCodeImgUrl"
                        alt=""
                      />
                      <div :class="index < 2 ? 'txt' : 'txt2'" v-else>
                        ￥
                        <div class="big">{{ item.money }}</div>
                      </div>
                    </div>
                  </div>
                  <el-button
                    size="large"
                    color="#FFD800"
                    class="pay-disable"
                    v-if="qrCodeImgUrl && currentAlbum === item.id"
                    disabled
                  >
                    <img :src="wechatText" style="height: 25px; width: 112px" />
                  </el-button>
                  <el-button
                    size="large"
                    color="#FFD800"
                    class="pay"
                    v-else-if="currentAlbum === item.id"
                    @click="payAmount(item)"
                  >
                    确认支付
                  </el-button>
                </div>
              </el-scrollbar>
              <el-scrollbar
                height="248px"
                v-show="currentAside == 1"
                v-if="historyList.length > 0"
              >
                <div
                  class="phone-history-container"
                  v-for="(item, index) in historyList"
                  :key="item.orderId"
                >
                  <div
                    class="history-row"
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: flex-start;
                    "
                  >
                    <div
                      class="history-left"
                      style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                      "
                    >
                      <img :src="logoImg" class="history-logo" />
                    </div>
                    <div class="history-right">
                      <div class="big">AI麦当劳外卖</div>
                      <div class="desc">{{ item.diningPeople }}人份</div>
                    </div>
                  </div>
                  <div class="history-row">
                    <div class="history-left">下单时间</div>
                    <div class="history-right">{{ item.createTime }}</div>
                  </div>
                  <div class="history-row">
                    <div class="history-left">收货地址</div>
                    <div class="history-right">
                      <div>{{ item.userName + " " + item.mobile }}</div>
                      <div>
                        {{
                          item.provinceName +
                          " " +
                          item.cityName +
                          " " +
                          item.countyName +
                          " " +
                          item.detailInfo
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="history-row">
                    <div class="history-left">点餐内容</div>
                    <div class="history-right">
                      <div>{{ item.combinationArray }}</div>
                      <div>
                        {{ item.combinationPrice }}元（包含餐品+配送费+服务费）
                      </div>
                      <div>
                        为您节约{{
                          item.originalPrice - item.combinationPrice
                        }}元
                      </div>
                    </div>
                  </div>
                  <div class="history-row">
                    <div class="history-left">订单编号</div>
                    <div class="history-right">{{ item.orderId }}</div>
                  </div>
                  <el-divider
                    v-if="index != historyList.length - 1"
                    style="margin: 10px 0"
                  />
                </div>
              </el-scrollbar>
              <div v-else v-show="currentAside == 1">
                <el-empty description="这里空空如也！" :image-size="100" />
              </div>
            </el-main>
          </el-container>
        </el-container>
      </el-drawer>
      <van-popup v-model:show="cascaderShow" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="请选择所在地区"
          :options="pcaData"
          @close="cascaderShow = false"
          :field-names="{ text: 'name', value: 'code', children: 'children' }"
          @finish="cascaderFinish"
        />
      </van-popup>
    </div>
  </div>
</template>
<script setup lang="ts">
import QRCode from "qrcode";
import {
  ref,
  onBeforeMount,
  getCurrentInstance,
  watch,
  computed,
  onUnmounted,
} from "vue";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import logoImg from "@/assets/images/mcd.jpg";
import hamburgerImg from "@/assets/images/mcd-hamburger.png";
import phoneImg from "@/assets/images/mcd-phone.png";
import reportHamburgerImg from "@/assets/images/report-hamburger.png";
import mcdPay30 from "@/assets/images/mcd-pay-30.png";
import mcdPay50 from "@/assets/images/mcd-pay-50.png";
import mcdPay100 from "@/assets/images/mcd-pay-100.png";
import mcdPay200 from "@/assets/images/mcd-pay-200.png";
import wechatText from "@/assets/images/wechat-pay-text.png";
import McdModal from "@/components/McdModal.vue";
import { Popup, Cascader } from "vant";
import { isWeiXinBrowser } from "@/utils/utils";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import {
  doLogout,
  doGetInfo,
  getAddressList,
  addAddress,
  editAddress,
  delAddress,
  sendMail,
  getReportOrder,
  wechatPayMcd,
  orderDetail,
} from "@/api/index";
import { pinyin } from "pinyin-pro";
import { useRouter } from "vue-router";
import { isPhone, isHashMode } from "@/utils/utils";
import axios from "axios";
import useClipboard from "vue-clipboard3";
import {
  HomeFilled,
  OfficeBuilding,
  Plus,
  Location,
  ArrowDown,
  Edit,
  CircleCheck,
  CircleCheckFilled,
} from "@element-plus/icons-vue";
import { pca } from "./pca";
// 使用插件
const { toClipboard } = useClipboard();
// 创建axios实例
const service = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: 5000, // 请求超时时间
});
type countItem = {
  num: number;
  text: string;
};
const counts = ref<Array<countItem>>([]);
for (let index = 0; index < 4; index++) {
  const temp = index + 1;
  counts.value.push({
    num: temp,
    text: temp + "人份",
  });
}
const albumList = ref([
  { img: mcdPay30, money: "30", id: 30 },
  { img: mcdPay50, money: "50", id: 50 },
  { img: mcdPay100, money: "100", id: 100 },
  { img: mcdPay200, money: "200", id: 200 },
]);
const currentAlbum = ref(0);
const showDrawer = ref(false);
const showDialog = ref(false);
const inviteCode = ref<any>("");
const timeSecond = ref(0);
const submitLoading = ref(false);
const currentCount = ref(1);
const addressStatus = ref(0);
const proxy: any = getCurrentInstance()?.proxy ?? null;
const $router = useRouter();
const inputValue = ref("");
const evaluateValue = ref("");
const timers = ref();
const evaluateButton = ref(0);
const addressPopoverVisible = ref(false);
const cascaderValue = ref("");
const cascaderShow = ref(false);
type addressItem = {
  cityName: string;
  countyName: string;
  detailInfo: string;
  id: string;
  mobile: string;
  provinceName: string;
  userId: string;
  userName: string;
  userDetailInfo: string;
  longitude: string;
  latitude: string;
  lab: string;
};
type addressFormItem = {
  mobile: string;
  userName: string;
  detailInfo: string;
  userDetailInfo: string;
  cityName: Array<string>;
  cityCode: Array<string>;
  longitude: string;
  latitude: string;
  lab: string;
};
type reportItem = {
  orderId: string;
  accessKey: string;
  orderStatus: number;
  userName: string;
  mobile: string;
  originalPrice: number;
  originalCharge: number;
  combination: string;
  combinationPrice: number;
  combinationArray: string;
  paidCharge: number;
  sendText: string;
  detailInfo: string;
  diningPeople: number;
  createTime: string;
  provinceName: string;
  cityName: string;
  countyName: string;
  userDetailInfo: string;
  useTime: string;
};
// interface poiItem {
//   adcode: string;
//   address: string;
//   adname: string;
//   citycode: string;
//   cityname: string;
//   distance: string;
//   id: string;
//   location: string;
//   name: string;
//   parent: string;
//   pcode: string;
//   pname: string;
//   type: string;
//   typecode: string;
// }
// const detailOptions = ref<Array<poiItem>>([]);
const currentTag = ref(0);
const currentPrice = ref("");
const currentAside = ref(0);
const showUserInfo = ref(false);
const editAddressId = ref("");
const dialogEditVisible = ref(false);
const dialogTableVisible = ref(false);
const addressList = ref<Array<addressItem>>([]);
const currentAddress = ref(0);
const processStatus = ref(0); //进度状态，0是未点餐，1是gpt正在点餐，2是快递员正在取餐，3是快递员正在送餐，4是点餐失败，5是显示点餐报告
const pcaData = ref(pca);
const reportOrder = ref<reportItem>({
  orderId: "",
  accessKey: "",
  orderStatus: 0,
  userName: "",
  mobile: "",
  originalPrice: 0,
  originalCharge: 0,
  combination: "",
  combinationPrice: 0,
  combinationArray: "",
  sendText: "",
  detailInfo: "",
  diningPeople: 0,
  createTime: "",
  provinceName: "",
  cityName: "",
  countyName: "",
  userDetailInfo: "",
  paidCharge: 0,
  useTime: "",
});
const historyList = ref<Array<reportItem>>([]);
const qrCodeImgUrl = ref("");
const detailInfo = ref("");
const detailLab = ref("");
const addressEditForm = ref<addressFormItem>({
  mobile: "",
  userName: "",
  userDetailInfo: "",
  detailInfo: "",
  cityName: [],
  cityCode: [],
  longitude: "",
  latitude: "",
  lab: "",
});
const addressRules = ref<Array<boolean>>([false, false, false, false]);
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
  rmbBalance: 0,
});
const nickName = ref("");
/************************ todo-定义数据data(START) ************************/
const lineHeight = ref(48); //跟字体大小和wraper的高度相关！
type timeItem = {
  // 秒
  arr1: Array<number>;
  index1: number;
  arr2: Array<number>;
  index2: number;
  // 分
  arr3: Array<number>;
  index3: number;
  arr4: Array<number>;
  index4: number;
  // 时
  arr5: Array<number>;
  index5: number;
  arr6: Array<number>;
  index6: number;
  [key: string]: any;
};
const timeObject = ref<timeItem>({
  arr1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  index1: 0,
  arr2: [0, 1, 2, 3, 4, 5],
  index2: 0,
  // 分
  arr3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  index3: 0,
  arr4: [0, 1, 2, 3, 4, 5],
  index4: 0,
  // 时
  arr5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  index5: 0,
  arr6: [0, 1, 2],
  index6: 0,
});
const checkList = ref([
  {
    id: 0,
    txt: "麦辣鸡腿堡",
    check: false,
  },
  {
    id: 1,
    txt: "麦辣鸡翅",
    check: false,
  },
  {
    id: 2,
    txt: "板烧鸡腿堡",
    check: false,
  },
  {
    id: 3,
    txt: "巨无霸汉堡",
    check: false,
  },
  {
    id: 4,
    txt: "双层吉士堡",
    check: false,
  },
  {
    id: 5,
    txt: "麦乐鸡5块",
    check: false,
  },
  {
    id: 6,
    txt: "薯条",
    check: false,
  },
  {
    id: 7,
    txt: "酥酥笋卷",
    check: false,
  },
]);
const checkChoose = computed(() =>
  checkList.value.filter((item) => item.check)
);
const browserLocation = ref<Array<string>>([]);
const submitDisabled = ref(false);
//watch监听机型
// watch(
//   () => index5.value,
//   (newVal) => {
//     // 超过24小时
//     if (index6.value === 2 && newVal === 4) {
//       for (let i = 1; i < 7; i++) {
//         data[`index${i}`] = 0;
//       }
//     }
//   }
// );
watch(
  () => showDrawer.value,
  (newVal) => {
    if (!newVal) {
      currentAlbum.value = 0;
    }
  }
);
watch(
  () => addressEditForm.value.cityName,
  (newVal, oldVal) => {
    if (oldVal.length != 0) {
      let provinceCode = "";
      let cityCode = "";
      let countyCode = "";
      for (let index = 0; index < pca.length; index++) {
        if (pca[index].name == newVal[0]) {
          provinceCode = pca[index].code;
          for (let i = 0; i < pca[index].children.length; i++) {
            if (pca[index].children[i].name == newVal[1]) {
              cityCode = pca[index].children[i].code;
              for (let j = 0; j < pca[index].children[i].children.length; j++) {
                if (pca[index].children[i].children[j].name == newVal[2]) {
                  countyCode = pca[index].children[i].children[j].code;
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
      if (
        provinceCode.length > 0 &&
        cityCode.length > 0 &&
        countyCode.length > 0
      ) {
        addressEditForm.value.cityCode = [provinceCode, cityCode, countyCode];
        addressEditForm.value.detailInfo = "";
        detailInfo.value = "";
      }
    }
  }
);
const addDisabled = computed(() => {
  return (
    addressEditForm.value.userName &&
    addressEditForm.value.mobile &&
    addressEditForm.value.cityName.length > 0 &&
    addressEditForm.value.detailInfo
  );
});
const clickAlbum = (item: any) => {
  const temp = item.id;
  if (currentAlbum.value != temp) {
    currentAlbum.value = temp;
    currentPrice.value = "";
    qrCodeImgUrl.value = "";
    if (timers.value) {
      clearInterval(timers.value);
    }
  }
};
const agent = ref(
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
);
const startTime = () => {
  timeSecond.value = 0;
  processStatus.value = 1;
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    turnSecond(timeObject.value.arr1.length, info.token, info.accessKey);
  }
};
const turnSecond = (length: number, token: string, accessKey: string) => {
  const timer = setInterval(() => {
    if (timeObject.value.index1 === length - 1) {
      // 通知前一位移动
      turnOther(2, timeObject.value.arr2.length);
      timeObject.value.index1 = -1;
    }
    timeObject.value.index1++;
    timeSecond.value++;
    getReportOrder({
      token,
      accessKey,
      orderId: reportOrder.value.orderId,
    }).then((res) => {
      if (res.data.code == 11000 && res.data.data.length > 0) {
        const temp = res.data.data[0];
        reportOrder.value = Object.assign({}, temp, {
          originalCharge: temp.originalCharge ? temp.originalCharge : 0,
          paidCharge: temp.paidCharge ? temp.paidCharge : 0,
          useTime:
            temp.endTime && temp.runTime
              ? 10 - dayjs(temp.endTime).diff(dayjs(temp.runTime), "m")
              : "",
        });
        processStatus.value =
          reportOrder.value.orderStatus == 0 ||
          reportOrder.value.orderStatus == -1
            ? 1
            : reportOrder.value.orderStatus;
        currentCount.value = reportOrder.value.diningPeople;
        if (processStatus.value == 3 || processStatus.value == 4) {
          clearInterval(timer);
          localStorage.removeItem("mcdOrderId");
        }
      } else {
        localStorage.removeItem("mcdOrderId");
        clearInterval(timer);
        processStatus.value = 0;
      }
    });
    // if (timeSecond.value >= 300) {
    //   processStatus.value = 4;
    //   clearInterval(timer);
    // } else if (timeSecond.value >= 180) {
    //   processStatus.value = 3;
    // } else if (timeSecond.value >= 60) {
    //   processStatus.value = 2;
    // } else if (timeSecond.value >= 0) {
    //   processStatus.value = 1;
    // }
  }, 1000);
};
const turnOther = (type: number, length: number) => {
  // type代表第几组数列，例如2，就是从右往左第二列
  if (timeObject.value[`index${type}`] === length - 1) {
    // 通知前一位移动
    let next = type + 1;
    turnOther(next, timeObject.value[`arr${next}`].length);
    timeObject.value[`index${type}`] = -1;
  }
  timeObject.value[`index${type}`]++;
};
/************************ todo-定义数据data(END) ************************/
onBeforeMount(() => {
  window.location.href = "http://mbmzone.com/mcd#/";
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
    const orderId = localStorage.getItem("mcdOrderId");
    if (orderId) {
      reportOrder.value.orderId = orderId;
      startTime();
    }
  } else {
    if (agent.value) {
      $router.replace({
        name: "singleLogin",
        query: {
          redirectUrl: window.location.href,
        },
      });
    } else {
      showDialog.value = true;
    }
  }
  navigator.geolocation.getCurrentPosition((position) => {
    if (position.coords.latitude && position.coords.longitude) {
      parseLocation(position.coords.latitude, position.coords.longitude).then(
        (res) => {
          if (
            res.data.status == 1 &&
            res.data.regeocode &&
            res.data.regeocode.addressComponent
          ) {
            if (res.data.regeocode.addressComponent.city.length > 0) {
              browserLocation.value = [
                res.data.regeocode.addressComponent.province,
                res.data.regeocode.addressComponent.city,
                res.data.regeocode.addressComponent.district,
              ];
            } else {
              browserLocation.value = [
                res.data.regeocode.addressComponent.province,
                res.data.regeocode.addressComponent.province,
                res.data.regeocode.addressComponent.district,
              ];
            }
            console.log(res.data.regeocode.addressComponent);
          }
        }
      );
    }
  });
});
onUnmounted(() => {
  if (timers.value) {
    clearTimeout(timers.value);
  }
});
const getUserInfo = async (token: string, accessKey: string) => {
  const res = await doGetInfo({ token, accessKey });
  if (res.data.code === 11000) {
    userInfo.value = res.data.data;
    const firstC = getFirstChar(userInfo.value.name);
    nickName.value = firstC;
    getMyAddressList(token, accessKey);
    getOrderList(token, accessKey);
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
      rmbBalance: 0,
    };
    nickName.value = "";
    if (agent.value) {
      $router.replace({
        name: "singleLogin",
        query: {
          redirectUrl: window.location.href,
        },
      });
    } else {
      showDialog.value = true;
    }
  }
};
const getOrderList = async (token: string, accessKey: string) => {
  getReportOrder({
    token,
    accessKey,
  }).then((res) => {
    if (res.data.code == 11000) {
      historyList.value = res.data.data.map((item: reportItem) => {
        let array = "";
        if (item.combination) {
          const temp = JSON.parse(item.combination);
          if (temp.length > 0) {
            temp.forEach((item: string, index: number) => {
              array +=
                (item ? item.substring(0, item.indexOf("=")) : "") +
                (index != temp.length - 1 ? "+" : "");
            });
          }
        }
        return Object.assign({}, item, {
          combinationArray: array,
        });
      });
    }
  });
};
const getMyAddressList = async (token: string, accessKey: string) => {
  const res = await getAddressList({
    token,
    accessKey,
    userId: accessKey,
  });
  if (res.data.code === 11000) {
    if (res.data.data.length > 0) {
      addressList.value = res.data.data.map(
        (item: addressItem, index: number) =>
          Object.assign({}, item, {
            longitude: item.longitude ? item.longitude : "",
            latitude: item.latitude ? item.latitude : "",
            lab: item.lab
              ? item.lab
              : index == 0
              ? "住宅地址"
              : index == 1
              ? "办公地址"
              : `新建地址${index + 1}`,
          })
      );
    } else {
      dialogTableVisible.value = false;
      addressList.value = [];
      addressStatus.value = 0;
    }
  } else {
    ElMessage({ offset: 140, message: res.data.msg });
  }
};
const saveAddress = () => {
  if (!addressEditForm.value.userName) {
    addressRules.value[0] = true;
    showMessage({ offset: 140, message: "请填写联系人", type: "error" });
    return;
  }
  if (!isPhone(addressEditForm.value.mobile)) {
    addressRules.value[1] = true;
    showMessage({
      offset: 140,
      message: "请填写正确的手机号码",
      type: "error",
    });
    return;
  }
  if (addressEditForm.value.cityName.length == 0) {
    addressRules.value[2] = true;
    showMessage({ offset: 140, message: "请选择省市区", type: "error" });
    return;
  }
  if (!addressEditForm.value.detailInfo) {
    addressRules.value[3] = true;
    showMessage({ offset: 140, message: "请填写详细地址", type: "error" });
    return;
  }
  const temp = {
    cityName: addressEditForm.value.cityName[1],
    countyName: addressEditForm.value.cityName[2],
    detailInfo: addressEditForm.value.detailInfo,
    mobile: addressEditForm.value.mobile,
    provinceName: addressEditForm.value.cityName[0],
    userName: addressEditForm.value.userName,
    userDetailInfo: addressEditForm.value.userDetailInfo,
    latitude: addressEditForm.value.latitude,
    longitude: addressEditForm.value.longitude,
    // lab: addressEditForm.value.lab,
    lab: detailLab.value,
  };
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    if (addressStatus.value == 0 || addressStatus.value == 1) {
      addAddressItem(info.token, info.accessKey, temp);
    } else {
      editAddressItem(
        info.token,
        info.accessKey,
        Object.assign({}, temp, {
          id: editAddressId.value,
        })
      );
    }
  }
};
const addAddressItem = async (token: string, accessKey: string, dto: any) => {
  const response = await addAddress({
    token,
    accessKey,
    dto,
  });
  if (response.data.code === 11000) {
    ElMessage({ message: "添加成功", type: "success", offset: 140 });
    dialogEditVisible.value = false;
    getMyAddressList(token, accessKey);
    if (addressStatus.value == 1) {
      dialogTableVisible.value = true;
    }
    addressEditForm.value = {
      mobile: "",
      userName: "",
      detailInfo: "",
      cityName: [],
      userDetailInfo: "",
      cityCode: [],
      longitude: "",
      latitude: "",
      lab: "",
    };
    detailInfo.value = "";
    if (agent.value) {
      cascaderValue.value = "";
    }
  } else {
    ElMessage({ offset: 140, message: response.data.msg });
  }
};
const editAddressItem = async (token: string, accessKey: string, dto: any) => {
  const response = await editAddress({
    token,
    accessKey,
    dto,
  });
  if (response.data.code === 11000) {
    ElMessage({ message: "更新成功", type: "success", offset: 140 });
    dialogEditVisible.value = false;
    getMyAddressList(token, accessKey);
    dialogTableVisible.value = true;
    addressEditForm.value = {
      mobile: "",
      userName: "",
      detailInfo: "",
      cityName: [],
      userDetailInfo: "",
      cityCode: [],
      longitude: "",
      latitude: "",
      lab: "",
    };
    detailInfo.value = "";
    if (agent.value) {
      cascaderValue.value = "";
    }
  } else {
    ElMessage({ offset: 140, message: response.data.msg });
  }
};
const parseLocation = (lat: number | string, lng: number | string) => {
  return service.get(
    `https://restapi.amap.com/v3/geocode/regeo?location=${lng},${lat}&key=a9e09a5e99b12541c4f59b218379f78a`
  );
};
const parseAddress = (detailInfo: string) => {
  return service.get(
    `https://restapi.amap.com/v3/geocode/geo?address=${detailInfo}&key=a9e09a5e99b12541c4f59b218379f78a`
  );
};
const parsePoi = (detailInfo: string) => {
  if (
    addressEditForm.value &&
    addressEditForm.value.cityCode &&
    addressEditForm.value.cityCode.length > 0
  ) {
    return service.get(
      `https://restapi.amap.com/v5/place/text?key=a9e09a5e99b12541c4f59b218379f78a&region=${addressEditForm.value.cityCode[2]}&keywords=${detailInfo}`
    );
  }
  return service.get(
    `https://restapi.amap.com/v5/place/text?key=a9e09a5e99b12541c4f59b218379f78a&keywords=${detailInfo}`
  );
};
const add = (index: number) => {
  addressStatus.value = 1;
  dialogEditVisible.value = true;
  dialogTableVisible.value = false;
  let temp = "";
  if (addressList.value.length == 1 && addressList.value[0].lab == "办公地址") {
    temp = "住宅地址";
  }
  let tempCityCode = [];
  if (browserLocation.value.length > 0) {
    for (let index = 0; index < pca.length; index++) {
      if (pca[index].name == browserLocation.value[0]) {
        tempCityCode.push(pca[index].code);
        for (let i = 0; i < pca[index].children.length; i++) {
          if (pca[index].children[i].name == browserLocation.value[1]) {
            tempCityCode.push(pca[index].children[i].code);
            for (let j = 0; j < pca[index].children[i].children.length; j++) {
              if (
                pca[index].children[i].children[j].name ==
                browserLocation.value[2]
              ) {
                tempCityCode.push(pca[index].children[i].children[j].code);
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
  }
  addressEditForm.value = {
    mobile: "",
    userName: "",
    detailInfo: "",
    cityName: tempCityCode.length > 0 ? browserLocation.value : [],
    userDetailInfo: "",
    cityCode: tempCityCode,
    longitude: "",
    latitude: "",
    lab:
      temp.length > 0
        ? temp
        : index == 0
        ? "住宅地址"
        : index == 1
        ? "办公地址"
        : `新建地址${index + 1}`,
  };
  detailInfo.value = "";
  detailLab.value = addressEditForm.value.lab;
  editAddressId.value = "";
  addressRules.value = [false, false, false, false];
};
const chooseAddress = (index: number) => {
  if (dialogEditVisible.value) {
    dialogEditVisible.value = false;
    if (agent.value) {
      cascaderValue.value = "";
    }
  }
  if (index != currentAddress.value) {
    currentAddress.value = index;
  }
  addressEditForm.value = {
    mobile: "",
    userName: "",
    detailInfo: "",
    cityName: [],
    userDetailInfo: "",
    cityCode: [],
    longitude: "",
    latitude: "",
    lab: "",
  };
  detailInfo.value = "";
  if (agent.value) {
    addressPopoverVisible.value = false;
  }
};
const addressBack = () => {
  dialogEditVisible.value = false;
  addressEditForm.value = {
    mobile: "",
    userName: "",
    detailInfo: "",
    cityName: [],
    userDetailInfo: "",
    cityCode: [],
    longitude: "",
    latitude: "",
    lab: "",
  };
};
const edit = () => {
  let provinceCode = "";
  let cityCode = "";
  let countyCode = "";
  for (let index = 0; index < pca.length; index++) {
    if (
      pca[index].name == addressList.value[currentAddress.value].provinceName
    ) {
      provinceCode = pca[index].code;
      for (let i = 0; i < pca[index].children.length; i++) {
        if (
          pca[index].children[i].name ==
          addressList.value[currentAddress.value].cityName
        ) {
          cityCode = pca[index].children[i].code;
          for (let j = 0; j < pca[index].children[i].children.length; j++) {
            if (
              pca[index].children[i].children[j].name ==
              addressList.value[currentAddress.value].countyName
            ) {
              countyCode = pca[index].children[i].children[j].code;
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }
  addressEditForm.value = {
    mobile: addressList.value[currentAddress.value].mobile,
    userName: addressList.value[currentAddress.value].userName,
    detailInfo: addressList.value[currentAddress.value].detailInfo,
    userDetailInfo: addressList.value[currentAddress.value].userDetailInfo,
    cityName: [
      addressList.value[currentAddress.value].provinceName,
      addressList.value[currentAddress.value].cityName,
      addressList.value[currentAddress.value].countyName,
    ],
    cityCode:
      provinceCode.length > 0 && cityCode.length > 0 && countyCode.length > 0
        ? [provinceCode, cityCode, countyCode]
        : [],
    latitude: addressList.value[currentAddress.value].latitude,
    longitude: addressList.value[currentAddress.value].longitude,
    lab: addressList.value[currentAddress.value].lab,
  };
  detailInfo.value = addressList.value[currentAddress.value].detailInfo;
  detailLab.value = addressList.value[currentAddress.value].lab;
  dialogTableVisible.value = false;
  dialogEditVisible.value = true;
  editAddressId.value = addressList.value[currentAddress.value].id;
  addressStatus.value = 2;
};
const editPhoneAddress = (temp: number) => {
  let provinceCode = "";
  let cityCode = "";
  let countyCode = "";
  for (let index = 0; index < pca.length; index++) {
    if (pca[index].name == addressList.value[temp].provinceName) {
      provinceCode = pca[index].code;
      for (let i = 0; i < pca[index].children.length; i++) {
        if (pca[index].children[i].name == addressList.value[temp].cityName) {
          cityCode = pca[index].children[i].code;
          for (let j = 0; j < pca[index].children[i].children.length; j++) {
            if (
              pca[index].children[i].children[j].name ==
              addressList.value[temp].countyName
            ) {
              countyCode = pca[index].children[i].children[j].code;
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }
  addressEditForm.value = {
    mobile: addressList.value[temp].mobile,
    userName: addressList.value[temp].userName,
    detailInfo: addressList.value[temp].detailInfo,
    userDetailInfo: addressList.value[temp].userDetailInfo,
    cityName: [
      addressList.value[temp].provinceName,
      addressList.value[temp].cityName,
      addressList.value[temp].countyName,
    ],
    cityCode:
      provinceCode.length > 0 && cityCode.length > 0 && countyCode.length > 0
        ? [provinceCode, cityCode, countyCode]
        : [],
    latitude: addressList.value[temp].latitude,
    longitude: addressList.value[temp].longitude,
    lab: addressList.value[temp].lab,
  };
  detailInfo.value = addressList.value[temp].detailInfo;
  detailLab.value = addressList.value[temp].lab;
  dialogTableVisible.value = false;
  dialogEditVisible.value = true;
  editAddressId.value = addressList.value[temp].id;
  addressStatus.value = 2;
  addressPopoverVisible.value = false;
};
const del = () => {
  ElMessageBox.confirm("是否删除该送餐地址？", "提示").then(() => {
    let usr = localStorage.getItem("userInfo");
    if (usr) {
      const info = JSON.parse(usr);
      delAddressItem(info.token, info.accessKey, editAddressId.value).then(
        (res) => {
          if (res.data.code === 11000) {
            dialogEditVisible.value = false;
            if (agent.value) {
              cascaderValue.value = "";
            }
            // if (currentAddress.value == index) {
            //   currentAddress.value = 0;
            // } else if (currentAddress.value > index) {
            //   currentAddress.value--;
            // }
            addressEditForm.value = {
              mobile: "",
              userName: "",
              detailInfo: "",
              cityName: [],
              userDetailInfo: "",
              cityCode: [],
              longitude: "",
              latitude: "",
              lab: "",
            };
            getMyAddressList(info.token, info.accessKey);
            ElMessage({ message: "删除成功", type: "success", offset: 140 });
          } else {
            ElMessage({ offset: 140, message: res.data.msg });
          }
        }
      );
    }
  });
};
const delAddressItem = (token: string, accessKey: string, id: string) => {
  return delAddress({ token, accessKey, id });
};
const changeCount = (item: countItem) => {
  if (submitLoading.value) {
    return;
  }
  currentCount.value = item.num;
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
const clickRun = async () => {
  if (submitLoading.value) {
    return;
  }
  if (addressList.value.length == 0) {
    ElMessage({ message: "请先填写一个送餐地址", type: "error", offset: 140 });
    return;
  }
  let addRemarks = "";
  if (currentTag.value == 2) {
    checkChoose.value.forEach((item) => {
      addRemarks += item.txt + ",";
    });
    if (addRemarks.length == 0) {
      ElMessageBox.alert("请至少选择一项您想要的餐品", "提示", {
        confirmButtonText: "知道了",
        type: "warning",
        showCancelButton: false,
      });
      return;
    }
  }
  ElMessageBox.confirm("是否确认下单？", "提示").then(() => {
    ElMessage({ message: "正在下单处理中...", type: "success", offset: 140 });
    submitLoading.value = true;
    let usr = localStorage.getItem("userInfo");
    if (usr) {
      confirmForm(usr, addRemarks);
    }
  });
};
const confirmForm = async (usr: string, addRemarks: string) => {
  const info = JSON.parse(usr);
  const res = await sendMail({
    token: info.token,
    accessKey: info.accessKey,
    dto: {
      diningPeople: currentCount.value,
      remarks: addRemarks + inputValue.value,
      userAddressId: addressList.value[currentAddress.value].id,
      charactersType: currentTag.value,
    },
  });
  submitLoading.value = false;
  if (res.data.code === 11000) {
    ElMessage({ message: "下单成功！", type: "success", offset: 140 });
    reportOrder.value = res.data.data;
    localStorage.setItem("mcdOrderId", reportOrder.value.orderId);
    startTime();
  } else {
    ElMessage({ message: res.data.msg, type: "error", offset: 140 });
  }
};
const goHome = () => {
  $router.replace({ name: "home" });
};
const updateUserInfo = () => {
  let usr = localStorage.getItem("userInfo");
  if (usr) {
    const info = JSON.parse(usr);
    getUserInfo(info.token, info.accessKey);
  }
};
const navSetting = () => {
  $router.push({ name: "setting" });
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
    ElMessage({ message: "复制成功", type: "success", offset: 140 });
  } catch (e) {
    ElMessage({ offset: 140, message: "复制失败" });
  }
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
      rmbBalance: 0,
    };
    showUserInfo.value = false;
    goHome();
    qrCodeImgUrl.value = "";
  });
};
const clickEvaluate = (num: number) => {
  if (evaluateButton.value === 0) {
    evaluateButton.value = num;
    ElMessage({
      message: "感谢您的评价！祝您生活愉快",
      type: "success",
      offset: 140,
    });
  }
};
const openReport = () => {
  if (processStatus.value == 4) {
    processStatus.value = 5;
  }
};
const queryPoi = (queryString: string, cb: Function) => {
  if (queryString) {
    parsePoi(queryString).then((res) => {
      cb(res.data.pois);
    });
  }
};
const blurPoi = () => {
  detailInfo.value = addressEditForm.value.detailInfo;
  if (detailInfo.value.length == 0) {
    addressRules.value[3] = true;
    showMessage({
      offset: 140,
      message: "请在下拉选项里选择详细地址",
      type: "warning",
    });
  }
};
const blurTel = () => {
  if (!isPhone(addressEditForm.value.mobile)) {
    addressRules.value[1] = true;
    showMessage({
      offset: 140,
      message: "请填写正确的手机号码",
      type: "error",
    });
  }
};
const blurLab = () => {
  if (detailLab.value.length == 0) {
    if (addressStatus.value == 2) {
      detailLab.value = addressList.value[currentAddress.value].lab;
    } else {
      detailLab.value = addressEditForm.value.lab;
    }
  }
};
const handlePoi = (item: any) => {
  if (item && item.name) {
    addressEditForm.value.detailInfo = item.address + item.name;
    detailInfo.value = item.address + item.name;
    if (item.location && item.location.length > 0) {
      const location = item.location.split(",");
      addressEditForm.value.longitude = location.length > 0 ? location[0] : "";
      addressEditForm.value.latitude = location.length > 0 ? location[1] : "";
    } else {
      addressEditForm.value.longitude = "";
      addressEditForm.value.latitude = "";
    }
  }
};
const showMessage = (params: any) => {
  ElMessage(params);
};
const loginComplete = (data: any) => {
  if (data) {
    showDialog.value = false;
    localStorage.setItem("userInfo", JSON.stringify(data));
    userInfo.value = data;
    const firstC = getFirstChar(userInfo.value.name);
    nickName.value = firstC;
    getUserInfo(userInfo.value.token, userInfo.value.accessKey);
  }
};
const onCheck = (check: boolean, index: number) => {
  checkList.value[index].check = check;
};
const removeChoose = (id: number) => {
  checkList.value[id].check = false;
};
const payAmount = async (item: { img: string; id: number; money: string }) => {
  if (isWeiXinBrowser()) {
    window.location.href =
      `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa1c2983ad99da4bc&redirect_uri=https%3A%2F%2F${
        import.meta.env.VITE_PUBLIC_URL
      }%2Fapi%2FgetOpenid&response_type=code&scope=snsapi_base&state=` +
      userInfo.value.id +
      "-" +
      item.id +
      "-rmb";
  } else {
    const img = await wechatPayMcd({
      accessKey: userInfo.value.accessKey,
      osType: agent.value ? 2 : 1,
      payAmount: +item.id,
      currency: "RMB",
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
        currentPrice.value = item.id + "";
        qrCodeImgUrl.value = res1;
        if (qrCodeImgUrl.value) {
          loopOrderDetail(img.data.data.orderNo);
        }
      });
    }
  }
};
const loopOrderDetail = async (orderNo: string) => {
  const orderResult = await orderDetail({
    orderNo,
    accessKey: userInfo.value.accessKey,
  });
  if (orderResult.data.data.payStatus === 1) {
    clearTimeout(timers.value);
    timers.value = "";
    qrCodeImgUrl.value = "";
    currentAlbum.value = 0;
    showDrawer.value = false;
    currentPrice.value = "";
    setTimeout(() => {
      ElMessage({
        type: "success",
        message: "恭喜您，充值成功。",
        offset: 140,
      });
    }, 500);
    updateUserInfo();
  } else {
    timers.value = setTimeout(() => {
      loopOrderDetail(orderNo);
    }, 3000);
  }
};
const cascaderFinish = ({
  value,
  selectedOptions,
}: {
  value: string | number;
  selectedOptions: any;
}) => {
  cascaderValue.value = value + "";
  addressEditForm.value.cityName = [
    selectedOptions[0].name,
    selectedOptions[1].name,
    selectedOptions[2].name,
  ];
  addressEditForm.value.cityCode = [
    selectedOptions[0].code,
    selectedOptions[1].code,
    selectedOptions[2].code,
  ];
  cascaderShow.value = false;
};
const openCascader = () => {
  addressRules.value[2] = false;
  if (addressEditForm.value.cityCode.length > 0) {
    cascaderValue.value = addressEditForm.value.cityCode[2];
  }
  cascaderShow.value = true;
};
</script>
<style lang="scss" scoped>
.px-common-layout {
  background: #f6f9fc;
  .header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100vw;
    background: #ffffff;
    padding: 0 20px;
    z-index: 2048;
    .header-left {
      position: absolute;
      left: 20px;
      top: 0;
      height: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 99;
      .logo {
        width: 140px;
        min-width: 140px;
        cursor: pointer;
        z-index: 99;
      }
    }
    .center-logo {
      height: 80px;
    }
    .header-right {
      // width: 140px;
      // min-width: 140px;
      position: absolute;
      top: 0;
      right: 20px;
      height: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .avatar {
        width: 48px;
        height: 48px;
        background: #6cc8e6;
        box-shadow: 3px 6px 9px rgba(0, 0, 0, 0.16);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        font-size: 1rem;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        color: #ffffff;
        z-index: 2;
        cursor: pointer;
      }
      .info {
        background: linear-gradient(
          90deg,
          rgba(67, 202, 234, 1) 0%,
          rgba(148, 81, 235, 0.81) 65%,
          rgba(235, 72, 160, 1) 100%
        );
        height: 40px;
        padding: 0 24px;
        margin-right: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        .txt {
          font-size: 1rem;
          font-family: Gotham-Rounded;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
  .phone-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 100vw;
    background: #ffffff;
    padding: 0 20px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    z-index: 2048;
    position: relative;
    .logo {
      height: 20px;
      cursor: pointer;
      position: absolute;
      left: 20px;
      top: 20px;
    }
    .center-logo {
      height: 40px;
    }
    .header-right {
      width: 140px;
      min-width: 140px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      position: absolute;
      right: 20px;
      top: 10px;
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
        font-size: 1rem;
        font-family: FUTURA-MEDIUM;
        font-weight: bold;
        color: #ffffff;
        z-index: 2;
        cursor: pointer;
      }
      .info {
        background: linear-gradient(
          90deg,
          rgba(67, 202, 234, 1) 0%,
          rgba(148, 81, 235, 0.81) 65%,
          rgba(235, 72, 160, 1) 100%
        );
        height: 40px;
        padding: 0 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        .txt {
          font-size: 12px;
          font-family: Gotham-Rounded;
          font-weight: bold;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .main {
    height: calc(100vh - 140px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .edit-address {
      height: 70vh;
      width: 60vw;
      background: #ffffff;
      border-radius: 29px;
      padding: 50px 30px;
      border: #cecbcb 1px solid;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      .back {
        position: absolute;
        top: 30px;
        left: 50px;
        font-size: 1rem;
        color: #59d0ec;
        text-decoration: underline;
        cursor: pointer;
      }
      .del {
        position: absolute;
        top: 30px;
        right: 50px;
        font-size: 1rem;
        color: #f56c6c;
        text-decoration: underline;
        cursor: pointer;
      }
      .edit-label-container {
        width: 300px;
        .label {
          color: #59d0ec;
          font-size: 3rem;
          line-height: 3rem;
        }
        :deep(.el-input__wrapper) {
          box-shadow: none;
        }
        :deep(.el-cascader) {
          width: 100%;
        }
        :deep(.el-input__inner) {
          text-align: center;
          color: #59d0ec;
          --el-input-inner-height: auto !important;
        }
      }
      .edit-input-container {
        border: #121212 1px solid;
        width: 20vw;
        height: 50px;
        border-radius: 11px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 5px 8px;
        &.rule {
          border: #f56c6c 1px solid;
        }
        :deep(.el-input__wrapper) {
          box-shadow: none;
        }
        :deep(.el-cascader) {
          width: 100%;
        }
      }
      .confirm {
        color: #59d0ec;
        font-size: 3rem;
        cursor: pointer;
      }
    }
    .address-container {
      position: absolute;
      top: 20vh;
      left: 30px;
      background: #ffffff;
      padding: 12px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
      border-radius: 17px;
      z-index: 999;
      .part {
        padding: 5px 10px;
        border-radius: 15px;
        margin: 6px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: #43caea;
        cursor: pointer;
        &.check {
          background: #43caea;
          color: #ffffff;
        }
        .title {
          font-size: 1rem;
          margin-left: 10px;
        }
      }
    }
    .tag-container {
      width: 380px;
      height: 46px;
      border-radius: 30px;
      background: #d9e1e3;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      box-shadow: inset 2px 2px 9px rgba(0, 0, 0, 0.16);
      .tag-part {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .check {
          background: linear-gradient(
            90deg,
            rgba(67, 202, 234, 1) 0%,
            rgba(148, 81, 235, 0.81) 55%,
            rgba(235, 72, 160, 1) 100%
          );
          height: 40px;
          width: 96%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          mix-blend-mode: multiply;
          cursor: pointer;
          .tag {
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #fff;
            font-size: 1rem;
          }
        }
        .normal {
          width: 100%;
          height: 100%;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .tag {
            color: rgba(0, 0, 0, 0.5);
            font-family: Gotham-Rounded;
            font-weight: bold;
            font-size: 1rem;
          }
        }
      }
    }
    .big {
      color: #000;
      font-size: 4rem;
      font-family: Gotham-Rounded;
    }
    .big-desc {
      color: #000;
      font-size: 1rem;
      font-family: Gotham-Rounded;
      margin-bottom: 30px;
    }
    .address {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 1.5rem;
      .hamburger {
        height: 30px;
        width: 36px;
      }
      .phone {
        height: 30px;
        width: 18px;
      }
      .part {
        padding: 5px 15px;
        border-radius: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        color: #43caea;
        border: #43caea 1px solid;
        margin-left: 30px;
        cursor: pointer;
        &:hover {
          background: #43caea;
          color: #ffffff;
        }
        .title {
          font-size: 1rem;
          margin-left: 20px;
        }
      }
    }
    .contact {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 1.5rem;
      margin-top: 10px;
      .phone {
        margin-left: 30px;
        height: 30px;
        width: 18px;
      }
      .label {
        font-weight: bold;
      }
    }
    .count-container {
      width: 30vw;
    }
    .count {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
      margin-top: 10px;
      .txt {
        color: #000;
        font-size: 1rem;
        line-height: 2rem;
        .num {
          font-size: 3rem;
          line-height: 3rem;
        }
      }
    }
    .count-normal {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
      margin-top: 10px;
      .txt {
        color: #000;
        font-size: 1rem;
        line-height: 2rem;
        opacity: 0.3;
        .num {
          font-size: 3rem;
          line-height: 3rem;
        }
      }
    }
    .area {
      width: 960px;
      margin-top: 20px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      // padding: 20px 30px;
      border-radius: 10px;
      .want-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 30px 0 30px;
        .label {
          color: #8a8b8b;
          font-size: 20px;
          white-space: nowrap;
        }
        .tags-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          .tags {
            margin-left: 20px;
          }
          :deep(.el-tag--dark) {
            --el-tag-bg-color: none;
            --el-tag-border-color: none;
            // --el-tag-hover-color: none;
          }
        }
      }
      .area-container {
        padding: 20px 30px;
        :deep(.el-textarea__inner) {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 0;
        }
        :deep(.el-textarea__inner:hover) {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      }
      .check-container {
        width: 100%;
        height: 40px;
        background: rgba(255, 216, 0, 0.15);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
      }
    }
    .button {
      margin-top: 30px;
      width: 140px;
      border-radius: 12px;
    }
    .process-container {
      width: 600px;
      margin-top: 20px;
      .pro {
        height: 120px;
        background: #3180ff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .txt {
          font-size: 1rem;
          color: #ffffff;
        }
      }
    }
    .count-down {
      text-align: center;
      border-radius: 12px;
      width: 120px;
      height: 48px;
      font-size: 1rem;
      font-weight: bolder;
      margin-top: 30px;
      display: flex;
      justify-content: center;
      overflow: hidden;
      border: #000 solid 1px;
      .column {
        transition: transform 300ms;
      }
      .num {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 48px;
        width: 10px;
      }
    }
    .button-count-down {
      text-align: center;
      height: 30px;
      font-size: 1rem;
      color: #fff;
      font-weight: bolder;
      display: flex;
      justify-content: center;
      overflow: hidden;
      .column {
        transition: transform 300ms;
      }
      .num {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 30px;
        width: 10px;
      }
    }
    .report-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      .hamburger {
        width: 120px;
        height: 120px;
      }
      .solid {
        margin: 10px 0 10px 36px;
        width: 1px;
        height: 100px;
        background: #737379;
      }
      .report-part {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin-left: 30px;
        .desc {
          color: #737379;
          font-size: 1rem;
        }
        .content {
          font-size: 1.5rem;
          color: #000000;
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          justify-content: center;
          line-height: 2rem;
          margin-top: 10px;
          .large {
            font-size: 3rem;
            line-height: 3rem;
            color: #000000;
            font-weight: bold;
          }
        }
      }
    }
    .evaluate {
      width: 30vw;
      margin-top: 20px;
      position: relative;
      .evaluate-group {
        position: absolute;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        right: 10px;
        top: 40px;
        .normal {
          width: 80px;
          background: #ffffff;
          border: #000 1px solid;
          color: #000;
          border-radius: 8px;
        }
        .selected {
          width: 80px;
          background: #000000;
          border: #000 1px solid;
          color: #fff;
          border-radius: 8px;
        }
      }
    }
    .button-group {
      width: 15vw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
    }
    .order-no {
      margin-top: 30px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .foot-container {
    background: #b967db;
    height: 40px;
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: FUTURA-MEDIUM;
    color: #ffffff;
    font-size: 18px;
  }
  .phone-foot-container {
    background: #b967db;
    height: 80px;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: FUTURA-MEDIUM;
    color: #ffffff;
    font-size: 14px;
  }
  .phone-main {
    height: calc(100vh - 60px - 80px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .edit-address {
      // height: 70vh;
      width: 100vw;
      // background: #ffffff;
      border-radius: 29px;
      // padding: 50px 30px;
      // border: #cecbcb 1px solid;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 80px 0 0;
      .back {
        position: absolute;
        top: 20px;
        left: 30px;
        font-size: 18px;
        color: #59d0ec;
        text-decoration: underline;
        cursor: pointer;
      }
      .del {
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 18px;
        color: #f56c6c;
        text-decoration: underline;
        cursor: pointer;
      }
      .edit-label-container {
        width: 300px;
        .label {
          color: #59d0ec;
          font-size: 32px;
          line-height: 32px;
        }
        :deep(.el-input__wrapper) {
          box-shadow: none;
          background: transparent;
        }
        :deep(.el-cascader) {
          width: 100%;
        }
        :deep(.el-input__inner) {
          text-align: center;
          color: #59d0ec;
          --el-input-inner-height: auto !important;
        }
      }
      .edit-input-container {
        border: #121212 1px solid;
        width: 300px;
        height: 50px;
        border-radius: 11px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 5px 8px;
        .input-content {
          font-size: 14px;
          padding: 1px 11px;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        &.rule {
          border: #f56c6c 1px solid;
        }
        :deep(.el-input__wrapper) {
          box-shadow: none;
          background: transparent;
        }
        :deep(.el-cascader) {
          width: 100%;
        }
      }
      .confirm {
        color: #59d0ec;
        font-size: 32px;
        cursor: pointer;
      }
    }
    .tag-container {
      width: 320px;
      height: 46px;
      border-radius: 30px;
      background: #d9e1e3;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      box-shadow: inset 2px 2px 9px rgba(0, 0, 0, 0.16);
      margin: 30px 0;
      .tag-part {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .check {
          background: linear-gradient(
            90deg,
            rgba(67, 202, 234, 1) 0%,
            rgba(148, 81, 235, 0.81) 55%,
            rgba(235, 72, 160, 1) 100%
          );
          height: 40px;
          width: 96%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          mix-blend-mode: multiply;
          cursor: pointer;
          .tag {
            font-family: Gotham-Rounded;
            font-weight: bold;
            color: #fff;
            font-size: 1rem;
          }
        }
        .normal {
          width: 100%;
          height: 100%;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .tag {
            color: rgba(0, 0, 0, 0.5);
            font-family: Gotham-Rounded;
            font-weight: bold;
            font-size: 1rem;
          }
        }
      }
    }
    .big {
      color: #000;
      font-size: 36px;
      font-family: Gotham-Rounded;
      margin-top: 20px;
    }
    .big-desc {
      color: #000;
      font-size: 16px;
      font-family: Gotham-Rounded;
      margin-bottom: 30px;
    }
    .address {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 320px;
      background: #ffffff;
      padding: 12px;
      .hamburger-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 18px;
        color: #000;
      }
      .phone-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        font-size: 14px;
        color: #666;
      }
    }
    .count-container {
      width: 300px;
      margin-top: 30px;
    }
    .count {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
      margin-top: 10px;
      .txt {
        color: #000;
        font-size: 18px;
        line-height: 24px;
        .num {
          font-size: 32px;
          line-height: 32px;
        }
      }
    }
    .count-normal {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
      margin-top: 10px;
      .txt {
        color: #000;
        font-size: 18px;
        line-height: 24px;
        opacity: 0.3;
        .num {
          font-size: 32px;
          line-height: 32px;
        }
      }
    }
    .area {
      width: 300px;
      margin-top: 20px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      // padding: 20px 30px;
      border-radius: 10px;
      .want-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 30px 0 30px;
        .label {
          color: #8a8b8b;
          font-size: 20px;
          white-space: nowrap;
        }
        .tags-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          .tags {
            margin-left: 20px;
          }
          :deep(.el-tag--dark) {
            --el-tag-bg-color: none;
            --el-tag-border-color: none;
            // --el-tag-hover-color: none;
          }
        }
      }
      .area-container {
        padding: 20px 30px;
        :deep(.el-textarea__inner) {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 0;
        }
        :deep(.el-textarea__inner:hover) {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      }
      .check-container {
        width: 100%;
        height: 40px;
        background: rgba(255, 216, 0, 0.15);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
      }
    }
    .button {
      margin-top: 30px;
      width: 140px;
      border-radius: 12px;
    }
    .process-container {
      width: 320px;
      margin-top: 20px;
      .pro {
        height: 80px;
        background: #3180ff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .txt {
          font-size: 1rem;
          color: #ffffff;
        }
      }
    }
    .count-down {
      text-align: center;
      border-radius: 12px;
      width: 120px;
      height: 48px;
      font-size: 1rem;
      font-weight: bolder;
      margin-top: 30px;
      display: flex;
      justify-content: center;
      overflow: hidden;
      border: #000 solid 1px;
      .column {
        transition: transform 300ms;
      }
      .num {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 48px;
        width: 10px;
      }
    }
    .button-count-down {
      text-align: center;
      height: 30px;
      font-size: 1rem;
      color: #fff;
      font-weight: bolder;
      display: flex;
      justify-content: center;
      overflow: hidden;
      .column {
        transition: transform 300ms;
      }
      .num {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 30px;
        width: 10px;
      }
    }
    .report-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      .hamburger {
        width: 120px;
        height: 120px;
      }
      .solid {
        margin: 10px 0 10px 36px;
        width: 1px;
        height: 100px;
        background: #737379;
      }
      .report-part {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin-left: 10px;
        .desc {
          color: #737379;
          font-size: 16px;
        }
        .content {
          font-size: 20px;
          color: #000000;
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          justify-content: center;
          line-height: 20px;
          margin-top: 10px;
          .large {
            font-size: 24px;
            line-height: 24px;
            color: #000000;
            font-weight: bold;
          }
        }
      }
    }
    .evaluate {
      width: 320px;
      margin-top: 20px;
      position: relative;
      .evaluate-group {
        position: absolute;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        right: 10px;
        bottom: 10px;
        .normal {
          width: 80px;
          background: #ffffff;
          border: #000 1px solid;
          color: #000;
          border-radius: 8px;
        }
        .selected {
          width: 80px;
          background: #000000;
          border: #000 1px solid;
          color: #fff;
          border-radius: 8px;
        }
      }
    }
    .button-group {
      width: 160px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
    }
    .order-no {
      margin-top: 30px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
}
.el-button .custom-loading .circular {
  margin-right: 6px;
  width: 18px;
  height: 18px;
  animation: loading-rotate 2s linear infinite;
}
.el-button .custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-button-text-color);
  stroke-linecap: round;
}
:global(.user.el-popover.el-popper) {
  background: transparent !important;
  padding: 20px 50px 0 0;
  box-shadow: none;
  border: none;
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
:global(.el-autocomplete) {
  width: 100% !important;
}
.complete-container {
  border-bottom: #f2f2f2 solid 1px;
  .value {
    color: #000000;
    font-size: 1rem;
  }
  .link {
    color: #848484;
    font-size: 0.8rem;
  }
}
.my-autocomplete {
  width: 100%;
}
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}

:global(.el-scrollbar) {
  background: #fff !important;
  border: none;
}
:deep(.wrap-dialog) {
  width: 588px;
  overflow: hidden;
  border-radius: 11px;
  background: #000;
}
:deep(.wrap-dialog .el-dialog__header) {
  display: none;
}
:deep(.wrap-dialog .el-dialog__body) {
  width: auto;
  height: auto;
  padding: 0;
  border-radius: 11px;
  overflow: hidden;
}
:deep(.wrap-dialog .el-drawer.ttb) {
  top: 100px;
}
:deep(.wrap-dialog .el-drawer__body) {
  padding: 0;
}
:deep(.el-drawer .el-drawer__body) {
  padding: 0;
}
// .wrap-dialog {
//   width: 588px;
//   overflow: hidden;
//   border-radius: 11px;
//   :deep(.el-dialog__header) {
//     display: none !important;
//   }
//   :deep(.el-dialog__body) {
//     width: auto;
//     height: auto;
//     padding: 0;
//     border-radius: 11px;
//     overflow: hidden;
//   }
//   :deep(.el-drawer.ttb) {
//     top: 100px;
//   }
//   :deep(.el-drawer__body) {
//     padding: 0;
//   }
// }

.aside {
  width: 375px;
  min-width: 375px;
  color: #fff;
  box-sizing: border-box;
  min-height: 368px;
  padding: 0 50px;
  .aside-left {
    height: 268px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .label-container {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .price-container {
        color: #000000;
        font-size: 1rem;
        font-family: FUTURA-MEDIUM;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .price {
          color: #000000;
          font-size: 2rem;
          font-family: FUTURA-MEDIUM;
        }
      }
    }
    .label {
      font-size: 2rem;
      font-family: Gotham-Rounded;
      font-weight: bold;
      color: #afadaa;
      cursor: pointer;
      &.check {
        color: #000;
      }
    }
  }
}

.phone-aside {
  width: 140px;
  min-width: 140px;
  color: #fff;
  box-sizing: border-box;
  min-height: 248px;
  padding: 0 20px;
  .aside-left {
    height: 248px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .label-container {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .price-container {
        color: #000000;
        font-size: 1rem;
        font-family: FUTURA-MEDIUM;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .price {
          color: #000000;
          font-size: 2rem;
          font-family: FUTURA-MEDIUM;
        }
      }
    }
    .label {
      font-size: 18px;
      font-family: Gotham-Rounded;
      font-weight: bold;
      color: #afadaa;
      cursor: pointer;
      &.check {
        color: #000;
      }
    }
  }
}
.main-content {
  box-shadow: inset 6px -1px 12px rgba(0, 0, 0, 0.16);
  padding: 0 0 20px;
}
.phone-main-content {
  box-shadow: inset 6px -1px 12px rgba(0, 0, 0, 0.16);
  padding: 0;
}
.album-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .part-container {
    width: 294px;
    height: 168px;
    margin-bottom: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    &.check {
      background: #ffd800;
    }
    .part {
      width: 248px;
      height: 140px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px #000 solid;
      border-radius: 12px;
      .txt {
        color: #000000;
        font-size: 1rem;
        font-family: FUTURA-MEDIUM;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .big {
          color: #000000;
          font-size: 3rem;
          font-family: FUTURA-MEDIUM;
        }
      }
      .txt2 {
        color: #ffd800;
        font-size: 1rem;
        font-family: FUTURA-MEDIUM;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .big {
          color: #ffd800;
          font-size: 3rem;
          font-family: FUTURA-MEDIUM;
        }
      }
    }
  }
  .pay {
    border: #000000 solid 1px;
    width: 150px;
    height: 50px;
    font-size: 1rem;
    font-weight: bold;
    font-family: FUTURA-MEDIUM;
  }
  .pay-disable {
    background: #f2f2f2;
    border: #f2f2f2 solid 1px;
    width: 150px;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
.phone-album-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 30px 0 0;
  .part-container {
    width: 206px;
    height: 118px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    &.check {
      background: #ffd800;
    }
    .part {
      width: 174px;
      height: 98px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px #000 solid;
      border-radius: 12px;
      .txt {
        color: #000000;
        font-size: 18px;
        font-family: FUTURA-MEDIUM;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .big {
          color: #000000;
          font-size: 24px;
          font-family: FUTURA-MEDIUM;
        }
      }
      .txt2 {
        color: #ffd800;
        font-size: 18px;
        font-family: FUTURA-MEDIUM;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .big {
          color: #ffd800;
          font-size: 24px;
          font-family: FUTURA-MEDIUM;
        }
      }
    }
  }
  .pay {
    border: #000000 solid 1px;
    width: 120px;
    height: 42px;
    font-size: 18px;
    font-weight: bold;
    font-family: FUTURA-MEDIUM;
  }
  // .empty {
  //   width: 150px;
  //   height: 50px;
  //   background: transparent;
  // }
  .pay-disable {
    background: #f2f2f2;
    border: #f2f2f2 solid 1px;
    width: 120px;
    height: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
.history-container {
  width: 284px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  .history-row {
    width: 284px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 10px;
    .history-left {
      color: #8a8b8b;
      font-size: 0.8rem;
      width: 84px;
      .history-logo {
        width: 48px;
        height: 48px;
      }
    }
    .history-right {
      max-width: 200px;
      width: 200px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      color: #000000;
      font-size: 0.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      .big {
        font-size: 1.5rem;
        color: #000000;
      }
      .desc {
        font-size: 0.8rem;
        color: #8a8b8b;
      }
    }
  }
}

.phone-history-container {
  width: 244px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px 0 0;
  .history-row {
    width: 244px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 10px;
    .history-left {
      color: #8a8b8b;
      font-size: 12px;
      width: 68px;
      .history-logo {
        width: 48px;
        height: 48px;
      }
    }
    .history-right {
      max-width: 176px;
      width: 176px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      color: #000000;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      .big {
        font-size: 24px;
        color: #000000;
      }
      .desc {
        font-size: 12px;
        color: #8a8b8b;
      }
    }
  }
}
.album-swiper {
  :deep(.swiper-slide) {
    width: 339px !important;
    height: auto !important;
    display: flex;
    justify-items: center;
    align-items: flex-start;
    &:first-child {
      margin-left: 100px;
    }
  }
}
.history-swiper {
  :deep(.swiper-slide) {
    width: 400px !important;
    height: auto !important;
    display: flex;
    justify-items: center;
    align-items: flex-start;
    &:first-child {
      margin-left: 68px;
    }
  }
}
.address-list-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 294px;
  background: #ffffff;
  padding: 12px 24px 12px 0;
  border-bottom: #aaa 1px solid;
  .hamburger-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 18px;
    color: #000;
  }
  .phone-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 14px;
    color: #666;
  }
}
</style>
