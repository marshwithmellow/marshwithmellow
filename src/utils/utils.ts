// clone对象
export const cloneObj = (obj: any) => {
  if (typeof obj !== "object") return;
  return JSON.parse(JSON.stringify(obj));
};
// 时间字符串转 时间戳
export const dateToStamp = (dateStr: string) => {
  let date = "";
  date = dateStr.substring(0, 19);
  date = dateStr.replace(/-/g, "/");
  return new Date(date).getTime();
};

// 距离目的 时间戳 的时间倒计时
export const countdown = (dateStr: string, fun: Function) => {
  let date = "";
  let resultDate = {
    day: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    milliseconds: "00",
  };
  date = dateStr.substring(0, 19);
  date = dateStr.replace(/-/g, "/");
  let timer = setInterval(() => {
    let aimDate =
      new Date(new Date().toLocaleDateString()).getTime() + 86400000;
    let nowDate = new Date().getTime();
    if (nowDate >= aimDate) {
      alert("时间已过");
      clearInterval(timer);
    } else {
      let resultStamp = aimDate - nowDate;
      resultDate.day =
        Math.floor(resultStamp / (1000 * 60 * 60 * 24)) + "" || "00";
      resultDate.hours =
        Math.floor((resultStamp / (1000 * 60 * 60)) % 24) + "" || "00";
      resultDate.minutes =
        Math.floor((resultStamp / (1000 * 60)) % 60) + "" || "00";
      resultDate.seconds = Math.floor((resultStamp / 1000) % 60) + "" || "00";
      resultDate.milliseconds = Math.floor(resultStamp % 1000) + "" || "00";
    }
    fun(resultDate);
    return resultDate;
  }, 1000);
};
// 今天剩余时间的比率
export const countRate = (dateStr: string, fun: Function) => {
  let date = "";
  let resultDate = {
    day: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    milliseconds: "00",
  };
  date = dateStr.substring(0, 19);
  date = dateStr.replace(/-/g, "/");
  let timer = setInterval(() => {
    let aimDate =
      new Date(new Date().toLocaleDateString()).getTime() + 86400000;
    let nowDate = new Date().getTime();
    if (nowDate >= aimDate) {
      alert("时间已过");
      clearInterval(timer);
    } else {
      let resultStamp = aimDate - nowDate;
      resultDate.day =
        Math.floor(resultStamp / (1000 * 60 * 60 * 24)) + "" || "00";
      resultDate.hours =
        Math.floor((resultStamp / (1000 * 60 * 60)) % 24) + "" || "00";
      resultDate.minutes =
        Math.floor((resultStamp / (1000 * 60)) % 60) + "" || "00";
      resultDate.seconds = Math.floor((resultStamp / 1000) % 60) + "" || "00";
      resultDate.milliseconds = Math.floor(resultStamp % 1000) + "" || "00";
    }
    fun(resultDate);
    return resultDate;
  }, 1000);
};

// 时刻表
// export const digitalClock = (mark = "-", fun: Function) => {
//   const timer = setInterval(() => {
//     const d = new Date();
//     const year = d.getFullYear();
//     let month = d.getMonth() + 1;
//     month = month < 10 ? `0${month}` : month;
//     let date = d.getDate();
//     date = date < 10 ? `0${date}` : date;
//     let hour = d.getHours();
//     hour = hour < 10 ? `0${hour}` : hour;
//     let min = d.getMinutes();
//     min = min < 10 ? `0${min}` : min;
//     let second = d.getSeconds();
//     second = second < 10 ? `0${second}` : second;
//     const dateStr = `${year}${mark}${month}${mark}${date} ${hour}:${min}:${second}`;
//     fun(dateStr);
//   }, 1000);
// };

export const isWeiXinBrowser = () => {
  // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  let ua = window.navigator.userAgent.toLowerCase();
  // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
  // if (ua.match(/MicroMessenger/i) == "micromessenger") {
  //   return true;
  // } else {
  //   return false;
  // }
  return ua.indexOf("micromessenger") != -1;
};

/**
 * 节流
	节流原理：在一定时间内，只能触发一次
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
var timesr: any = NaN,
  throttleFlag: boolean;
export function throttle(func: Function, wait = 500, immediate = true) {
  if (immediate) {
    if (!throttleFlag) {
      throttleFlag = true;
      // 如果是立即执行，则在wait毫秒内开始时执行
      typeof func === "function" && func();
      timesr = setTimeout(() => {
        throttleFlag = false;
      }, wait);
    }
  } else {
    if (!throttleFlag) {
      throttleFlag = true;
      // 如果是非立即执行，则在wait毫秒内的结束处执行
      timesr = setTimeout(() => {
        throttleFlag = false;
        typeof func === "function" && func();
      }, wait);
    }
  }
}

/**
 * rdix 随机因子,
 * length 取的长度.
 */
export function getUid(rdix = 1, length = 12, isAddStr = false) {
  return Math.floor(
    Math.random() * rdix * Math.floor(Math.random() * Date.now())
  )
    .toString(isAddStr ? 16 : 10)
    .substring(0, length);
}
/*
防抖
防抖原理：在一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
	@param {Function} func 要执行的回调函数
	@param {Number} wait 延迟的时间
	@param{Boolean} immediate 是否要立即执行
*/
var timeout: any = getUid(1);
export function debounce(func: Function, wait = 500, immediate = false) {
  // 清除定时器
  if (timeout !== null) clearTimeout(timeout);
  // 立即执行，此类情况一般用不到
  if (immediate) {
    var callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow) typeof func === "function" && func();
  } else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
    timeout = getUid(1);
    timeout = setTimeout(() => {
      typeof func === "function" && func();
    }, wait);
  }
}

//空值过滤器
export const filterForm = (form: any) => {
  let obj: any = {};
  Object.keys(form).forEach((ele) => {
    if (!validatenull(form[ele])) {
      obj[ele] = form[ele];
    }
  });
  return obj;
};

/**
 * 判断是否为空
 */

export const validatenull = (val: any) => {
  if (typeof val === "boolean") {
    return false;
  }
  if (typeof val === "number") {
    return false;
  }
  if (val instanceof Array) {
    if (val.length == 0) return true;
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === "{}") return true;
  } else {
    if (
      val == "null" ||
      val == null ||
      val == "undefined" ||
      val == undefined ||
      val == ""
    )
      return true;
    return false;
  }
  return false;
};

/**
 * 是否邮箱
 * @param s 字符串
 * @returns Boolean
 */
export function isEmail(s: string) {
  let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  return !!s.match(reg);
}

/**
 * 路由模式判断
 * @param base 路由路径
 * @returns 返回判断
 */
export function isHashMode(base: string) {
  return base.indexOf("#") > -1;
}

/**
 * 向地址连接追加参数。
 * @param {string} uri 网址
 * @param {string} key 字段
 * @param {string} value 字段值
 * @returns
 */
export function httpUrlAddKey(uri: string, key: string, value: string) {
  if (!value) {
    return uri;
  }
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return uri + separator + key + "=" + value;
  }
}

/**
 * 是否是手机号码
 * @param phone 号码
 * @returns Boolean
 */
export function isPhone(phone: string | number) {
  let val = String(phone);
  let reg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return !!val.match(reg);
}
