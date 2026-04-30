import { ref, onMounted, watch, type Ref } from 'vue'

const currentTheme: Ref<'light' | 'dark'> = ref('light')

export function useTheme() {
  const setTheme = (theme: 'light' | 'dark') => {
    currentTheme.value = theme
    localStorage.setItem('app-theme', theme)
    
    if (theme === 'dark') {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }

  onMounted(() => {
    const saved = localStorage.getItem('app-theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  })

  return {
    currentTheme,
    setTheme,
    toggleTheme,
  }
}

export function initTheme() {
  const saved = localStorage.getItem('app-theme') as 'light' | 'dark' | null
  if (saved) {
    if (saved === 'dark') {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      currentTheme.value = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      currentTheme.value = 'light'
    }
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      currentTheme.value = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      currentTheme.value = 'light'
    }
  }
}
