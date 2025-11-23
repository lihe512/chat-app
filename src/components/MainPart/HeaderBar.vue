<script setup>
import { onMounted } from 'vue';
import { useChat } from '@/composables/useChat';
// 引入更多图标
import {
 PanelLeftClose, PanelLeftOpen
} from 'lucide-vue-next';
const {
  init,
  isSidebarOpen
} = useChat();
// const isSidebarOpen = ref(true); // 控制侧边栏折叠
onMounted(() => {
  init(); // 初始化加载历史
});
</script>
<template>
  <header class="bg-white border-b h-14 flex items-center justify-between px-4 shadow-sm z-10">
        <div class="flex items-center gap-3">
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="p-2 hover:bg-gray-100 rounded-md text-gray-600"
            title="切换侧边栏"
          >
            <PanelLeftClose v-if="isSidebarOpen" class="w-5 h-5" />
            <PanelLeftOpen v-else class="w-5 h-5" />
          </button>
          <h1 class="font-bold text-gray-700 text-lg">AI 助手</h1>
        </div>
      </header>
</template>
