// server.js
import express from 'express'
import axios from 'axios'
import cors from 'cors'
import 'dotenv/config' // 建议在同级目录创建 .env 文件存储 API_KEY

const app = express()

// 1. 基础配置：必须调大 limit 以支持图片 Base64 传输
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// 2. 配置你的 API Key
// 建议在 .env 文件中写 DASHSCOPE_API_KEY=xxx，或者直接替换下方字符串
const API_KEY = process.env.DASHSCOPE_API_KEY || 'sk-0d2179cc669c4a278584f7a537bb44f0'

app.post('/api/chat', async (req, res) => {
  const { prompt, history, imageUrl } = req.body

  console.log('--- 收到新请求 ---')
  console.log('文本内容:', prompt)
  console.log('是否存在图片:', imageUrl ? '是 (Base64)' : '否')

  try {
    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // 3. 构建多模态消息内容
    let userContent = []

    // 如果有图片，将图片对象放在数组前面（Qwen 建议顺序）
    if (imageUrl) {
      userContent.push({
        image_url: {
          url: imageUrl,
        },
      })
    }

    // 添加文本内容
    userContent.push({
      type: 'text',
      text: prompt || (imageUrl ? '请分析这张图片' : ''),
    })

    // 4. 调用通义千问 API (使用流式输出)
    const response = await axios({
      method: 'post',
      url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        // 如果有图片，必须使用支持视觉的模型 qwen-vl-plus 或 qwen-vl-max
        model: imageUrl ? 'qwen-vl-plus' : 'qwen-plus',
        messages: [
          { role: 'system', content: '你是一个专业且友好的AI助手。' },
          ...history,
          { role: 'user', content: userContent },
        ],
        stream: true,
      },
      responseType: 'stream',
    })

    // 5. 将大模型流式数据实时转发给前端
    response.data.on('data', (chunk) => {
      res.write(chunk)
    })

    response.data.on('end', () => {
      console.log('响应结束')
      res.end()
    })

    // 监听客户端断开连接
    req.on('close', () => {
      console.log('客户端已断开连接')
    })
  } catch (error) {
    // 详细记录错误原因
    const errorData = error.response?.data
    console.error('API调用失败详细信息:', errorData || error.message)

    // 向前端发送错误信息（符合 SSE 格式）
    res.write(`data: {"error": "AI接口调用失败: ${error.message}"}\n\n`)
    res.end()
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`=================================`)
  console.log(`后端服务已启动: http://localhost:${PORT}`)
  console.log(`API Key 状态: ${API_KEY ? '已配置' : '未配置'}`)
  console.log(`=================================`)
})
