import axios from "../utils/request";

import { filterForm } from "../utils/utils";

export const doRegisterCode = (data: { phone: string }) =>
  axios({ url: `/user/doRegisterCode`, method: "post", data });
// 检查手机号是否注册过
export const checkPhone = (data: { phone: string }) =>
  axios({ url: `/user/checkPhone`, method: "post", data });
// 根据手机号验证码注册
export const registerAccount = (data: {
  code: string;
  name: string;
  phone: string;
  inviteCode?: string;
}) => axios({ url: `/user/registerAccount`, method: "post", data });
// 登陆验证码
export const doSendCode = (data: { phone: string }) =>
  axios({ url: `/user/doSendCode`, method: "post", data });
// 登陆接口
export const doLoginApi = (data: {
  code: string;
  inviteCode?: string;
  phone: string;
}) => axios({ url: `/user/doLogin`, method: "post", data });
// 充值
export const wechatPay = (data: {
  payAmount: number;
  osType: number;
  accessKey: number;
}) => axios({ url: `/wechatPay`, method: "post", data });
// 充值
export const wechatPayAuth = (data: {
  payAmount: number;
  osType: number;
  accessKey: number;
}) => axios({ url: `/wechatPayAuth`, method: "post", data });
// 订单详情
export const orderDetail = (data: { orderNo: string; accessKey: string }) =>
  axios({
    url: `/orderDetail?orderNo=${data.orderNo}&accessKey=${data.accessKey}`,
    method: "get",
  });
// 获取用户信息
export const doGetInfo = (data: { token: string; accessKey: string }) =>
  axios({
    url: `/user/doGetInfo`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
  });
export const getBillSum = (data: {
  token: string;
  accessKey: string;
  createTime: string;
}) =>
  axios({
    url: `/listBillSum`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    params: {
      accessKey: data.accessKey,
      createTime: data.createTime,
    },
  });
export const getBillDetails = (data: {
  token: string;
  accessKey: string;
  createTime: string;
  pageNo: number;
  pageSize: number;
}) =>
  axios({
    url: `/listBillDetail`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    params: {
      accessKey: data.accessKey,
      createTime: data.createTime,
      pageNo: data.pageNo,
      pageSize: data.pageSize,
    },
  });
export const queryInfo = (data: { token: string; accessKey: string }) =>
  axios({
    url: `/visitor/queryInfo`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    data: {
      accessKey: data.accessKey,
    },
  });
export const updateUserInfo = (data: {
  token: string;
  accessKey: string;
  birthday?: string;
  province?: string;
  city?: string;
  email?: string;
  dailyReminder?: number;
  sex?: number;
}) =>
  axios({
    url: `/user/doUpdateInfo`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    data: filterForm(data),
  });
export const doLogout = (data: { token: string; accessKey: string }) =>
  axios({
    url: `/user/doLogout`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      token: data.token,
    },
  });
export const getCashPage = (data: {
  token: string;
  accessKey: string;
  pageNo: number;
  pageSize: number;
}) =>
  axios({
    url: `/cashPage`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    data: {
      accessKey: data.accessKey,
      pageNo: data.pageNo,
      pageSize: data.pageSize,
    },
  });
export const getValidatyTime = (data: {
  token: string;
  accessKey: string;
  accountId: string;
}) =>
  axios({
    url: `/visitor/getValidatyTime`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    params: {
      accountId: data.accountId,
    },
  });
export const doExchangeCode = (data: {
  token: string;
  accessKey: string;
  accountId: string;
  code: string;
}) =>
  axios({
    url: `/visitor/doExchangeCode`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    data: {
      accountId: data.accountId,
      code: data.code,
    },
  });
export const getSerialNumber = (data: {
  token: string;
  accessKey: string;
  code: string;
}) =>
  axios({
    url: `/visitor/getSerialNumber`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    params: {
      code: data.code,
    },
  });

export const getAddressList = (data: {
  token: string;
  accessKey: string;
  userId: string;
}) =>
  axios({
    url: `/userAddress/mylist`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    params: {
      userId: data.accessKey,
    },
  });

export const addAddress = (data: {
  token: string;
  accessKey: string;
  dto: any;
}) =>
  axios({
    url: `/userAddress/add`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    data: {
      ...data.dto,
    },
  });

