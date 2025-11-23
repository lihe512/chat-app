<script setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';


const props = defineProps({
  content: {
    type: String,
    default: ''
  }
});

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

const htmlContent = computed(() => md.render(props.content));
</script>

<template>
  <div class="markdown-body prose prose-sm max-w-none dark:prose-invert" v-html="htmlContent"></div>
</template>

<style>
.markdown-body p { margin-bottom: 0.5em; }
.markdown-body pre { padding: 10px; background: #282c34; border-radius: 6px; overflow-x: auto; }
</style>
