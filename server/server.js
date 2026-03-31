// server.js
import express from 'express'
import axios from 'axios'
import cors from 'cors'
import 'dotenv/config' // 直接加载环境变量

const app = express()
app.use(cors())
app.use(express.json())

const API_KEY = 'sk-0d2179cc669c4a278584f7a537bb44f0'

app.post('/api/chat', async (req, res) => {
  const { prompt, history } = req.body

  try {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const response = await axios({
      method: 'post',
      url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: '你是一个专业的AI助手。' },
          ...history,
          { role: 'user', content: prompt },
        ],
        stream: true,
      },
      responseType: 'stream',
    })

    response.data.on('data', (chunk) => {
      res.write(chunk)
    })

    response.data.on('end', () => {
      res.end()
    })
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message)
    res.status(500).write(`data: {"error": "AI接口调用失败"}\n\n`)
    res.end()
  }
})

const PORT = 5000
app.listen(PORT, () => console.log(`后端服务启动: http://localhost:${PORT}`))
