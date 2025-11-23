import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
const STORAGE_KEY = 'chat-sessions-v1'
// 定义会话列表变量
  const sessions = ref([])//存储所有会话列表
  const currentSessionId = ref(null)//当前选中的会话ID
  const messages = ref([])//当前会话的消息列表
  const isLoading = ref(false)//加载状态
  // 侧边栏状态
  const isSidebarOpen = ref(true)
export function useChat() {

  // 读取本地存储
  const init = ()=>{
    const saved = localStorage.getItem(STORAGE_KEY)
    if(saved){
      sessions.value = JSON.parse(saved)
    }
    // 如果有会话，默认选中第一个
    if(sessions.value.length > 0){
      // 选中这个会话
      // currentSessionId.value = sessions.value[0].id
      switchSession(sessions.value[0].id)
    }
    else{
      // 没有会话，创建一个默认会话
      createNewSession()
    }
  }
  // 新建会话
  const createNewSession = ()=>{
    const newSession = {
      id: uuidv4(),
      title:'新会话',
      messages: [],
      timestamp: Date.now()
    }
    //将当前会话添加到会话列表最前面
    sessions.value.unshift(newSession)
    //将当前会话ID设置为新会话ID
    switchSession(newSession.id)
  }
  // 切换会话
  const switchSession = (id) =>{
    currentSessionId.value = id
    // 找到当前会话
    const session = sessions.value.find(s=>s.id === id)
    if(session){
      // 更新消息列表
      messages.value = session.messages
    }
  }
  // 删除会话
  const deleteSession = (id,e) =>{
    //阻止事件冒泡，防止触发切换会话
    e.stopPropagation()
    // 从列表中将这个id的会话删除
    sessions.value = sessions.value.filter(s=>s.id!==id)
    // 如果删除的是当前选中的会话，那么就会回到第一个对话
    if(currentSessionId.value === id){
      if(sessions.value.length > 0){
        switchSession(sessions.value[0].id)
      }
      else {
        createNewSession()
      }
    }
    saveToStorage()
  }
  // 自动保存
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.value));
  };































  return {
    sessions,
    currentSessionId,
    messages,
    isLoading,
    init,
    createNewSession,
    switchSession,
    deleteSession,
    saveToStorage,
    isSidebarOpen
  }
}
