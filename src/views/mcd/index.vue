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
          <img class="center-logo" :src="logoImg" alt="" />
        </div>
        <div class="header-right">
          <div class="avatar">{{ nickName }}</div>
        </div>
      </el-header>
      <el-main class="main">
        <div class="big">麦当劳外卖</div>
        <div class="address" v-if="addressList.length > 0">
          <img class="hamburger" :src="hamburgerImg" alt="" />
          <div style="margin: 0 30px">
            送至：{{
              addressList[currentAddress].detailInfo +
              (addressList[currentAddress].userDetailInfo
                ? " " + addressList[currentAddress].userDetailInfo
                : "")
            }}
          </div>
          <img class="phone" :src="phoneImg" alt="" />
          <div style="margin-left: 30px">
            {{ addressList[currentAddress].mobile }}
          </div>
        </div>
        <div class="address" v-else>
          <div
            style="text-decoration: underline; cursor: pointer"
            @click="dialogEditVisible = true"
          >
            填写送餐地址
          </div>
        </div>
        <div class="contact" v-if="addressList.length > 0">
          <div class="label">联系人：</div>
          {{ addressList[currentAddress].userName }}
          <div
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
        <el-dropdown :disabled="submitLoading">
          <div class="count">
            <span class="num">{{ currentCount }}</span>
            人份
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in counts"
                :key="item.num"
                @click="changeCount(item)"
              >
                {{ item.text }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="area">
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
      </el-main>
    </el-container>
    <el-dialog v-model="dialogEditVisible" title="新增送餐地址">
      <avue-form
        ref="editAddressForm"
        v-model="addressEditForm"
        :option="addressEditOption"
      ></avue-form>
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
import { ElMessage, ElMessageBox } from "element-plus";
import logoImg from "@/assets/images/mcd.jpg";
import hamburgerImg from "@/assets/images/mcd-hamburger.png";
import phoneImg from "@/assets/images/mcd-phone.png";
import {
  doLogout,
  doGetInfo,
  getAddressList,
  addAddress,
  editAddress,
  delAddress,
  sendMail,
} from "@/api/index";
import { pinyin } from "pinyin-pro";
import { useRouter } from "vue-router";
import { isPhone } from "@/utils/utils";
import axios from "axios";
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
for (let index = 0; index < 10; index++) {
  const temp = index + 1;
  counts.value.push({
    num: temp,
    text: temp + "人份",
  });
}
const submitLoading = ref(false);
const currentCount = ref(1);
const addressStatus = ref(0);
const proxy: any = getCurrentInstance()?.proxy ?? null;
const $router = useRouter();
const inputValue = ref("");
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
  map: Array<number | string>;
  userDetailInfo: string;
};
const editAddressId = ref("");
const dialogEditVisible = ref(false);
const dialogTableVisible = ref(false);
const addressList = ref<Array<addressItem>>([]);
const currentAddress = ref(0);
const validatePhone = (rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback(new Error("请填写联系电话"));
  } else if (!isPhone(value)) {
    callback(new Error("请填写正确的手机号码"));
  } else {
    callback();
  }
};
const addressEditForm = ref<addressFormItem>({
  mobile: "",
  userName: "",
  map: [],
  userDetailInfo: "",
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
      rules: [{ validator: validatePhone, trigger: "blur" }],
    },
    {
      label: "选择位置",
      prop: "map",
      type: "map",
      rules: [
        {
          required: true,
          message: "请选择地理位置",
          trigger: "change",
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
      if (addressEditForm.value.map.length > 0) {
        parseLocation(
          addressEditForm.value.map[0],
          addressEditForm.value.map[1]
        ).then((res) => {
          if (res.status == 200 && res.data.status == "1") {
            if (res.data.regeocode && res.data.regeocode.addressComponent) {
              const temp = {
                cityName:
                  typeof res.data.regeocode.addressComponent.city === "string"
                    ? res.data.regeocode.addressComponent.city
                    : res.data.regeocode.addressComponent.province,
                countyName: res.data.regeocode.addressComponent.country,
                detailInfo: addressEditForm.value.map[2],
                mobile: addressEditForm.value.mobile,
                provinceName: res.data.regeocode.addressComponent.province,
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
            }
          }
        });
      }
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
const add = () => {
  addressStatus.value = 1;
  dialogEditVisible.value = true;
  dialogTableVisible.value = false;
  addressEditForm.value = {
    mobile: "",
    userName: "",
    map: [],
    userDetailInfo: "",
  };
};
const edit = (row: addressItem) => {
  addressStatus.value = 2;
  parseAddress(row.detailInfo).then((res) => {
    if (res.status == 200 && res.data.status == "1") {
      if (res.data.geocodes && res.data.geocodes.length > 0) {
        let location = res.data.geocodes[0].location;
        if (location) {
          location = location.split(",");
          addressEditForm.value = {
            mobile: row.mobile,
            userName: row.userName,
            map: [location[0], location[1], row.detailInfo],
            userDetailInfo: row.userDetailInfo,
          };
          dialogTableVisible.value = false;
          dialogEditVisible.value = true;
          editAddressId.value = row.id;
        }
      }
    }
  });
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
  } else {
    ElMessage({ message: "下单失败，请重试", type: "error" });
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
    .count {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
      color: #000;
      font-size: 1rem;
      line-height: 2rem;
      margin-top: 10px;
      .num {
        font-size: 3rem;
        line-height: 3rem;
      }
    }
    .area {
      width: 50vw;
      margin-top: 20px;
    }
    .button {
      margin-top: 30px;
      width: 140px;
      border-radius: 12px;
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
</style>
