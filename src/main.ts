import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import './style.css'
import App from './App.vue'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { useAppearanceStore } from './stores/appearance'
import { useSidebarStore } from './stores/sidebar'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const authStore = useAuthStore()
authStore.initAuth()

const themeStore = useThemeStore()
themeStore.initTheme()

const appearanceStore = useAppearanceStore()
appearanceStore.initAppearance()

const sidebarStore = useSidebarStore()
sidebarStore.initAutoCollapse()

router.beforeEach((to, from, next) => {
  if (from.path !== to.path && from.path !== '/' && from.name) {
    if (sidebarStore.autoCollapse) {
      sidebarStore.collapse()
    }
  }
  next()
})

app.use(i18n)
app.use(router)
app.mount('#app')
