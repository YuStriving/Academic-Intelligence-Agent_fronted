/**
 * 时间戳/日期解析工具
 *
 * 用于处理后端 java.time.Instant 的各种 Jackson 序列化格式
 *
 * 支持的格式：
 * 1. ISO-8601 UTC: "2026-04-27T15:30:00Z"
 * 2. ISO-8601 带时区: "2026-04-27T23:30:00+08:00"
 * 3. ISO-8601 无时区: "2026-04-27T15:30:00" (视为本地或UTC)
 * 4. Unix时间戳(秒): 1714225800
 * 5. Unix时间戳(毫秒): 1714225800000
 * 6. RFC 2822: "Sat, 27 Apr 2026 15:30:00 GMT"
 */

/**
 * 解析后端返回的过期时间字符串为 Date 对象
 *
 * @param timeStr - 后端返回的时间字符串（可能是多种格式）
 * @returns 解析后的 Date 对象，如果无法解析则返回 null
 */
export function parseExpiryTime(timeStr: string | number | undefined | null): Date | null {
  if (timeStr === undefined || timeStr === null) {
    console.warn('[TimeParser] Received null/undefined expiry time')
    return null
  }

  console.log(`[TimeParser] Parsing expiry time: ${timeStr} (type: ${typeof timeStr})`)

  // 情况1：数字类型（Unix时间戳）
  if (typeof timeStr === 'number') {
    const timestamp = timeStr

    // 判断是秒还是毫秒（Unix时间戳通常在10位左右表示秒，13位左右表示毫秒）
    if (timestamp < 10000000000) {
      // 可能是秒级时间戳（10位数，如 1714225800）
      console.log(`[TimeParser] Detected Unix timestamp in SECONDS: ${timestamp}`)
      return new Date(timestamp * 1000)
    } else {
      // 可能是毫秒级时间戳（13位数，如 1714225800000）
      console.log(`[TimeParser] Detected Unix timestamp in MILLISECONDS: ${timestamp}`)
      return new Date(timestamp)
    }
  }

  // 情况2：字符串类型
  if (typeof timeStr !== 'string') {
    console.error(`[TimeParser] Unsupported type: ${typeof timeStr}`)
    return null
  }

  const str = timeStr.trim()

  // 尝试不同的解析策略

  // 策略A：标准ISO-8601格式（最常见）
  let date = tryParseISO8601(str)
  if (date) {
    console.log(`[TimeParser] ✅ Parsed as ISO-8601: ${date.toISOString()}`)
    return date
  }

  // 策略B：尝试修复常见问题后再次解析
  date = tryParseWithFixes(str)
  if (date) {
    console.log(`[TimeParser] ✅ Parsed after fixing: ${date.toISOString()}`)
    return date
  }

  // 策略C：尝试RFC 2822格式
  date = tryParseRFC2822(str)
  if (date) {
    console.log(`[TimeParser] ✅ Parsed as RFC 2822: ${date.toISOString()}`)
    return date
  }

  // 所有策略都失败
  console.error(`[TimeParser] ❌ Failed to parse time string: "${str}"`)
  console.error(`[TimeParser] Expected formats:`)
  console.error(`  - ISO-8601: "2026-04-27T15:30:00Z"`)
  console.error(`  - ISO-8601+TZ: "2026-04-27T23:30:00+08:00"`)
  console.error(`  - Unix timestamp (seconds): 1714225800`)
  console.error(`  - Unix timestamp (ms): 1714225800000`)

  return null
}

/**
 * 策略A：尝试直接解析ISO-8601格式
 */
function tryParseISO8601(str: string): Date | null {
  const date = new Date(str)

  // 检查是否有效（Invalid Date的getTime()返回NaN）
  if (!isNaN(date.getTime())) {
    // 额外验证：年份应该在合理范围内（2000-2100）
    const year = date.getFullYear()
    if (year >= 2000 && year <= 2100) {
      return date
    }
  }

  return null
}

/**
 * 策略B：修复常见格式问题后解析
 *
 * 常见问题：
 * 1. 缺少Z后缀（UTC标识）
 * 2. 缺少时区信息
 * 3. 使用空格代替T分隔符
 * 4. 包含额外的精度（微秒、纳秒等）
 */
function tryParseWithFixes(str: string): Date | null {
  // Fix 1: 补充Z后缀（如果没有时区信息且符合ISO格式特征）
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/.test(str)) {
    if (!str.includes('Z') && !str.includes('+') && !str.includes('-')) {
      // 看起来像ISO格式但没有时区，补充Z
      const fixedWithZ = str.replace(/\.\d+$/, '') + 'Z' // 移除可能的微秒后加Z
      const date = new Date(fixedWithZ)
      if (!isNaN(date.getTime()) && date.getFullYear() >= 2000) {
        console.log(`[TimeParser] Fix applied: Added 'Z' suffix`)
        return date
      }
    }
  }

  // Fix 2: 将空格替换为T
  if (str.includes(' ') && !str.includes('T')) {
    const fixedWithT = str.replace(' ', 'T')
    const date = new Date(fixedWithT)
    if (!isNaN(date.getTime()) && date.getFullYear() >= 2000) {
      console.log(`[TimeParser] Fix applied: Replaced space with 'T'`)
      return date
    }
  }

  // Fix 3: 处理Java Instant的特殊格式（有时会输出带3位小数点的秒数）
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,9}$/.test(str)) {
    // 这种格式通常被JS原生支持，但如果失败可以尝试截断
    const truncated = str.replace(/\.\d+$/, '')
    const date = new Date(truncated + 'Z')
    if (!isNaN(date.getTime()) && date.getFullYear() >= 2000) {
      console.log(`[TimeParser] Fix applied: Truncated sub-second precision`)
      return date
    }
  }

  return null
}

/**
 * 策略C：尝试RFC 2822格式
 */
function tryParseRFC2822(str: string): Date | null {
  // JavaScript的Date构造函数也支持RFC 2822格式
  // 例如："Sat, 27 Apr 2026 15:30:00 GMT"
  const date = new Date(str)

  if (!isNaN(date.getTime()) && date.getFullYear() >= 2000) {
    return date
  }

  return null
}

/**
 * 格式化Date对象为可读字符串（用于日志输出）
 */
export function formatDateForLog(date: Date): string {
  return `${date.toISOString()} (local: ${date.toLocaleString()})`
}

/**
 * 计算剩余有效时间（秒）
 *
 * @param expiresAt 过期时间
 * @returns 剩余秒数，如果已过期返回负数
 */
export function getRemainingSeconds(expiresAt: Date): number {
  const now = Date.now()
  const expires = expiresAt.getTime()
  return Math.floor((expires - now) / 1000)
}

/**
 * 判断是否即将过期（30秒内）
 */
export function isExpiringSoon(expiresAt: Date, bufferSeconds: number = 30): boolean {
  return getRemainingSeconds(expiresAt) <= bufferSeconds
}
