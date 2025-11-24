<script setup>
import { onMounted ,ref} from 'vue'
import { useChat } from '@/composables/useChat'
// 引入更多图标
import { RefreshCcw, Download, FileText, FileCode, X } from 'lucide-vue-next'
const {
  init,
  refreshCurrentSession,
  downloadChat
} = useChat()
// 弹窗，显示markdown或者pdf格式
const showMenu = ref(false)
onMounted(() => {
  init() // 初始化加载历史
})
const handleDownload = (type) => {
  showMenu.value = true
  downloadChat(type)
  showMenu.value = false
}
</script>

<template>
  <div class="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
        <div class="relative group">
           <button
            @click="refreshCurrentSession"
            class="w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all"
            title="刷新"
          >
            <RefreshCcw class="w-5 h-5" />
          </button>
          <span class="absolute right-12 top-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            刷新对话
          </span>
        </div>
        <div class="relative">
      <button
        @click="showMenu = !showMenu"
        class="w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:scale-110 transition-all"
        :class="{'text-purple-600 ring-2 ring-purple-100': showMenu}"
      >
        <X v-if="showMenu" class="w-5 h-5" />
        <Download v-else class="w-5 h-5" />
      </button>

      <div v-if="showMenu" class="absolute right-14 top-0 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-xl border border-gray-100 w-36 transition-all animate-in fade-in slide-in-from-right-2">

        <div class="text-xs text-gray-400 px-2 py-1">选择格式</div>

        <button
          @click="handleDownload('markdown')"
          class="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm text-gray-600 transition-colors text-left"
        >
          <FileCode class="w-4 h-4" />
          <span>Markdown</span>
        </button>

        <button
          @click="handleDownload('pdf')"
          class="flex items-center gap-3 px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm text-gray-600 transition-colors text-left"
        >
          <FileText class="w-4 h-4" />
          <span>PDF 文档</span>
        </button>
      </div>
    </div>
      </div>
</template>
