<script setup>
import { onMounted } from 'vue'
import { useChat } from '@/composables/useChat'
import { useGlobalControl } from '@/composables/globalControl'
// 引入更多图标
import {
 PanelLeftClose, PanelLeftOpen,Sun, Moon
} from 'lucide-vue-next'
const {
  init,
} = useChat()
const { isSidebarOpen,isDarkMode,initTheme ,toggleTheme} = useGlobalControl()
onMounted(() => {
  init()  // 初始化加载历史
  initTheme()
})
</script>
<template>
  <header class="bg-white dark:bg-gray-950 border-b dark:border-gray-800 h-14 flex items-center justify-between px-4 shadow-sm z-10 transition-colors duration-300">
        <div class="flex items-center gap-3">
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 transition-colors"
            title="切换侧边栏"
          >
            <PanelLeftClose v-if="isSidebarOpen" class="w-5 h-5" />
            <PanelLeftOpen v-else class="w-5 h-5" />
          </button>
          <h1 class="font-bold text-gray-700 dark:text-gray-100 text-lg transition-colors">AI 助手</h1>
        </div>
        <button @click="toggleTheme" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-yellow-400 transition-colors" :title="isDarkMode ? '切换到日间模式' : '切换到夜间模式'">
        <Sun v-if="isDarkMode" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
    </button>
      </header>
</template>
