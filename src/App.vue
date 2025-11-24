<script setup>
import { onMounted } from 'vue'
import { useChat } from '@/composables/useChat'
import ChatSidebar from './components/MainPart/ChatSidebar.vue'
import ChatInput from './components/MainPart/ChatInput.vue'
import FloatingButton from './components/MainPart/FloatingButton.vue'
import HeaderBar from './components/MainPart/HeaderBar.vue'
import ChatBox from './components/MainPart/ChatBox.vue'

// 引入更多图标
import {
} from 'lucide-vue-next'
const {
  init
} = useChat()
onMounted(() => {
  init()  // 初始化加载历史
}) 
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden relative">
    <ChatSidebar></ChatSidebar>
    <main class="flex-1 flex flex-col h-full relative w-full transition-all duration-300">
      <HeaderBar></HeaderBar>
      <ChatBox></ChatBox>
      <ChatInput></ChatInput>
      <FloatingButton></FloatingButton>
    </main>
  </div>
</template>
