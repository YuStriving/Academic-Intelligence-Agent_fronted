import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { parseExpiryTime, formatDateForLog, getRemainingSeconds } from '../utils/timeParser'

export interface AuthUser {
  id?: string
  username?: string
  email?: string
  name?: string
  academicId?: string
  nickname?: string
  avatarUrl?: string
  school?: string
  bio?: string
  gender?: string
  createdAt?: string
}

export const useAuthStore = defineStore('auth', () => {
  /**
   * 访问令牌(Access Token)
   * - 主要存储在内存中（Vue响应式ref）
   * - 未过期时同步到localStorage（方便页面刷新恢复）
   * - 过期后只保留在内存，不存localStorage
   */
  const accessToken = ref<string | null>(null)

  /**
   * 访问令牌过期时间（ISO 8601格式）
   * - 来自后端TokenPairResponse.expiresIn字段
   * - 用于判断token是否有效
   */
  const tokenExpiresAt = ref<string | null>(null)

  /**
   * 刷新令牌(Refresh Token)
   * - 存储在HttpOnly Cookie中（由后端设置）
   * - 前端无法通过JavaScript访问（安全性保障）
   *
   * 注意：此字段保留用于兼容性检查，但实际值始终为null
   * 因为真正的refreshToken在HttpOnly Cookie中
   */
  const refreshToken = ref<string | null>(null)

  function parseStoredUser(): AuthUser | null {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  }

  const user = ref<AuthUser | null>(parseStoredUser())

  const isAuthenticated = computed(() => !!accessToken.value)

  /**
   * 检查访问令牌是否已过期
   *
   * @returns boolean true=已过期, false=未过期或无token
   */
  function isTokenExpired(): boolean {
    if (!tokenExpiresAt.value || !accessToken.value) {
      return true
    }

    try {
      const expiresAt = new Date(tokenExpiresAt.value).getTime()
      const now = Date.now()
      // 提前30秒认为过期（避免临界状态）
      return now >= (expiresAt - 30000)
    } catch {
      return true
    }
  }

  /**
   * 清除过期的localStorage数据
   *
   * 如果localStorage中的token已过期，清除它
   */
  function clearExpiredLocalStorage() {
    const storedExpiresAt = localStorage.getItem('tokenExpiresAt')
    
    if (storedExpiresAt && accessToken.value) {
      try {
        const expiresAt = new Date(storedExpiresAt).getTime()
        const now = Date.now()
        
        if (now >= (expiresAt - 30000)) {
          console.log('[Auth] Access token expired, clearing localStorage')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('tokenExpiresAt')
          accessToken.value = null
          tokenExpiresAt.value = null
        }
      } catch (e) {
        console.error('[Auth] Failed to check token expiry:', e)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('tokenExpiresAt')
      }
    }
  }

  /**
   * 用户登录
   *
   * @param token - 访问令牌(Access Token)
   * @param _refresh - 刷新令牌(Refresh Token)，已由后端设置到HttpOnly Cookie
   * @param userData - 用户信息对象
   * @param expiresIn - 过期时间(ISO 8601格式)，来自后端响应
   *
   * 存储策略：
   * - accessToken: 内存 + localStorage（未过期时）
   * - tokenExpiresAt: 内存 + localStorage（用于判断是否过期）
   * - refreshToken: 不再存储（由HttpOnly Cookie管理）
   */
  function login(token: string, _refresh: string, userData?: AuthUser, expiresIn?: string | number) {
    accessToken.value = token

    // 设置过期时间（使用健壮的时间解析器）
    if (expiresIn !== undefined && expiresIn !== null) {
      console.log(`[Auth] Received expiry time from server (raw):`, expiresIn)
      console.log(`[Auth] Expiry time type: ${typeof expiresIn}`)

      // 使用增强的解析器，支持多种Jackson序列化格式
      const parsedDate = parseExpiryTime(expiresIn)

      if (parsedDate) {
        const expiresAtMs = parsedDate.getTime()
        const now = Date.now()
        const remainingSeconds = getRemainingSeconds(parsedDate)

        console.log(`[Auth] ✅ Successfully parsed expiry time`)
        console.log(`[Auth] Parsed date: ${formatDateForLog(parsedDate)}`)
        console.log(`[Auth] Remaining time: ${remainingSeconds} seconds (${Math.round(remainingSeconds / 60)} minutes)`)

        // 将ISO字符串存储到状态中（用于后续检查）
        tokenExpiresAt.value = parsedDate.toISOString()

        // 只有未过期才存入localStorage
        if (now < (expiresAtMs - 30000)) {
          localStorage.setItem('accessToken', token)
          localStorage.setItem('tokenExpiresAt', parsedDate.toISOString())
          console.log(`[Auth] Token saved to localStorage, expires at ${parsedDate.toLocaleString()}`)
        } else if (remainingSeconds > 0 && remainingSeconds <= 30) {
          // 即将过期（30秒内），仍然保存但发出警告
          console.warn(`[Auth] ⚠️ Token expiring very soon (${remainingSeconds}s), saving anyway`)
          localStorage.setItem('accessToken', token)
          localStorage.setItem('tokenExpiresAt', parsedDate.toISOString())
        } else {
          // 已经过期
          console.warn(`[Auth] ❌ Token already expired (${Math.abs(remainingSeconds)}s ago), not saving to localStorage`)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('tokenExpiresAt')
          accessToken.value = null
          tokenExpiresAt.value = null
        }
      } else {
        // 解析失败
        console.error(`[Auth] ❌ Failed to parse expiry time:`, expiresIn)
        console.error('[Auth] This might indicate a backend serialization issue')
        console.error('[Auth] Expected format: ISO-8601 string or Unix timestamp')

        // 解析失败时的安全策略：仍然保存token，但不设置过期时间
        localStorage.setItem('accessToken', token)
        console.warn('[Auth] Saving token WITHOUT expiry information (fallback mode)')
        console.warn('[Auth] Please check your backend TokenPairResponse configuration')
      }
    } else {
      // 没有提供过期时间，默认保存（向后兼容）
      localStorage.setItem('accessToken', token)
      console.warn('[Auth] No expiry time provided, saving token without expiry check')
      console.warn('[Auth] Consider updating backend to return expiresIn field')
    }

    // 移除旧的refreshToken localStorage存储（如果存在）
    localStorage.removeItem('refreshToken')

    if (userData) {
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  /**
   * 设置访问令牌（用于Token刷新后更新）
   *
   * @param token - 新的访问令牌
   * @param expiresIn - 新的过期时间(可选，支持string或number)
   *
   * 此方法由client.ts中的refreshToken()函数调用
   * 在401自动刷新流程中使用
   */
  function setAccessToken(token: string, expiresIn?: string | number) {
    accessToken.value = token

    // 更新过期时间（使用健壮的解析器）
    if (expiresIn !== undefined && expiresIn !== null) {
      console.log(`[Auth] setAccessToken: Received new expiry time:`, expiresIn)

      const parsedDate = parseExpiryTime(expiresIn)

      if (parsedDate) {
        const expiresAtMs = parsedDate.getTime()
        const now = Date.now()
        const remainingSeconds = getRemainingSeconds(parsedDate)

        console.log(`[Auth] ✅ Refreshed token parsed successfully`)
        console.log(`[Auth] New expiry: ${formatDateForLog(parsedDate)}`)
        console.log(`[Auth] Remaining: ${remainingSeconds}s`)

        // 更新内存状态
        tokenExpiresAt.value = parsedDate.toISOString()

        // 检查是否有效
        if (now < (expiresAtMs - 30000)) {
          // 未过期，保存到localStorage
          localStorage.setItem('accessToken', token)
          localStorage.setItem('tokenExpiresAt', parsedDate.toISOString())
          console.log(`[Auth] Refreshed token saved to localStorage`)
        } else if (remainingSeconds > 0) {
          // 即将过期，仍然保存
          localStorage.setItem('accessToken', token)
          localStorage.setItem('tokenExpiresAt', parsedDate.toISOString())
          console.warn(`[Auth] ⚠️ Refreshed token expiring soon (${remainingSeconds}s)`)
        } else {
          // 已过期（不应该发生）
          console.error(`[Auth] ❌ Refreshed token is already expired!`)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('tokenExpiresAt')
        }
      } else {
        // 解析失败
        console.error('[Auth] Failed to parse refreshed token expiry time:', expiresIn)
        // 安全策略：保存但不设置过期时间
        localStorage.setItem('accessToken', token)
      }
    } else {
      // 没有提供过期时间
      localStorage.setItem('accessToken', token)
      console.warn('[Auth] Refreshed token saved without expiry time')
    }
  }

  /**
   * 用户登出
   *
   * 清除所有认证相关的数据：
   * - 内存中的所有数据
   * - localStorage中的用户信息和token
   * - HttpOnly Cookie中的refreshToken（通过调用后端logout接口清除）
   */
  function logout() {
    accessToken.value = null
    refreshToken.value = null
    tokenExpiresAt.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenExpiresAt')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    console.log('[Auth] User logged out, all auth data cleared')
  }

  /**
   * 初始化认证状态
   *
   * 从localStorage恢复用户信息和accessToken
   *
   * 改进：
   * - 增强过期时间解析的健壮性（支持多种格式）
   * - 解析失败时采用保守策略（不删除，仅警告）
   * - 避免误删有效token导致闪退
   */
  function initAuth() {
    const storedToken = localStorage.getItem('accessToken')
    const storedExpiresAt = localStorage.getItem('tokenExpiresAt')
    const storedUser = localStorage.getItem('user')

    console.log('[Auth] Initializing auth state...')
    console.log('[Auth] Stored token exists:', !!storedToken)
    console.log('[Auth] Stored expiry time:', storedExpiresAt)

    // 检查token是否过期
    if (storedToken && storedExpiresAt) {
      try {
        // 增强的日期解析：支持多种ISO 8601格式
        let expiresAt: number

        // 尝试直接解析
        const parsedDate = new Date(storedExpiresAt)
        if (!isNaN(parsedDate.getTime())) {
          expiresAt = parsedDate.getTime()
        } else {
          // 尝试修复常见格式问题（如缺少Z后缀、时区等）
          let fixedTimeStr = storedExpiresAt
          if (!fixedTimeStr.endsWith('Z') && !fixedTimeStr.includes('+')) {
            fixedTimeStr += 'Z'  // 补充UTC标识
          }
          const fixedDate = new Date(fixedTimeStr)
          if (!isNaN(fixedDate.getTime())) {
            expiresAt = fixedDate.getTime()
          } else {
            throw new Error(`Invalid date format: ${storedExpiresAt}`)
          }
        }

        const now = Date.now()
        const bufferTime = 30000 // 30秒缓冲区

        console.log(`[Auth] Token expires at: ${new Date(expiresAt).toLocaleString()}`)
        console.log(`[Auth] Current time: ${new Date(now).toLocaleString()}`)
        console.log(`[Auth] Time diff: ${Math.round((expiresAt - now) / 1000)} seconds`)

        if (now >= (expiresAt - bufferTime)) {
          // Token已过期或即将过期
          const remainingSeconds = Math.round((expiresAt - now) / 1000)
          console.warn(`[Auth] Token expired or about to expire (${remainingSeconds}s remaining), clearing...`)

          // 清除过期的token
          localStorage.removeItem('accessToken')
          localStorage.removeItem('tokenExpiresAt')
          accessToken.value = null
          tokenExpiresAt.value = null
        } else {
          // Token未过期，安全加载到内存
          accessToken.value = storedToken
          tokenExpiresAt.value = storedExpiresAt
          console.log(`[Auth] ✅ Token loaded successfully, valid for ${Math.round((expiresAt - now) / 60000)} minutes`)
        }
      } catch (e) {
        // 解析失败时的保守策略：不删除token，仅警告
        console.error('[Auth] ⚠️ Failed to parse expiry time, but keeping token for compatibility')
        console.error('[Auth] Parse error details:', e)
        console.error('[Auth] Raw expiry string:', storedExpiresAt)

        // 仍然加载token到内存（向后兼容）
        accessToken.value = storedToken
        tokenExpiresAt.value = null // 标记为未知状态
      }
    } else if (storedToken && !storedExpiresAt) {
      // 有token但没有过期时间（旧版本兼容），加载但提示升级
      console.warn('[Auth] Found legacy token without expiry time, loading anyway')
      console.warn('[Auth] Please consider re-login to get proper expiry information')
      accessToken.value = storedToken
      tokenExpiresAt.value = null
    } else if (!storedToken) {
      console.log('[Auth] No stored token found, user needs to login')
    }

    // 加载用户信息
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        console.log(`[Auth] User info loaded:`, user.value?.name || user.value?.email || 'unknown')
      } catch (e) {
        console.error('[Auth] Failed to parse user info:', e)
        user.value = null
      }
    }

    console.log('[Auth] Initialization complete')
    console.log(`[Auth] Final state: isAuthenticated=${!!accessToken.value}`)
  }

  return {
    accessToken,
    tokenExpiresAt,
    refreshToken,
    user,
    isAuthenticated,
    isTokenExpired,
    login,
    logout,
    initAuth,
    setAccessToken,
    clearExpiredLocalStorage,
  }
})