export const editAddress = (data: {
  token: string;
  accessKey: string;
  dto: any;
}) =>
  axios({
    url: `/userAddress/edit`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    data: {
      ...data.dto,
    },
  });

export const delAddress = (data: {
  token: string;
  accessKey: string;
  id: string;
}) =>
  axios({
    url: `/userAddress/remove`,
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    params: {
      ids: data.id,
    },
  });

export const sendMail = (data: {
  token: string;
  accessKey: string;
  dto: any;
}) =>
  axios({
    url: `/userAddress/sendMDLOrder`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    data: {
      ...data.dto,
    },
  });

export const getReportOrder = (data: {
  token: string;
  accessKey: string;
  orderId?: string;
}) =>
  axios({
    url: `/rpaCallback/getOrder`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
    },
    params: data.orderId
      ? {
          orderId: data.orderId,
        }
      : {
          accessKey: data.accessKey,
        },
  });
export const wechatPayMcd = (data: {
  payAmount: number;
  osType: number;
  accessKey: string;
  currency: string;
}) => axios({ url: `/wechatPay`, method: "post", data });

export const createChatResume = (data: { token: string; accessKey: string }) =>
  axios({
    url: `/resume/aCreateResume`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: data.token,
      accessKey: data.accessKey,
      "api-key": data.accessKey,
    },
  });

export const connectChatCompletions = (data: {
  token: string;
  accessKey: string;
  resumeId: string;
  messages: any;
}) =>
  // axios({
  //   url: `/resume/cCompletions`,
  //   method: "post",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: data.token,
  //     accessKey: data.accessKey,
  //     resumeId: data.resumeId,
  //   },
  //   responseType: "blob",
  //   data: {
  //     messages: data.messages,
  //   },
  // });
  fetch(
    `https://${import.meta.env.VITE_PUBLIC_URL}/` +
      (import.meta.env.VITE_PUBLIC_URL == "openai-service.mbmzone.com"
        ? "api"
        : "api-resume") +
      `/resume/cCompletions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: data.token,
        accessKey: data.accessKey,
        "api-key": data.accessKey,
        resumeId: data.resumeId,
      },
      body: JSON.stringify({
        messages: data.messages,
      }),
    }
  );

export const uploadChatCompletions = (data: {
  token: string;
  accessKey: string;
  resumeId: string;
  formData: any;
}) =>
  axios({
    url: `/resume/bUploadResume`,
    method: "post",
    headers: {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq",
      Authorization: data.token,
      accessKey: data.accessKey,
      "api-key": data.accessKey,
      resumeId: data.resumeId,
    },
    data: data.formData,
  });
// fetch(
//   `https://${import.meta.env.VITE_PUBLIC_URL}/` +
//     (import.meta.env.VITE_PUBLIC_URL == "openai-service.mbmzone.com"
//       ? "api"
//       : "api-resume") +
//     `/resume/bUploadResume`,
//   {
//     method: "POST",
//     headers: {
//       "Content-Type":
//         "multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq",
//       Authorization: data.token,
//       accessKey: data.accessKey,
//       resumeId: data.resumeId,
//     },
//     body: data.formData,
//   }
// );

export const getChatResume = (data: {
  token: string;
  accessKey: string;
  resumeId: string;
}) =>
  fetch(
    `https://${import.meta.env.VITE_PUBLIC_URL}/` +
      (import.meta.env.VITE_PUBLIC_URL == "openai-service.mbmzone.com"
        ? "api"
        : "api-resume") +
      `/resume/dGetResume`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: data.token,
        accessKey: data.accessKey,
        "api-key": data.accessKey,
        resumeId: data.resumeId,
      },
    }
  );

  export const getChatResumePosition = (data: {
    token: string;
    accessKey: string;
    resumeId: string;
  }) =>
    fetch(
      `https://${import.meta.env.VITE_PUBLIC_URL}/` +
        (import.meta.env.VITE_PUBLIC_URL == "openai-service.mbmzone.com"
          ? "api"
          : "api-resume") +
        `/resume/eGetResumPositione`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: data.token,
          accessKey: data.accessKey,
          "api-key": data.accessKey,
          resumeId: data.resumeId,
        },
      }
    );