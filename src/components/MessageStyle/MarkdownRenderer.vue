<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})
const defaultFence = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.fence = function(tokens, idx, options, env, self) {
  const token = tokens[idx]
  const codeContent = token.content
  const originalHtml = defaultFence(tokens, idx, options, env, self)
  return `
    <div class="relative group my-4">
      <button
        class="copy-btn absolute top-3 right-3 z-10 p-1.5 bg-gray-700 text-gray-300 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600 hover:text-white cursor-pointer flex items-center gap-1"
        data-code="${encodeURIComponent(codeContent)}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon hidden"><polyline points="20 6 9 17 4 12"/></svg>
        <span>复制</span>
      </button>
      ${originalHtml}
    </div>
  `
}
const htmlContent = computed(() => md.render(props.content))
// 处理点击逻辑 事件委托
const handleContainerClick = async (e) => {
  const btn = e.target.closest('.copy-btn')
  if (!btn) return
  // 1. 取出代码
  const code = decodeURIComponent(btn.getAttribute('data-code'))
  try {
    await navigator.clipboard.writeText(code)
    // 2. 获取内部元素
    const span = btn.querySelector('span')
    const copyIcon = btn.querySelector('.copy-icon')
    const checkIcon = btn.querySelector('.check-icon')
    // 3. 切换状态
    span.innerText = '已复制'
    copyIcon.classList.add('hidden')
    checkIcon.classList.remove('hidden')
    // 4. 清除上一次的定时器
    if (btn._timer) clearTimeout(btn._timer)
    // 5. 设置定时器，2秒后恢复原状
    btn._timer = setTimeout(() => {
      span.innerText = '复制'
      btn.classList.remove('text-green-400')
      copyIcon.classList.remove('hidden')
      checkIcon.classList.add('hidden')
      btn._timer = null
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>
<template>
  <div
    class="markdown-body prose prose-sm max-w-none dark:prose-invert"
    v-html="htmlContent"
    @click="handleContainerClick"
  ></div>
</template>
<style>
.markdown-body pre {
  padding: 0;
  background: transparent;
  margin: 0;
}
.markdown-body .hljs {
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.9em;
  background-color: #282c34;
}
.hidden {
  display: none;
}
</style>
