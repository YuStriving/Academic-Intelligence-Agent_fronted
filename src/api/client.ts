/**
 * Axios 客户端封装
 *
 * 统一处理：
 * - 请求拦截器（添加Token）
 * - 响应拦截器（统一错误处理 + 401自动刷新）
 * - 请求/响应类型定义
 *
 * JWT双令牌机制：
 * - 访问令牌(Access Token): 存储在内存中(Pinia Store)，通过Authorization Header发送
 * - 刷新令牌(Refresh Token): 存储在HttpOnly Cookie中，自动随请求携带
 *
 * 令牌刷新策略：
 * - 仅在收到401响应时触发静默刷新
 * - 刷新成功后自动重试原请求，用户无感知
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ApiResponse, ApiError, AuthAccessToken } from './types'
import { useAuthStore } from '../stores/auth'
import { detectClientType, getClientVersion, CLIENT_TYPE_HEADER } from '../utils/clientInfo'

/**
 * 错误消息本地化工具
 * 
 * 将axios和浏览器返回的英文错误信息转换为中文，提升用户体验
 */
const ErrorMessages: Record<string, string> = {
  // 网络相关错误
  'Network Error': '网络连接失败，请检查网络设置',
  'timeout of': '请求超时，请稍后重试',
  'Network request failed': '网络请求失败',
  'Failed to fetch': '请求发送失败',
  'Unable to connect': '无法连接到服务器',
  'Internet connection lost': '网络连接已断开',
  'No internet connection': '无网络连接',
  
  // HTTP状态码相关
  'Request failed with status code 400': '请求参数有误（400）',
  'Request failed with status code 401': '登录已过期，请重新登录（401）',
  'Request failed with status code 403': '没有访问权限（403）',
  'Request failed with status code 404': '请求的资源不存在（404）',
  'Request failed with status code 500': '服务器内部错误（500）',
  'Request failed with status code 502': '网关错误（502）',
  'Request failed with status code 503': '服务暂时不可用（503）',
  'Request failed with status code 504': '网关超时（504）',
  
  // CORS相关
  'CORS policy': '跨域请求被阻止',
  'Cross-origin': '跨域请求失败',
  
  // 通用错误
  'Request aborted': '请求已取消',
  'Cancelled': '操作已取消',
  'Invalid refresh response': '令牌刷新响应无效',
}

/**
 * 本地化错误消息
 * 将英文错误转换为中文，如果找不到映射则返回原消息
 * @param rawError 原始错误消息
 * @returns 本地化后的中文错误消息
 */
function localizeErrorMessage(rawError: string): string {
  if (!rawError) return '未知错误'
  
  const trimmed = rawError.trim()
  
  // 精确匹配
  if (ErrorMessages[trimmed]) {
    return ErrorMessages[trimmed]
  }
  
  // 模糊匹配（部分关键字）
  for (const [key, value] of Object.entries(ErrorMessages)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  
  // 如果已经是中文，直接返回
  if (/[\u4e00-\u9fa5]/.test(trimmed)) {
    return trimmed
  }
  
  // 默认返回通用提示
  return `操作失败: ${trimmed}`
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    [CLIENT_TYPE_HEADER]: detectClientType(),
    'X-Client-Version': getClientVersion(),
  },
  withCredentials: true,
})

/**
 * 刷新状态管理（单例模式）
 * 
 * 解决问题：
 * - 防止并发请求同时触发多次刷新
 * - 提供统一的刷新接口供请求/响应拦截器和定时器调用
 * - 确保锁状态在任何情况下都能正确释放（使用try-finally）
 */
class RefreshManager {
  private isRefreshing = false
  private subscribers: Array<(token: string) => void> = []
  
  /**
   * 执行Token刷新
   * 
   * @returns 新的访问令牌字符串
   * @throws 刷新失败时抛出异常
   */
  async refresh(): Promise<string> {
    // 如果正在刷新，加入等待队列
    if (this.isRefreshing) {
      console.log('[Auth] Refresh already in progress, queuing...')
      return new Promise<string>((resolve, reject) => {
        this.subscribers.push(resolve)
        // 5秒超时保护
        setTimeout(() => reject(new Error('Refresh timeout')), 5000)
      })
    }

    this.isRefreshing = true
    
    try {
      console.log('[Auth] 🔄 Starting token refresh...')
      
      const apiRes = await axios.post<ApiResponse<AuthAccessToken>>(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }
      )

      if (!apiRes.data || apiRes.data.code !== 200 || !apiRes.data.data) {
        throw new Error(apiRes.data?.message || 'Invalid refresh response')
      }

      const authAccessToken: AuthAccessToken = apiRes.data.data

      const authStore = useAuthStore()
      authStore.setAccessToken(authAccessToken.accessToken, authAccessToken.expireIn)
      
      console.log(`[Auth] ✅ Token refreshed successfully`)
      
      // 通知所有等待者
      const newToken = authAccessToken.accessToken
      this.subscribers.forEach(cb => cb(newToken))
      this.subscribers = []
      
      return newToken
      
    } catch (error) {
      console.error('[Auth] ❌ Token refresh failed:', error)
      
      // 通知所有等待者失败
      this.subscribers.forEach(reject => reject(error))
      this.subscribers = []
      
      throw error
      
    } finally {
      // 确保锁状态总是被释放（解决竞态条件！）
      this.isRefreshing = false
    }
  }
}

