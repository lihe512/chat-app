<script setup>
import { onMounted } from 'vue';
import { useChat } from '@/composables/useChat';
import ChatSidebar from './components/Main/ChatSidebar.vue';
import ChatInput from './components/Main/ChatInput.vue';
import FloatingButton from './components/Main/FloatingButton.vue';
import HeaderBar from './components/Main/HeaderBar.vue';
import ChatBox from './components/Main/ChatBox.vue';

// 引入更多图标
import { 
} from 'lucide-vue-next';
const { 
  init
} = useChat();
onMounted(() => {
  init(); // 初始化加载历史
});
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