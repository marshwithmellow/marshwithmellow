<template>
  <div class="mbm-page">
    <div class="top-background">
      <img :src="topRoundImg" alt="background" />
    </div>

    <nav class="nav-bar">
      <div class="nav-left">
        <img class="logo" :src="logoImg" alt="MBM AI" />
      </div>
      <div class="nav-center">
        <a href="#" class="nav-item active">
          <div class="nav-text">
            <div class="mbm">MBM</div>
            <div class="sub-text">OpenAI GPT</div>
          </div>
        </a>
        <a href="#" class="nav-item">
          <div class="nav-text">
            <div class="mbm">MBM</div>
            <div class="sub-text">Bot 数字机器人</div>
          </div>
        </a>
        <a href="#" class="nav-item">
          <div class="nav-text">
            <div class="mbm">MBM</div>
            <div class="sub-text">Hotel 酒店</div>
          </div>
        </a>
        <a href="#" class="nav-item">
          <div class="nav-text">
            <div class="mbm">MBM</div>
            <div class="sub-text">Zone 环境音乐</div>
          </div>
        </a>
      </div>
      <div class="nav-right">
        <div class="avatar">M</div>
      </div>
    </nav>

    <main class="main-content">
      <div class="chat-container">
        <div class="chat-main" style="margin-top: 13vh;">
          <h2 class="title">和我的 ChatGPT 聊天</h2>
          
          <div class="search-wrapper">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="search-input" 
            />
            <div class="button-wrapper">
              <SearchButton @click="handleSearch" />
            </div>
          </div>
        </div>
        
        <div class="model-select-wrapper">
          <div class="model-name active">默认模型</div>
          <el-select
            v-model="selectedModel"
            :fit-input-width="false"
            popper-class="select-down"
            :popper-append-to-body="false"
            :teleported="false"
            placement="bottom-start"
            class="ai-select"
            size="small"
          >
            <el-option
              v-for="item in modelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              class="options"
            />
          </el-select>
        </div>
      </div>
    </main>

    <section class="introduction-section">
      <h2 class="section-title">介绍 ChatGPT</h2>
      <CardSlider />
    </section>

    <section class="robotics-world">
      <h2 class="section-title">构建数字机器人的世界</h2>
      <CardSlider />
    </section>

    <footer class="footer">
      <div class="footer-content">
        <h2 class="footer-title">生成企业级 GPT API Key</h2>
        <p class="footer-description">
          我们为您提供了企业级 API 开发接口并集成了内容管理服务，支持您的 AI 应用在全球范围内合规使用。
        </p>
        <div class="footer-cards">
          <div class="footer-card">
            <h3>个人</h3>
            <p>¥698</p>
            <p>包含 Realtime API 最新模型</p>
            <button>立即开通</button>
          </div>
          <div class="footer-card">
            <h3>团队</h3>
            <p>¥1298</p>
            <p>体验 GPT o1, o1-mini 模型</p>
            <button>立即开通</button>
          </div>
          <div class="footer-card">
            <h3>企</h3>
            <p>¥6000</p>
            <p>包含 Realtime API 最新模型</p>
            <button>立即开通</button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
// 新图片导入
import topRoundImg from '@/assets/images/top-round2.png'
import logoImg from '@/assets/images/mbmailogo.png'

// 导入字体样式
import '@/assets/styles/fonts.scss'

const searchQuery = ref('')
const currentPlaceholderIndex = ref(0)

// 占位符文本数组和动画状态
const placeholders = [
  "有什么可以帮助您的？",
  "帮我写一个Python脚本", 
  "解释一下量子计算",
  "如何制作意大利面？",
  "帮我分析这段代码",
  "写一封商务邮件",
  "制定一个健身计划",
  "翻译这段文字",
  "讲解机器学习算法",
  "帮我写一篇文章"
]

// 计算滚动样式
const scrollStyle = computed(() => ({
  transform: `translateY(-${currentPlaceholderIndex.value * 30}px)`
}))

// 当前显示的占位符
const currentPlaceholder = computed(() => placeholders[currentPlaceholderIndex.value])

// 自动切换占位符
let placeholderInterval: number

onMounted(() => {
  placeholderInterval = setInterval(() => {
    currentPlaceholderIndex.value = 
      (currentPlaceholderIndex.value + 1) % placeholders.length
  }, 3000)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索查询:', searchQuery.value)
    // 实现搜索逻辑
  }
}

// 清理定时器
onUnmounted(() => {
  if (placeholderInterval) {
    clearInterval(placeholderInterval)
  }
})

const selectedModel = ref('GPT o1')
const modelOptions = [
  { label: 'GPT o1', value: 'GPT o1' },
  { label: 'GPT o1-mini', value: 'GPT o1-mini' },
  { label: 'GPT 4o', value: 'GPT 4o' },
  { label: 'GPT 4o mini', value: 'GPT 4o mini' }
]
import CardSlider from '@/components/CardSlider.vue'
import SearchButton from '@/components/SearchButton.vue'
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "GothamRoundedBold";
  src: url("@/assets/fonts/GothamRoundedBold.otf") format("opentype");
  font-weight: normal;
  font-style: normal;
}

