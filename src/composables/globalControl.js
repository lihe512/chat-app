import { ref } from 'vue'
// 侧边栏状态，也可以写道一个新的composable文件中
const isSidebarOpen = ref(true)
const isDarkMode = ref(false)
const THEME_KEY = 'chat-theme-preference'
export function useGlobalControl() {
  const toggleTheme = ()=>{
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }
  const applyTheme = ()=>{
    if(isDarkMode.value){
      document.documentElement.classList.add('dark')
      localStorage.setItem(THEME_KEY, 'dark')
    }
    else{
      document.documentElement.classList.remove('dark')
      localStorage.setItem(THEME_KEY, 'light')
    }
  }
  const initTheme = ()=>{
    const savedTheme = localStorage.getItem(THEME_KEY)
    if(savedTheme === 'dark'||(!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)){
      isDarkMode.value = true
    }
    else{
      isDarkMode.value = false
    }
    applyTheme()
  }



  return {
    isSidebarOpen,
    THEME_KEY,
    isDarkMode,
    toggleTheme,
    initTheme
  }
}
