<template>
    <div>
      <div class="navbar">
        <div class="logo">
          <img src="logo.png" alt="Logo" />
          <span>MBM AI</span>
        </div>
        <div class="menu">
          <a href="#">MBM OpenAI GPT</a>
          <a href="#">MBM Bot 数字机器人</a>
          <a href="#">MBM Hotel 酒店</a>
          <a href="#">MBM Zone 环境音乐</a>
        </div>
        <div class="profile">
          <span>M</span>
        </div>
      </div>
  
      <div class="content">
        <h1>和我的 ChatGPT 聊天</h1>
        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="有什么可以帮助您的？" />
          <button @click="search">▶</button>
        </div>
        <div class="model-select">
          <label for="model">默认模型</label>
          <select v-model="selectedModel" id="model">
            <option value="gpt-01">GPT 01</option>
            <option value="gpt-02">GPT 02</option>
            <option value="gpt-03">GPT 03</option>
          </select>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: "NewPage",
    data() {
      return {
        searchQuery: "",
        selectedModel: "gpt-01"
      };
    },
    methods: {
      search() {
        console.log("Searching for:", this.searchQuery);
      }
    }
  };
  </script>
  
  <style scoped>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #1e1e1e;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  .navbar {
    width: 100%;
    background-color: #161616;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .navbar .logo {
    display: flex;
    align-items: center;
  }
  .navbar .logo img {
    height: 30px;
    margin-right: 10px;
  }
  .navbar .menu {
    display: flex;
    gap: 20px;
  }
  .navbar .menu a {
    text-decoration: none;
    color: #ffffff;
    font-weight: bold;
  }
  .navbar .profile {
    display: flex;
    align-items: center;
  }
  .navbar .profile span {
    background-color: #3a3a3a;
    border-radius: 50%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
  }
  .content {
    text-align: center;
    margin-top: 50px;
  }
  .content h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .search-box {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: 25px;
    padding: 10px 20px;
    width: 60%;
    margin: 0 auto;
  }
  .search-box input {
    border: none;
    outline: none;
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
  .search-box button {
    background-color: #000000;
    border: none;
    color: #ffffff;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
  }
  .model-select {
    margin-top: 20px;
  }
  .model-select label {
    margin-right: 10px;
  }
  .model-select select {
    padding: 5px;
    border-radius: 5px;
    border: none;
  }
  </style>
  