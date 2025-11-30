<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useChat } from '@/composables/useChat'

// 引入更多图标
import {
  Send, Mic
} from 'lucide-vue-next'

const {
  isLoading,
  init,
  sendMessage,
} = useChat()
// 输入框内容
const inputContent = ref('')
const isRecording = ref(false)

onMounted(() => {
  init() // 初始化加载历史
})

const handleSend = ()=>{
  sendMessage(inputContent.value)
  inputContent.value = ''
}
const handleKeydown = (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){
    // 阻止了默认的换行行为
    e.preventDefault()
    handleSend()
  }
}

// 语音识别功能
let recognition = null
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

if (SpeechRecognition) {
  recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN' // 设置语言
  recognition.continuous = false // 不需要连续识别
  recognition.interimResults = true // 返回临时结果

  recognition.onstart = () => {
    isRecording.value = true
  }

  recognition.onend = () => {
    isRecording.value = false
  }

  recognition.onerror = (event) => {
    console.error('语音识别错误:', event.error)
    isRecording.value = false
  }

  recognition.onresult = (event) => {
    let finalTranscript = ''

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      }
    }
    // 将最终识别的文本追加到输入框
    if (finalTranscript) {
      inputContent.value += finalTranscript
    }
  }
}

const toggleVoiceRecognition = () => {
  if (!recognition) {
    alert('抱歉，您的浏览器不支持语音识别。')
    return
  }
  if (isRecording.value) {
    recognition.stop()
  } else {
    recognition.start()
  }
}

// 组件卸载时停止识别，防止内存泄漏
onUnmounted(() => {
  if (recognition && isRecording.value) {
    recognition.stop()
  }
})
</script>
<template>
  <div class="p-4 bg-white dark:bg-gray-950 border-t dark:border-gray-800 transition-colors duration-300">
        <div class="max-w-3xl mx-auto relative">
          <textarea
            v-model="inputContent"
            @keydown="handleKeydown"
            placeholder="输入消息... (Shift+Enter 换行)"
            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 resize-none h-14 max-h-32 shadow-inner dark:text-gray-100 dark:placeholder-gray-400 transition-colors duration-300"
          ></textarea>
          <button
            @click="toggleVoiceRecognition"
            class="absolute right-14 top-2 p-2 rounded-lg transition-colors"
            :class="isRecording ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'"
            title="语音输入"
          >
            <Mic class="w-5 h-5" />
          </button>
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
