<script setup>
import { onMounted } from 'vue'
import { useChat } from '@/composables/useChat'
import ChatCard from '@/components/MessageStyle/ChatCard.vue'
import MarkdownRenderer from '@/components/MessageStyle/MarkdownRenderer.vue'
// 引入更多图标
import {
  Loader2, User, Bot,
} from 'lucide-vue-next'
const {
  messages,
  init
} = useChat()
onMounted(() => {
  init()// 初始化加载历史
})
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
            </div>
          </div>
        </div>
      </div>
</template>