.mbm-page {
  min-height: 100vh;
  background-color: #212223;
  color: #fff;
  position: relative;
}

.top-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.nav-bar {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  background: transparent;
  width: 100%;

  .nav-left {
    margin-left: 7.5%;
    .logo {
      height: 30px;
      width: auto;
    }
  }

  .nav-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 35px;
    justify-content: center;
    align-items: center;
    width: auto;

    .nav-item {
      text-decoration: none;
      width: 100px;
      display: flex;
      justify-content: center;
      
      .nav-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-family: "GothamRoundedMedium", sans-serif !important;
        font-weight: normal;
        font-size: 12px;
        line-height: 14px;
        text-align: left;
        
        .mbm {
          margin-bottom: 1px;
          font-family: "GothamRoundedMedium", sans-serif !important;
          letter-spacing: 0.5px;
        }

        .sub-text {
          line-height: 13px;
          font-family: "GothamRoundedMedium", sans-serif !important;
          letter-spacing: 0.3px;
        }
      }

      &.active {
        color: #FFFFFF;
      }

      &:not(.active) {
        color: rgba(255, 255, 255, 0.5);
        &:hover {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }

  .nav-right {
    position: absolute;
    left: 85.7%;
    top: 50%;
    transform: translateY(-65%);
    .avatar {
      width: 36px;
      height: 36px;
      background: #818DA3;
      box-shadow: 3px 6px 9px 1px rgba(0,0,0,0.16);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #FFFFFF;
      font-family: "GothamRoundedBold", sans-serif !important;
      font-size: 14px;
    }
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20vh;
}

.chat-container {
  background-color: rgba(22, 23, 24, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  width: 96vw;
  height: 80vh;
  position: absolute;
  top: 3vh;
  left: 50%;
  transform: translateX(-50%);
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-main {
  margin-top: 10vh;
  text-align: center;
  
  .title {
    font-size: 36px;
    margin-bottom: 48px;
    font-weight: 600;
    color: #fff;
  }
}

.search-wrapper {
  position: relative;
  width: 600px;
  
  .search-input {
    width: 100%;
    height: 56px;
    padding: 0 60px 0 24px;
    border: none;
    border-radius: 28px;
    outline: none;
    background: #fff;
    font-size: 16px;
    color: #000;
    caret-color: #000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .button-wrapper {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.model-select-wrapper {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;

  .model-name {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    font-family: "GothamRoundedMedium", sans-serif;
  }
}

:deep(.ai-select) {
  .el-input {
    width: 160px;
    
    .el-input__wrapper {
      background: transparent;
      border: 1px dashed rgba(255, 255, 255, 0.3) !important;
      border-radius: 6px;
      box-shadow: none !important;
      height: 32px;
    }
    
    .el-input__inner {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-family: "GothamRoundedMedium", sans-serif;
      padding-left: 12px !important;
    }

    .el-input__suffix {
      right: 8px !important;
    }
  }
}

.select-down {
  background: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(10px);
  border-radius: 6px !important;
  
  .el-select-dropdown__item {
    color: rgba(255, 255, 255, 0.8) !important;
    font-family: "GothamRoundedMedium", sans-serif;
    padding: 8px 12px;
    
    &:hover, &.selected {
      background: rgba(255, 255, 255, 0.1) !important;
    }
  }
}

:deep(.el-select-dropdown.el-popper),
:deep(.el-popper),
:deep(.el-select__popper) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;

  .el-popper__arrow {
    display: none !important;
  }
}

.indicators {
  position: absolute;
  bottom: 6.8vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 12px;
  z-index: 3;

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    cursor: pointer;
    transition: background 0.3s;

    &.active {
      background: #fff;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.footer {
  background-color: #161718;
  padding: 40px 20px;
  color: #fff;
  text-align: center;
  margin-top: 40px;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .footer-description {
    font-size: 16px;
    margin-bottom: 40px;
  }

  .footer-cards {
    display: flex;
    justify-content: center;
    gap: 20px;

    .footer-card {
      background-color: #212223;
      padding: 20px;
      border-radius: 12px;
      width: 200px;
      text-align: center;

      h3 {
        font-size: 18px;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        margin-bottom: 10px;
      }

      button {
        background-color: #4383ea;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background-color: #356bbd;
        }
      }
    }
  }
}

.section-title {
  font-size: 24px;
  margin: 40px 0;
}

.robotics-world {
  width: 100%;
  padding: 0 20px;
}

.introduction-section {
  margin-top: 100vh;  // 确保在第二屏
  padding: 0 9.5%;  // 左右留白
}

.chat-container {
  display: flex;
  flex-direction: column;
}

.chat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@keyframes placeholderFade {
  0%, 100% {
    opacity: 0;
    transform: translateY(10px);
  }
  20%, 80% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style> 