<script setup>
  import { onMounted } from 'vue'
  import { useChat } from '@/composables/useChat'
  import { useGlobalControl } from '@/composables/globalControl'
  import {
  Plus, MessageSquare, Trash2,
} from 'lucide-vue-next'
  const {
    sessions,
    currentSessionId,
    init,
    switchSession,
    createNewSession,
    deleteSession
  } = useChat()
  const { isSidebarOpen} = useGlobalControl()
  // // 控制侧边栏是否折叠
  // const isSidebarOpen = ref(true)
  // 初始化
  onMounted(() => {
    init()
  })

</script>
<template>
  <aside
      class="bg-gray-900 text-gray-100 flex flex-col transition-all duration-300 ease-in-out border-r border-gray-800"
      :class="isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'"
    >
      <div class="p-4 border-b border-gray-800">
        <button
          @click="createNewSession"
          class="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
        >
          <Plus class="w-5 h-5" />
          <span class="font-medium">新建对话</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        <div v-if="sessions.length === 0" class="text-gray-500 text-center text-sm mt-10">
          暂无历史记录
        </div>

        <div
          v-for="session in sessions"
          :key="session.id"
          @click="switchSession(session.id)"
          class="group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm"
          :class="currentSessionId === session.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'"
        >
          <div class="flex items-center gap-2 overflow-hidden">
            <MessageSquare class="w-4 h-4 flex-shrink-0" />
            <span class="truncate">{{ session.title }}</span>
          </div>

          <button
            @click="(e) => deleteSession(session.id, e)"
            class="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-1"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="p-4 border-t border-gray-800 flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
        <div class="text-sm font-medium">我的账号</div>
      </div>
    </aside>
</template>
