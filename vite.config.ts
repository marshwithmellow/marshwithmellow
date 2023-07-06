import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  //参数mode为开放模式或生产模式
  // 获取.env文件里定义的环境变量
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: env.VITE_PUBLIC_BASE || "/",
    build: {
      chunkSizeWarningLimit: 1500, //build chunk Maximum
    },
    plugins: [vue()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: {
      host: "0.0.0.0",
    },
  });
};
