<template>
  <div class="px-common-layout px-no-trans">
    <el-container>
      <el-header class="header">
        <img
          class="logo"
          src="https://mbm-oss1.oss-cn-shenzhen.aliyuncs.com/OpenAI/white-logo.png"
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
          <!-- <div class="avatar">{{ nickName }}</div> -->
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
        <div
          class="address"
          v-if="
            addressList.length > 0 && processStatus != 5 && processStatus != 4
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
          <img class="phone" :src="phoneImg" alt="" />
          <div style="margin-left: 30px">
            电话：{{ addressList[currentAddress].mobile }}
          </div>
        </div>
        <div
          class="address"
          v-else-if="processStatus != 5 && processStatus != 4"
        >
          <div
            style="text-decoration: underline; cursor: pointer"
            @click="dialogEditVisible = true"
          >
            填写送餐地址
          </div>
        </div>
        <div
          class="contact"
          v-if="
            addressList.length > 0 && processStatus != 5 && processStatus != 4
          "
        >
          <div class="label">联系人：</div>
          {{ addressList[currentAddress].userName }}
          <div
            v-if="processStatus == 0"
            :style="{
              'margin-left': '30px',
              cursor: submitLoading ? 'not-allowed' : 'pointer',
              'text-decoration': 'underline',
            }"
            @click="clickEdit()"
          >
            编辑地址
          </div>
        </div>
        <el-row
          class="count-container"
          v-if="processStatus == 0 && !submitLoading"
        >
          <el-col :span="6" v-for="item in counts">
            <div :class="item.num == currentCount ? 'count' : 'count-normal'">
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
        <div class="count" v-else-if="processStatus != 5 && processStatus != 4">
          <div class="txt">
            <view class="num">{{ currentCount }}</view>
            人份
          </div>
        </div>
        <div class="area" v-if="processStatus == 0">
          <el-input
            v-model="inputValue"
            :rows="5"
            type="textarea"
            placeholder="首次运行，AI 将自动为您点餐。如果您有用餐偏好，请在这里输入。"
            :disabled="submitLoading"
          />
        </div>
        <el-button
          class="button"
          color="#000000"
          @click="clickRun"
          :loading="submitLoading"
          v-if="processStatus == 0"
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
          {{ submitLoading ? "正在下单..." : "下单" }}
        </el-button>
        <el-row
          :gutter="2"
          class="process-container"
          v-if="processStatus == 1 || processStatus == 2 || processStatus == 3"
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
                  processStatus == 1 || processStatus == 2 || processStatus == 3
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
          v-if="processStatus != 0 && processStatus != 5 && processStatus != 4"
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
            addressList.length > 0 ? addressList[currentAddress].userName : ""
          }}，很高兴为您完成本次订单。
        </div>
        <div style="color: #000; font-size: 1rem" v-if="processStatus == 4">
          很抱歉！{{
            addressList.length > 0 ? addressList[currentAddress].userName : ""
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
      </el-main>
    </el-container>
    <el-dialog v-model="dialogEditVisible" title="新增送餐地址">
      <avue-form
        ref="editAddressForm"
        v-model="addressEditForm"
        :option="addressEditOption"
      >
        <template #detailInfo="{}">
          <el-autocomplete
            v-model="detailInfo"
            :fetch-suggestions="queryPoi"
            :trigger-on-focus="false"
            clearable
            popper-class="my-autocomplete"
            placeholder="请填写详细地址"
            @input="inputPoi"
            @select="handlePoi"
            fit-input-width
          >
            <template #default="{ item }">
              <div class="complete-container">
                <div class="value">{{ item.name }}</div>
                <span class="link">{{ item.address }}</span>
              </div>
            </template>
          </el-autocomplete>
        </template>
      </avue-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAddress"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogTableVisible" title="编辑送餐地址">
      <avue-crud ref="crud" :option="addressTableOption" :data="addressList">
        <template #menu-left="{}">
          <el-button type="primary" icon="el-icon-plus" @click="add()">
            新增
          </el-button>
        </template>
        <template #menu="{ size, row, index }">
          <el-button
            @click="selection(row, index)"
            icon="el-icon-check"
            text
            type="primary"
            :size="size"
          >
            选择
          </el-button>
          <el-button
            @click="edit(row)"
            icon="el-icon-edit"
            text
            type="primary"
            :size="size"
          >
            编辑
          </el-button>
          <el-button
            @click="del(row, index)"
            icon="el-icon-delete"
            text
            type="danger"
            :size="size"
          >
            删除
          </el-button>
        </template>
      </avue-crud>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import logoImg from "@/assets/images/mcd.jpg";
import hamburgerImg from "@/assets/images/mcd-hamburger.png";
import phoneImg from "@/assets/images/mcd-phone.png";
import reportHamburgerImg from "@/assets/images/report-hamburger.png";
import {
  doLogout,
  doGetInfo,
  getAddressList,
  addAddress,
  editAddress,
  delAddress,
  sendMail,
  getReportOrder,
} from "@/api/index";
import { pinyin } from "pinyin-pro";
import { useRouter } from "vue-router";
import { isPhone, isHashMode } from "@/utils/utils";
import axios from "axios";
import useClipboard from "vue-clipboard3";
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
const timeSecond = ref(0);
const submitLoading = ref(false);
const currentCount = ref(1);
const addressStatus = ref(0);
const proxy: any = getCurrentInstance()?.proxy ?? null;
const $router = useRouter();
const inputValue = ref("");
const evaluateValue = ref("");
const evaluateButton = ref(0);
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
};
type addressFormItem = {
  mobile: string;
  userName: string;
  // map: Array<number | string>;
  detailInfo: string;
  userDetailInfo: string;
  cityName: Array<string>;
  // provinceName: string;
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
const showUserInfo = ref(false);
const editAddressId = ref("");
const dialogEditVisible = ref(false);
const dialogTableVisible = ref(false);
const addressList = ref<Array<addressItem>>([]);
const currentAddress = ref(0);
const processStatus = ref(0); //进度状态，0是未点餐，1是gpt正在点餐，2是快递员正在取餐，3是快递员正在送餐，4是点餐失败，5是显示点餐报告
const validatePhone = (rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("请填写联系电话"));
  } else if (!isPhone(value)) {
    callback(new Error("请填写正确的手机号码"));
  } else {
    callback();
  }
};
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
  // orderId: "202308132024114096208",
  // accessKey: "54780beb15480c85ded51b254f3f1ba7",
  // orderStatus: 4,
  // userName: "小李子",
  // mobile: "13883986208",
  // originalPrice: 81.0,
  // originalCharge: 9.0,
  // combination:
  //   '["麦辣鸡腿堡","1份中薯条","⭐️中杯雪碧（店铺福利）","麦辣鸡腿堡","1份中薯条","⭐️中杯雪碧（店铺福利）"]',
  // combinationPrice: 37.96,
  // sendText:
  //   '{\n    "姓名": "小李子",\n    "联系电话": "13883986208",\n    "省份": "重庆市",\n    "城市": "市辖区",\n    "地址": "光华·可乐小镇C区",\n    "门牌号": "1栋3-2",\n    "就餐人数": "2",\n    "备注": "",\n    "订单号": "202308132024114096208",\n    "区": "江北区",\n    "商品链接": "【淘宝】https://m.tb.cn/h.520MODN?tk=FAGgdw0PQog CZ0001 「麦当劳 代下单 优惠I券板烧鸡腿堡小吃麦辣鸡腿堡麦旋风薯条冰淇淋」点击链接直接打开 或者 淘宝搜索直接打开",\n    "商品组合": ["麦辣鸡腿堡", "1份中薯条", "⭐️中杯雪碧（店铺福利）", "麦辣鸡腿堡", "1份中薯条", "⭐️中杯雪碧（店铺福利）"],\n    "商品组合价格": "37.96",\n    "原价": "81"\n}',
  // provinceName: "重庆市",
  // cityName: "市辖区",
  // countyName: "江北区",
  // detailInfo: "光华·可乐小镇C区",
  // userDetailInfo: "1栋3-2",
  // diningPeople: 2,
  // createTime: "2023-08-13 20:24:28",
  // paidCharge: 0,
  // useTime: "",
});
const detailInfo = ref("");
const addressEditForm = ref<addressFormItem>({
  mobile: "",
  userName: "",
  // map: [],
  userDetailInfo: "",
  detailInfo: "",
  cityName: [],
  // provinceName: "",
});
const addressEditOption = ref({
  submitBtn: false,
  emptyBtn: false,
  column: [
    {
      label: "联系人",
      prop: "userName",
      type: "input",
      rules: [
        {
          required: true,
          message: "请填写联系人",
          trigger: "blur",
        },
      ],
      span: 12,
    },
    {
      label: "联系电话",
      prop: "mobile",
      span: 12,
      rules: [
        {
          required: true,
          message: "请填写联系电话",
          trigger: "blur",
        },
        { validator: validatePhone, trigger: "blur" },
      ],
    },
    // {
    //   label: "选择位置",
    //   prop: "map",
    //   type: "map",
    //   rules: [
    //     {
    //       required: true,
    //       message: "请选择地理位置",
    //       trigger: "change",
    //     },
    //   ],
    //   span: 12,
    // },
    {
      label: "省/市",
      prop: "cityName",
      type: "cascader",
      span: 24,
      props: {
        label: "name",
        value: "name",
      },
      dicData: pca,
      rules: [
        {
          required: true,
          message: "请选择省市",
          trigger: "blur",
        },
      ],
    },
    {
      label: "详细地址",
      prop: "detailInfo",
      rules: [
        {
          required: true,
          message: "请填写详细地址",
          trigger: "blur",
        },
      ],
      span: 12,
    },
    {
      label: "门牌号",
      prop: "userDetailInfo",
      type: "input",
      span: 12,
    },
  ],
});
const addressTableOption = ref({
  viewBtn: false,
  refreshBtn: false,
  columnBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: "联系人",
      prop: "userName",
    },
    {
      label: "联系电话",
      prop: "mobile",
    },
    {
      label: "省份",
      prop: "provinceName",
    },
    {
      label: "城市",
      prop: "cityName",
    },
    {
      label: "区域",
      prop: "countyName",
    },
    {
      label: "详细地址",
      prop: "detailInfo",
    },
    {
      label: "门牌号",
      prop: "userDetailInfo",
    },
  ],
});
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
        processStatus.value = reportOrder.value.orderStatus;
        if (processStatus.value == 3 || processStatus.value == 4) {
          clearInterval(timer);
        }
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
  // startTime();
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
const getUserInfo = async (token: string, accessKey: string) => {
  const res = await doGetInfo({ token, accessKey });
  if (res.data.code === 11000) {
    userInfo.value = res.data.data;
    const firstC = getFirstChar(userInfo.value.name);
    nickName.value = firstC;
    getMyAddressList(token, accessKey);
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
    nickName.value = "";
    $router.replace({
      name: "singleLogin",
      query: {
        redirectUrl: window.location.href,
      },
    });
  }
};
const getMyAddressList = async (token: string, accessKey: string) => {
  const res = await getAddressList({
    token,
    accessKey,
    userId: accessKey,
  });
  if (res.data.code === 11000) {
    if (res.data.data.length > 0) {
      addressList.value = res.data.data;
    } else {
      dialogTableVisible.value = false;
      addressList.value = [];
      addressStatus.value = 0;
    }
  } else {
    ElMessage(res.data.msg);
  }
};
const saveAddress = () => {
  proxy?.$refs["editAddressForm"].validate((valid: boolean, done: Function) => {
    if (valid) {
      done();
      const temp = {
        cityName: addressEditForm.value.cityName[1],
        countyName: addressEditForm.value.cityName[2],
        detailInfo: addressEditForm.value.detailInfo,
        mobile: addressEditForm.value.mobile,
        provinceName: addressEditForm.value.cityName[0],
        userName: addressEditForm.value.userName,
        userDetailInfo: addressEditForm.value.userDetailInfo,
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
      // if (addressEditForm.value.map.length > 0) {
      //   parseLocation(
      //     addressEditForm.value.map[0],
      //     addressEditForm.value.map[1]
      //   ).then((res) => {
      //     if (res.status == 200 && res.data.status == "1") {
      //       if (res.data.regeocode && res.data.regeocode.addressComponent) {
      //         const temp = {
      //           cityName:
      //             typeof res.data.regeocode.addressComponent.city === "string"
      //               ? res.data.regeocode.addressComponent.city
      //               : res.data.regeocode.addressComponent.province,
      //           countyName: res.data.regeocode.addressComponent.country,
      //           detailInfo: addressEditForm.value.map[2],
      //           mobile: addressEditForm.value.mobile,
      //           provinceName: res.data.regeocode.addressComponent.province,
      //           userName: addressEditForm.value.userName,
      //           userDetailInfo: addressEditForm.value.userDetailInfo,
      //         };
      //         let usr = localStorage.getItem("userInfo");
      //         if (usr) {
      //           const info = JSON.parse(usr);
      //           if (addressStatus.value == 0 || addressStatus.value == 1) {
      //             addAddressItem(info.token, info.accessKey, temp);
      //           } else {
      //             editAddressItem(
      //               info.token,
      //               info.accessKey,
      //               Object.assign({}, temp, {
      //                 id: editAddressId.value,
      //               })
      //             );
      //           }
      //         }
      //       }
      //     }
      //   });
      // }
    } else {
      return false;
    }
  });
};
const addAddressItem = async (token: string, accessKey: string, dto: any) => {
  const response = await addAddress({
    token,
    accessKey,
    dto,
  });
  if (response.data.code === 11000) {
    ElMessage({ message: "添加成功", type: "success" });
    dialogEditVisible.value = false;
    getMyAddressList(token, accessKey);
    if (addressStatus.value == 1) {
      dialogTableVisible.value = true;
    }
  } else {
    ElMessage(response.data.msg);
  }
};
const editAddressItem = async (token: string, accessKey: string, dto: any) => {
  const response = await editAddress({
    token,
    accessKey,
    dto,
  });
  if (response.data.code === 11000) {
    ElMessage({ message: "更新成功", type: "success" });
    dialogEditVisible.value = false;
    getMyAddressList(token, accessKey);
    dialogTableVisible.value = true;
  } else {
    ElMessage(response.data.msg);
  }
};
const parseLocation = (lat: number | string, lng: number | string) => {
  return service.get(
    `https://restapi.amap.com/v3/geocode/regeo?location=${lat},${lng}&key=a9e09a5e99b12541c4f59b218379f78a&radius=1000&extensions=all`
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
    addressEditForm.value.cityName &&
    addressEditForm.value.cityName.length > 0
  ) {
    return service.get(
      `https://restapi.amap.com/v5/place/text?key=a9e09a5e99b12541c4f59b218379f78a&region=${addressEditForm.value.cityName[1]}&keywords=${detailInfo}`
    );
  }
  return service.get(
    `https://restapi.amap.com/v5/place/text?key=a9e09a5e99b12541c4f59b218379f78a&keywords=${detailInfo}`
  );
};
const add = () => {
  addressStatus.value = 1;
  dialogEditVisible.value = true;
  dialogTableVisible.value = false;
  addressEditForm.value = {
    mobile: "",
    userName: "",
    // map: [],
    detailInfo: "",
    // provinceName: "",
    cityName: [],
    userDetailInfo: "",
  };
  detailInfo.value = "";
};
const edit = (row: addressItem) => {
  addressStatus.value = 2;
  // parseAddress(row.detailInfo).then((res) => {
  //   if (res.status == 200 && res.data.status == "1") {
  //     if (res.data.geocodes && res.data.geocodes.length > 0) {
  //       let location = res.data.geocodes[0].location;
  //       if (location) {
  //         location = location.split(",");
  //         addressEditForm.value = {
  //           mobile: row.mobile,
  //           userName: row.userName,
  //           map: [location[0], location[1], row.detailInfo],
  //           userDetailInfo: row.userDetailInfo,
  //         };
  //         dialogTableVisible.value = false;
  //         dialogEditVisible.value = true;
  //         editAddressId.value = row.id;
  //       }
  //     }
  //   }
  // });
  addressEditForm.value = {
    mobile: row.mobile,
    userName: row.userName,
    detailInfo: row.detailInfo,
    userDetailInfo: row.userDetailInfo,
    // provinceName: row.provinceName,
    cityName: [row.provinceName, row.cityName, row.countyName],
  };
  detailInfo.value = row.detailInfo;
  dialogTableVisible.value = false;
  dialogEditVisible.value = true;
  editAddressId.value = row.id;
};
const selection = (row: addressItem, index: number) => {
  currentAddress.value = index;
  dialogTableVisible.value = false;
};
const del = (row: addressItem, index: number) => {
  ElMessageBox.confirm("是否删除该送餐地址？", "提示").then(() => {
    let usr = localStorage.getItem("userInfo");
    if (usr) {
      const info = JSON.parse(usr);
      delAddressItem(info.token, info.accessKey, row.id).then((res) => {
        if (res.data.code === 11000) {
          if (currentAddress.value == index) {
            currentAddress.value = 0;
          } else if (currentAddress.value > index) {
            currentAddress.value--;
          }
          getMyAddressList(info.token, info.accessKey);
          ElMessage({ message: "删除成功", type: "success" });
        } else {
          ElMessage(res.data.msg);
        }
      });
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
const clickEdit = () => {
  if (submitLoading.value) {
    return;
  }
  addressStatus.value = 0;
  dialogTableVisible.value = true;
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
    ElMessage({ message: "请先填写一个送餐地址", type: "error" });
    return;
  }
  ElMessageBox.confirm("是否确认下单？", "提示").then(() => {
    ElMessage({ message: "正在下单处理中...", type: "success" });
    submitLoading.value = true;
    let usr = localStorage.getItem("userInfo");
    if (usr) {
      confirmForm(usr);
    }
  });
};
const confirmForm = async (usr: string) => {
  const info = JSON.parse(usr);
  const res = await sendMail({
    token: info.token,
    accessKey: info.accessKey,
    dto: {
      diningPeople: currentCount.value,
      remarks: inputValue.value,
      userAddressId: addressList.value[currentAddress.value].id,
    },
  });
  submitLoading.value = false;
  if (res.data.code === 11000) {
    ElMessage({ message: "下单成功！", type: "success" });
    reportOrder.value = res.data.data;
    startTime();
  } else {
    ElMessage({ message: "下单失败，请重试", type: "error" });
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
    showUserInfo.value = false;
    goHome();
  });
};
const clickEvaluate = (num: number) => {
  if (evaluateButton.value === 0) {
    evaluateButton.value = num;
    ElMessage({ message: "感谢您的评价！祝您生活愉快", type: "success" });
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
const inputPoi = (item: string) => {
  addressEditForm.value.detailInfo = item;
};
const handlePoi = (item: any) => {
  if (item && item.name) {
    addressEditForm.value.detailInfo = item.name;
    detailInfo.value = item.name;
  }
};
</script>
<style lang="scss" scoped>
.px-common-layout {
  background: #f6f9fc;
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100vw;
    background: #ffffff;
    padding: 0 20px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    .logo {
      width: 140px;
      min-width: 140px;
      cursor: pointer;
    }
    .center-logo {
      height: 80px;
    }
    .header-right {
      width: 140px;
      min-width: 140px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .avatar {
        width: 48px;
        height: 48px;
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
    }
  }
  .main {
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .big {
      color: #000;
      font-size: 4rem;
      font-family: Gotham-Rounded;
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
    }
    .contact {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 1.5rem;
      margin-top: 10px;
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
      width: 40vw;
      margin-top: 20px;
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
</style>
