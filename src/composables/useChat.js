import { ref ,nextTick,watch} from 'vue'
import { v4 as uuidv4 } from 'uuid'
import html2pdf from 'html2pdf.js'
import MarkdownIt from 'markdown-it'
const STORAGE_KEY = 'chat-sessions-v1'
const LAST_SESSION_KEY = 'last-active-session-id'//存储最后显示的会话ID，方便刷新的时候仍保留在这个会话
// 定义会话列表变量
  const sessions = ref([])//存储所有会话列表
  const currentSessionId = ref(null)//当前选中的会话ID
  const messages = ref([])//当前会话的消息列表
  const isLoading = ref(false)//加载状态
  // 侧边栏状态，也可以写道一个新的composable文件中
  const isSidebarOpen = ref(true)
export function useChat() {

  // 读取本地存储
  const init = ()=>{
    const saved = localStorage.getItem(STORAGE_KEY)
    if(saved){
      sessions.value = JSON.parse(saved)
    }
    const lastId = localStorage.getItem(LAST_SESSION_KEY)
    // 如果有会话，默认选中第一个
    if(sessions.value.length > 0){
      if(lastId && sessions.value.find(s=>s.id===lastId)){
        switchSession(lastId)
      }
      else {
        // 选中这个会话
      // currentSessionId.value = sessions.value[0].id
      switchSession(sessions.value[0].id)
      }
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
      // 每次切换会话都保存ID，方便刷新时恢复
      localStorage.setItem(LAST_SESSION_KEY, id)
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.value))
  }
  // 添加消息
  const sendMessage = async (content)=>{
    if(!content.trim() || isLoading.value) return
    // 用户消息
    messages.value.push({
      id: uuidv4(),
      role: 'user',
      content:content,
      status:'done',
      type:'text',
      timestamp: Date.now()
    })
    // 滚动到底部
    scrollToBottom()
    // ai消息
    const aiMsgId = uuidv4()
    isLoading.value = true
    messages.value.push({
      id: aiMsgId,
      role: 'assistant',
      content:'',
      status:'loading',
      type:'text',
      timestamp: Date.now()
    })
    scrollToBottom()
    await mockStreamResponse(aiMsgId,content)
  }
  // 滚动到底部
  const scrollToBottom = () => {
    nextTick(() => {
      const container = document.getElementById('chat-container')
      if (container) container.scrollTop = container.scrollHeight
    })
  }
    // 模拟流式回复
  const mockStreamResponse = async (msgId, userContent) => {
    const targetMsg = messages.value.find(m => m.id === msgId)
    if (!targetMsg) return

    setTimeout(() => { targetMsg.status = 'streaming'  }, 600)

    // 模拟内容
    const fullText = `针对“${userContent}”的回复：\n\n这是多会话版本的演示。你可以点击左侧的新建对话来开启新的话题。\n\n- 支持 Markdown\n- 支持代码块\n\n\`\`\`js\nconst happy = true \n\`\`\``

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        targetMsg.content += fullText[currentIndex]
        currentIndex++
        scrollToBottom()
      } else {
        clearInterval(interval)
        targetMsg.status = 'done'
        isLoading.value = false
        saveToStorage() // 结束后保存
      }
    }, 30)
  }
   // 监听 messages 变化，自动同步回 sessions 里的数据并保存
  watch(messages, () => {
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (session) {
      session.messages = messages.value
      // 简单逻辑：用第一条消息的前10个字作为标题
      if (session.messages.length > 0 && session.title === '新会话') {
        const firstMsg = session.messages.find(m => m.role === 'user')
        if (firstMsg) {
          session.title = firstMsg.content.slice(0, 10) + (firstMsg.content.length > 10 ? '...' : '')
        }
      }
      saveToStorage()
    }
  }, { deep: true })
  // 刷新当前会话
  const refreshCurrentSession = ()=>{
    window.location.reload()
  }
  // 下载
  const downloadChat = (format) => {
    if (messages.value.length === 0) {
      alert('没有可下载的内容')
      return
    }
    if (format === 'pdf') {
      // PDF下载
      // window.print()
      // // 找到要导出的元素的id
      // const element = document.getElementById('chat-export-content')
      // if(!element) {
      //   return
      // }
      // // 配置pdf参数
      // const opt = {
      //   margin:[20,20],//上右下左边距
      //   filename: 'chat.pdf',
      //   image: { type: 'jpeg', quality: 0.98 },
      //   html2canvas: { scale: 2 },//保证文字清晰
      //   jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      // }
      // html2pdf().set(opt).from(element).save()
      const style = `
        <style>
          pre {
            white-space: pre-wrap !important
            word-wrap: break-word !important
            overflow-x: visible !important
            background-color: #f6f8fa
            padding: 10px
            border-radius: 4px
          }
          code {
            font-family: Consolas, Monaco, monospace
            font-size: 12px
            color: #333
          }
          div, p {
            word-break: break-word
          }
          ul, ol, li {
            list-style: none !important
          }
        </style>
      `
      const currentTitle = sessions.value.find(s => s.id === currentSessionId.value)?.title || '对话记录'
      const md = new MarkdownIt({ html: true, breaks: true })
      const element = document.createElement('div')
      element.style.width = '700px'
      element.style.padding = '40px'
      element.style.fontFamily = '"Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", sans-serif'
      element.style.color = '#333'
      element.style.backgroundColor = '#fff'
      let htmlContent =style +  `
        <div style="text-align: center  margin-bottom: 40px ">
          <h1 style="font-size: 24px  font-weight: bold  margin-bottom: 10px ">${currentTitle}</h1>
          <p style="color: #888  font-size: 12px ">导出时间: ${new Date().toLocaleString()}</p>
          <hr style="border: none  border-top: 1px solid #eee  margin-top: 20px " />
        </div>
      `
      messages.value.forEach(msg => {
        const roleName = msg.role === 'user' ? '用户' : 'AI 助手'
        const renderedContent = md.render(msg.content)
        console.log("renderedContent:", renderedContent)
        htmlContent += `
          <div style="margin-bottom: 25px  line-height: 1.6 ">
            <div style="font-weight: bold  font-size: 14px  margin-bottom: 5px  color: #000 ">
              ${roleName}:
            </div>
            <div style="font-size: 14px  color: #333  text-align: justify ">
              ${renderedContent}
            </div>
          </div>
        `
      })
      element.innerHTML = htmlContent
      const opt = {
        margin:       [15, 15], // 页边距
        filename:     `${currentTitle}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, // 2倍缩放，清晰度高
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }
      html2pdf().set(opt).from(element).save()
    } else {
      // Markdown
      let content = `# ${sessions.value.find(s => s.id === currentSessionId.value)?.title}\n\n`
      messages.value.forEach(msg => {
        content += `### ${msg.role}\n${msg.content}\n\n---\n\n`
      })
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'chat.md'
      a.click()
    }
  }
  const regenerateMessage = async (aiMsgId) => {
    if(isLoading.value) return
    const aiMsgIndex = messages.value.findIndex(m => m.id === aiMsgId)
    if(aiMsgIndex === -1) return
    const userMsg = messages.value[aiMsgIndex - 1]
    if(!userMsg || userMsg.role !== 'user') return//找不到对应的用户消息
    const userMsgIndex = aiMsgIndex - 1
    const aiMsg = messages.value[aiMsgIndex]
    // 重置AI消息
    aiMsg.content = ''
    // aiMsg.status = 'loading'
    // isLoading.value = true
    // scrollToBottom()
    // await mockStreamResponse(aiMsg.id, userMsg.content)
    const textToResend = userMsg.content
    messages.value.splice(userMsgIndex, 2)//删除原来的AI消息
    await sendMessage(textToResend)
  }
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
    isSidebarOpen,
    sendMessage,
    mockStreamResponse,
    refreshCurrentSession,
    downloadChat,
    regenerateMessage
  }
}
