import axios from "axios";

// 创建axios实例
const service = axios.create({
  // baseURL: "https://openai.yingjin.pro/api",
  // baseURL: "https://openai-service.mbmzone.com/api",
  baseURL: "https://musicgpt.mbmzone.com/api",
  headers: { "Content-Type": "application/json" },
  timeout: 5000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // config.data = qs.stringify(config.data)
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
