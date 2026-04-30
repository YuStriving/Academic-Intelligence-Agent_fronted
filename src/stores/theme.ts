import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeMode>('light')
  const isInitialized = ref(false)

  const isDark = computed(() => resolveTheme() === 'dark')
  const isLight = computed(() => resolveTheme() === 'light')

  function getSystemTheme(): ResolvedTheme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function resolveTheme(): ResolvedTheme {
    if (currentTheme.value === 'system') {
      return getSystemTheme()
    }
    return currentTheme.value
  }

  function initTheme() {
    const saved = localStorage.getItem('app-theme') as ThemeMode | null
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      currentTheme.value = saved
    } else {
      currentTheme.value = 'light'
      localStorage.setItem('app-theme', 'light')
    }
    applyThemeToDOM()
    isInitialized.value = true

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentTheme.value === 'system') {
        applyThemeToDOM()
      }
    })
  }

  function setTheme(theme: ThemeMode) {
    currentTheme.value = theme
    localStorage.setItem('app-theme', theme)
    applyThemeToDOM()
  }

  function toggleTheme() {
    const resolved = resolveTheme()
    const newTheme: ThemeMode = resolved === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  function applyThemeToDOM() {
    const resolved = resolveTheme()
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolved)
    document.documentElement.setAttribute('data-theme', resolved)
  }

  return {
    currentTheme,
    isInitialized,
    isDark,
    isLight,
    initTheme,
    setTheme,
    toggleTheme,
    resolveTheme,
  }
})
