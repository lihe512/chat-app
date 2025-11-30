<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useChat } from '@/composables/useChat'

// 引入更多图标
import {
  Send, Mic, Paperclip, X
} from 'lucide-vue-next'

const {
  isLoading,
  init,
  sendMessage,
} = useChat()
// 输入框内容
const inputContent = ref('')
const isRecording = ref(false)
const uploadedFiles = ref([]) // 用于存储待上传的文件预览

onMounted(() => {
  init() // 初始化加载历史
})

const handleSend = ()=>{
  // 检查是否有文本或文件
  if (inputContent.value.trim() || uploadedFiles.value.length > 0) {
    if (uploadedFiles.value.length > 0) {
      // 如果有图片，将文本和图片URL打包成一个JSON字符串
      const payload = {
        text: inputContent.value,
        imageUrl: uploadedFiles.value[0].url
      }
      sendMessage(JSON.stringify(payload));
    } else {
      // 否则，只发送纯文本
      sendMessage(inputContent.value);
    }
  }

  inputContent.value = ''
  uploadedFiles.value = [] // 清空已上传文件
  // 注意：URL.revokeObjectURL 应该在图片不再需要时调用，为简化，此处暂不处理
}
const handleKeydown = (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){
    // 阻止了默认的换行行为
    e.preventDefault()
    handleSend()
  }
}

// --- 文件上传相关 ---
const triggerFileUpload = () => {
  // 通过DOM操作触发隐藏的input
  document.getElementById('file-upload-input').click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith('image/') || uploadedFiles.value.length > 0) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const filePreview = {
      id: Date.now(),
      file: file,
      name: file.name,
      url: e.target.result, // 使用 Base64 Data URL
      progress: 0
    };
    uploadedFiles.value.push(filePreview);

    // 模拟上传进度
    const interval = setInterval(() => {
      if (filePreview.progress < 100) {
        filePreview.progress += 10;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };
  reader.readAsDataURL(file); // 读取文件为 Base64

  event.target.value = ''; // 清空文件选择，以便下次能选择同一个文件
};

const removeFile = (fileId) => {
  const fileToRemove = uploadedFiles.value.find(f => f.id === fileId)
  uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== fileId)
  console.log(fileToRemove)
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
    <div class="max-w-3xl mx-auto">
      <!-- 统一的输入框容器 -->
      <div class="flex flex-col bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-inner transition-colors duration-300 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-600">

        <!-- 文件预览胶囊区域 -->
        <div v-if="uploadedFiles.length > 0" class="p-2 flex flex-wrap gap-2">
          <div v-for="file in uploadedFiles" :key="file.id" class="relative group bg-gray-200 dark:bg-gray-700 rounded-full flex items-center gap-2 pl-2 pr-3 py-1 text-sm">
            <img :src="file.url" class="w-6 h-6 rounded-full object-cover" />
            <span class="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[120px]">{{ file.name }}</span>
            <!-- 移除按钮 -->
            <button @click="removeFile(file.id)" class="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
              <X class="w-3 h-3" />
            </button>
            <!-- 进度条覆盖层 -->
            <div class="absolute inset-0 bg-blue-500/30 rounded-full transition-all duration-100" :style="{ width: file.progress + '%' }"></div>
          </div>
        </div>

        <!-- 输入和按钮区域 -->
        <div class="flex items-start p-2">
          <!-- 隐藏的文件输入 -->
          <input type="file" id="file-upload-input" @change="handleFileChange" accept="image/*" class="hidden" />

          <button @click="triggerFileUpload" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0" title="上传图片">
            <Paperclip class="w-5 h-5" />
          </button>

          <textarea
            v-model="inputContent"
            @keydown="handleKeydown"
            placeholder="输入消息或上传图片... (Shift+Enter 换行)"
            class="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none mx-2 py-1.5 self-center max-h-32 dark:text-gray-100 dark:placeholder-gray-400"
            rows="1"
          ></textarea>

          <button
            @click="toggleVoiceRecognition"
            class="p-2 rounded-lg transition-colors flex-shrink-0"
            :class="isRecording ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'"
            title="语音输入"
          >
            <Mic class="w-5 h-5" />
          </button>
          <button
            @click="handleSend"
            :disabled="isLoading || (!inputContent.trim() && uploadedFiles.length === 0)"
            class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 ml-2"
          >
            <Send class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
        AI 内容由大模型生成，请仔细甄别。
      </div>
    </div>
  </div>
</template>
