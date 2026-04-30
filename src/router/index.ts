import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignupView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/library',
    name: 'MyLibrary',
    component: () => import('../views/MyLibraryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/search-history',
    name: 'SearchHistory',
    component: () => import('../views/SearchHistoryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * 全局路由守卫
 *
 * 认证检查逻辑：
 * 1. 优先从 Pinia Store (内存) 读取 token（最准确）
 * 2. 如果 Store 不可用，降级到 localStorage
 * 3. 避免竞态条件：不依赖定时器或异步初始化
 */
router.beforeEach((to, _from, next) => {
  // 尝试从 Auth Store 获取 token（内存中的实时状态）
  let token: string | null = null

  try {
    const authStore = useAuthStore()
    token = authStore.accessToken

    // 如果 Store 中有 token，直接放行（不需要检查 localStorage）
    if (token) {
      // 即使 token 在 Store 中标记为过期，也先放行
      // 让请求拦截器处理刷新逻辑，而不是在这里拦截
      next()
      return
    }

    // Store 中没有 token，尝试从 localStorage 恢复（兼容性）
    token = localStorage.getItem('accessToken')

    if (token) {
      // localStorage 有 token 但 Store 没有，说明可能页面刚刷新
      // 放行让 App.vue 或组件内部调用 initAuth()
      next()
      return
    }
  } catch (error) {
    // Store 不可用时的降级方案（极端情况）
    console.warn('[Router] Auth store not available, falling back to localStorage')
    token = localStorage.getItem('accessToken')
  }

  // 最终判断：需要认证但没有有效 token
  if (to.meta.requiresAuth && !token) {
    // 未登录，重定向到登录页
    // 保存原始目标路径，登录后可以跳回
    if (to.path !== '/login') {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()  // 已经在登录页了，避免循环重定向
    }
  } else {
    // 有 token 或不需要认证，正常放行
    next()
  }
})

export default router
