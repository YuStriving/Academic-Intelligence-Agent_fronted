/**
 * 客户端类型定义
 *
 * 用于标识请求来源的客户端类型（Web、App、小程序等）
 * 通过 X-Client-Type HTTP Header 传递给后端
 */

export enum ClientType {
  /** PC端网页浏览器 */
  WEB = 'WEB',
  /** 移动端网页浏览器（手机浏览器） */
  MOBILE_WEB = 'MOBILE_WEB',
  /** iOS原生应用 */
  IOS_APP = 'IOS_APP',
  /** Android原生应用 */
  ANDROID_APP = 'ANDROID_APP',
  /** 微信小程序 */
  MINI_PROGRAM = 'MINI_PROGRAM',
  /** 桌面客户端（Electron等） */
  DESKTOP_APP = 'DESKTOP_APP',
}

export const CLIENT_TYPE_HEADER = 'X-Client-Type'

/**
 * 检测当前运行环境的客户端类型
 *
 * @returns ClientType 枚举值
 *
 * 检测逻辑：
 * 1. 检查是否在微信小程序环境中
 * 2. 检查 User-Agent 判断是否为移动设备
 * 3. 默认返回 WEB（PC浏览器）
 */
export function detectClientType(): ClientType {
  // 检测微信小程序环境
  if (isMiniProgram()) {
    return ClientType.MINI_PROGRAM
  }

  // 检测移动设备
  if (isMobileDevice()) {
    return ClientType.MOBILE_WEB
  }

  // 默认为PC Web端
  return ClientType.WEB
}

/**
 * 检测是否在微信小程序环境中
 */
function isMiniProgram(): boolean {
  if (typeof wx !== 'undefined' && wx?.miniProgram?.getEnv) {
    return true
  }

  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('miniprogram') || ua.includes('micromessenger')
  }

  return false
}

/**
 * 检测是否为移动设备（手机/平板）
 */
function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  const ua = navigator.userAgent.toLowerCase()

  // 移动设备关键词
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry',
    'iemobile', 'opera mini', 'mobile', 'tablet'
  ]

  return mobileKeywords.some(keyword => ua.includes(keyword))
}

/**
 * 获取客户端版本号（可选）
 *
 * 从 package.json 或 meta 标签读取版本信息
 */
export function getClientVersion(): string {
  try {
    if (typeof __APP_VERSION__ !== 'undefined') {
      return __APP_VERSION__
    }
  } catch {
    // 忽略错误
  }

  // 尝试从 meta 标签获取
  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="version"]')
    if (meta) {
      return meta.getAttribute('content') || '1.0.0'
    }
  }

  return '1.0.0'
}
