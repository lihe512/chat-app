<script setup>
import { onMounted } from 'vue';
import { useChat } from '@/composables/useChat';
// 引入更多图标
import {
  Download, RefreshCcw
} from 'lucide-vue-next';
const {
  init,
  clearCurrentSession,
  downloadChat
} = useChat();
onMounted(() => {
  init(); // 初始化加载历史
});
</script>

<template>
  <div class="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
        <div class="relative group">
           <button
            @click="clearCurrentSession"
            class="w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
            title="刷新"
          >
            <RefreshCcw class="w-5 h-5" />
          </button>
          <span class="absolute right-12 top-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            刷新对话
          </span>
        </div>
        <div class="relative group">
          <button
            @click="downloadChat"
            class="w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
            title="下载对话记录"
          >
            <Download class="w-5 h-5" />
          </button>
          <span class="absolute right-12 top-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            下载记录
          </span>
        </div>
      </div>
</template>
