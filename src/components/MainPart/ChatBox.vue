<script setup>
import { onMounted,ref } from 'vue'
import { useChat } from '@/composables/useChat'
import ChatCard from '@/components/MessageStyle/ChatCard.vue'
import MarkdownRenderer from '@/components/MessageStyle/MarkdownRenderer.vue'
// 引入更多图标
import {
  Loader2, User, Bot,Copy,Check,RotateCcw
} from 'lucide-vue-next'
const {
  messages,
  init,
  regenerateMessage
} = useChat()
onMounted(() => {
  init()// 初始化加载历史
})
// 记录复制的消息ID
const copiedMsgId = ref(null)
const handleCopy = (msg)=>{
  try{
    navigator.clipboard.writeText(msg.content)
    copiedMsgId.value = msg.id
    setTimeout(()=>{
      copiedMsgId.value = null
    },2000)
  }catch(error){
    console.error("复制失败",error)
  }
}
</script>

<template>
   <div id="chat-container" class="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div class="max-w-3xl mx-auto space-y-6 pb-4" id="chat-export-content">
          <div v-if="messages.length === 0" class="text-center mt-20 text-gray-400">
            <Bot class="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>你好！我是 AI 助手，请问有什么可以帮你的？</p>
          </div>
          <div v-for="msg in messages" :key="msg.id" class="flex gap-4 group" :class="{'flex-row-reverse': msg.role === 'user'}">
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                 :class="msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'">
               <User v-if="msg.role === 'user'" class="text-white w-5 h-5" />
               <Bot v-else class="text-white w-5 h-5" />
            </div>

            <div class="max-w-[85%] lg:max-w-[75%]">
              <div class="text-xs text-gray-400 mb-1 px-1" :class="{'text-right': msg.role === 'user'}">
                {{ msg.role === 'user' ? '我' : 'AI' }}
              </div>
              <div class="p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed border"
                   :class="msg.role === 'user' ? 'bg-blue-600 text-white border-blue-600 rounded-tr-none' : 'bg-white text-gray-800 border-gray-100 rounded-tl-none'">

                <div v-if="msg.status === 'loading'" class="flex items-center gap-2">
                   <Loader2 class="animate-spin w-4 h-4" /> 思考中...
                </div>
                <ChatCard v-else-if="msg.type === 'card'" :data="msg.cardData" />
                <MarkdownRenderer v-else :content="msg.content" />
                <!-- <div v-else class="whitespace-pre-wrap">
                  {{ msg.content }}
                </div> -->
              </div>
              <div v-if="msg.role === 'assistant' && msg.status === 'done'" class="flex items-center gap-2 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">

            <button
              @click="handleCopy(msg)"
              class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1 text-xs transition-colors"
              title="复制全部内容"
            >
              <Check v-if="copiedMsgId === msg.id" class="w-3.5 h-3.5 text-green-500" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span v-if="copiedMsgId === msg.id" class="text-green-500">已复制</span>
            </button>

            <button
              @click="regenerateMessage(msg.id)"
              class="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1 text-xs transition-colors"
              title="重新生成"
            >
              <RotateCcw class="w-3.5 h-3.5" />
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>
</template>
