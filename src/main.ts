import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "animate.css";
import TextClamp from "text-clamp-for-vue3";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import Avue from "@smallwei/avue";
import "@smallwei/avue/lib/index.css";
// 2. 引入组件样式
import 'vant/lib/index.css';
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(TextClamp);
app.use(ElementPlus, { locale: zhCn });
app.use(Avue);
app.mount("#app");