const refreshManager = new RefreshManager()

// 导出refreshManager供调试使用（生产环境可移除）
export { refreshManager }

// 请求拦截器：自动添加 Authorization Header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const authStore = useAuthStore()
      const token = authStore.accessToken

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        console.warn('[Auth] ⚠️ No valid token available for request to', config.url)
      }
    } catch (storeError) {
      console.error('[Auth] ❌ Auth store not available:', storeError)
      
      // 降级方案：尝试从localStorage获取
      const fallbackToken = localStorage.getItem('accessToken')
      if (fallbackToken) {
        config.headers.Authorization = `Bearer ${fallbackToken}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：统一错误处理 + 401自动刷新
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data

    console.log(`[API] 📥 Response received:`, {
      url: response.config.url,
      httpStatus: response.status,
      businessCode: code,
      message: message
    })

    if (code === 200) {
      return data as any
    }

    // 🔍 调试：检查是否是业务层面的401（HTTP 200 but code 401）
    const apiError: ApiError = { code, message }
    if (code === 401) {
      console.warn('[Auth] ⚠️ Received business code 401 (HTTP 200), triggering refresh...')
      // 触发401刷新逻辑
      return handleTokenRefresh(response.config, apiError)
    }

    return Promise.reject(apiError)
  },
  async (error) => {
    const originalRequest = error.config
    const statusCode = error.response?.status
    const rawErrorMessage = error.response?.data?.message || error.message || '网络请求失败'

    console.error(`[API] ❌ Request failed:`, {
      url: originalRequest?.url,
      httpStatus: statusCode,
      responseData: error.response?.data
    })

    const apiError: ApiError = {
      code: statusCode || 500,
      message: localizeErrorMessage(rawErrorMessage),
    }

    // 401 自动刷新Token（仅对非重试请求触发）
    if (statusCode === 401 && originalRequest && !originalRequest._retry) {
      return handleTokenRefresh(originalRequest, apiError)
    }

    // 404 错误特殊处理
    if (statusCode === 404) {
      console.error('[API] ❌ Resource not found (404):', apiError.message)

      if (apiError.message.includes('User') || apiError.message.includes('user') ||
          apiError.message.includes('用户')) {
        console.warn('[Auth] ⚠️ User-related resource missing')
      }
    }

    // 其他未处理的401错误（已经重试过的情况）
    if (statusCode === 401 && (!originalRequest || originalRequest._retry)) {
      console.warn('[Auth] ⚠️ Unhandled 401 error, forcing logout')
      forceLogout('Unhandled 401 error')
    }

    return Promise.reject(apiError)
  }
)

/**
 * 统一的Token刷新处理函数
 * 处理HTTP 401和业务码401两种情况
 */
async function handleTokenRefresh(originalRequest: InternalAxiosRequestConfig, apiError: ApiError): Promise<any> {
  console.log('[Auth] 🔄 Received 401, attempting token refresh...')

  originalRequest._retry = true

  try {
    const newToken = await refreshManager.refresh()

    console.log('[Auth] ✅ Token refreshed after 401, retrying original request...')
    originalRequest.headers.Authorization = `Bearer ${newToken}`
    return apiClient(originalRequest)

  } catch (refreshError) {
    console.error('[Auth] ❌ Token refresh failed after 401:', refreshError)

    forceLogout('Token refresh failed after 401')
    return Promise.reject(apiError)
  }
}

/**
 * 强制登出工具函数
 */
function forceLogout(reason: string) {
  console.warn(`[Auth] Force logging out. Reason: ${reason}`)
  
  try {
    const authStore = useAuthStore()
    authStore.logout()
  } catch (storeError) {
    console.error('[Auth] Failed to access auth store during logout:', storeError)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenExpiresAt')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
  
  setTimeout(() => {
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
  }, 100)
}

// 封装通用请求方法
export const http = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.get<ApiResponse<T>, any>(url, config)
  },

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.post<ApiResponse<T>, any>(url, data, config)
  },

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.put<ApiResponse<T>, any>(url, data, config)
  },

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.patch<ApiResponse<T>, any>(url, data, config)
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.delete<ApiResponse<T>, any>(url, config)
  },
}

export default apiClient
