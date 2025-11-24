import { ref } from 'vue'
// 侧边栏状态，也可以写道一个新的composable文件中
const isSidebarOpen = ref(true)
export function useGlobalControl() {
  return {
    isSidebarOpen
  }
}
