<script setup>
import { onMounted, ref } from 'vue'
import { useChat } from '@/composables/useChat'

// 引入更多图标
import {
  Send
} from 'lucide-vue-next'

const {
  isLoading,
  init,
  sendMessage,
} = useChat()
// 输入框内容
const inputContent = ref('')

onMounted(() => {
  init() // 初始化加载历史
})

const handleSend = ()=>{
  sendMessage(inputContent.value)
  inputContent.value = ''
}
const handleKeydown = (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){
    // 这句代码阻止了默认的换行行为
    e.preventDefault()
    handleSend()
  }
}
</script>
<template>
  <div class="p-4 bg-white dark:bg-gray-950 border-t dark:border-gray-800 transition-colors duration-300">
        <div class="max-w-3xl mx-auto relative">
          <textarea
            v-model="inputContent"
            @keydown="handleKeydown"
            placeholder="输入消息... (Shift+Enter 换行)"
            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 resize-none h-14 max-h-32 shadow-inner dark:text-gray-100 dark:placeholder-gray-400 transition-colors duration-300"
          ></textarea>
          <button
            @click="handleSend"
            :disabled="isLoading || !inputContent.trim()"
            class="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send class="w-5 h-5" />
          </button>
        </div>
        <div class="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
          AI 内容由大模型生成，请仔细甄别。
        </div>
      </div>
</template>
