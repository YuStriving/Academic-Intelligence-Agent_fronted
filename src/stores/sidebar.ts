import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(false)
  const autoCollapse = ref(true)

  function toggle() {
    isCollapsed.value = !isCollapsed.value
  }

  function collapse() {
    isCollapsed.value = true
  }

  function expand() {
    isCollapsed.value = false
  }

  function setAutoCollapse(value: boolean) {
    autoCollapse.value = value
    localStorage.setItem('app-auto-collapse-sidebar', String(value))
  }

  function initAutoCollapse() {
    const saved = localStorage.getItem('app-auto-collapse-sidebar')
    if (saved !== null) {
      autoCollapse.value = saved === 'true'
    }
  }

  return { isCollapsed, autoCollapse, toggle, collapse, expand, setAutoCollapse, initAutoCollapse }
})
