/**
 * 用户检索偏好 - 类型定义
 *
 * 对接后端: GET /api/v1/user/profile/retrieve
 * 响应: UserRetrieveResponse
 * 对接后端: PATCH /api/v1/user/profile/preferences/update
 * 请求: UserRetrieveRequest
 */

// ==================== 后端原始响应格式 ====================

/**
 * 后端返回的原始响应（Record格式）
 * 注意：后端使用Java Record，Jackson序列化时枚举可能输出为：
 * - 枚举名称: "RELEVANCE", "ALL"
 * - 或自定义序列化: {code: 1, value: "relevance"}
 * 需要根据实际JSON调整此接口
 */
export interface UserRetrieveResponseRaw {
  userid: number
  yearStart: number
  yearEnd: number
  maxResults: number
  matchScore: number
  sourceFlags: number
  defaultSort: RetrieveSortEnum | string  // 可能是枚举对象或字符串
  docType: RetrieveDocTypeEnum | string     // 可能是枚举对象或字符串
}

// ==================== 后端请求格式 ====================

/**
 * 更新检索偏好 - 前端请求体（对应后端 UserRetrieveRequest）
 *
 * 注意：所有字段都是可选的（Optional），未修改的字段传 null
 * 后端会根据 Optional.isPresent() 判断是否更新该字段
 */
export interface UserRetrieveRequestRaw {
  yearStart?: number | null       // 起始年份（未修改传 null）
  yearEnd?: number | null         // 结束年份（未修改传 null）
  maxResults?: number | null      // 最大结果数（未修改传 null）
  matchScore?: number | null      // 匹配度阈值（未修改传 null）
  sourceFlags?: number | null     // 检索源位图（未修改传 null）
  defaultSort?: string | null     // 排序方式枚举名（未修改传 null）
  docType?: string | null         // 文献类型枚举名（未修改传 null）
}

// ==================== 枚举定义（与后端对应）====================

/**
 * 排序方式枚举（对应后端 RetrieveSortEnums）
 */
export interface RetrieveSortEnum {
  code: number      // 数据库值：1=相关度,2=最新,3=最早,4=引用最多
  value: string     // 前端标识符："relevance", "date_desc"等
  description?: string // 显示名称（可选）
}

/**
 * 文献类型枚举（对应后端 RetrieveDocTypeEnums）
 */
export interface RetrieveDocTypeEnum {
  code: number      // 数据库值：0=全部,1=期刊,2=会议,3=预印本
  value: string     // 前端标识符："all", "journal"等
  description?: string // 显示名称（可选）
}

// ==================== 前端友好格式（Store使用）====================

/**
 * 用户检索配置 - 前端标准格式
 * 用于Pinia Store和组件交互
 */
export interface UserSearchConfig {
  // 基础信息
  userId?: number

  // 检索偏好设置
  yearRangeStart: number        // 起始年份
  yearRangeEnd: number          // 结束年份
  maxResults: number            // 最大结果数 (1-10)
  minMatchScore: number         // 匹配度阈值 (40-80)

  // 检索源（从位图转换而来）
  searchSources: SearchSource[]

  // 排序方式（字符串，方便前端使用）
  defaultSort: SortOption

  // 文献类型（字符串）
  paperType: DocTypeOption
}

// ==================== 类型常量 ====================

/**
 * 检索源选项
 */
export type SearchSource =
  | 'google_scholar'
  | 'arxiv'
  | 'ieee_xplore'

export const SEARCH_SOURCES: { value: SearchSource; label: string }[] = [
  { value: 'google_scholar', label: 'Google Scholar' },
  { value: 'arxiv', label: 'arXiv' },
  { value: 'ieee_xplore', label: 'IEEE Xplore' },
]

/**
 * 排序选项
 */
export type SortOption =
  | 'relevance'      // 相关度 (code=1)
  | 'date_desc'      // 最新优先 (code=2)
  | 'date_asc'       // 最早优先 (code=3)
  | 'citations'      // 引用最多 (code=4)

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: '相关度' },
  { value: 'date_desc', label: '最新优先' },
  { value: 'date_asc', label: '最早优先' },
  { value: 'citations', label: '引用最多' },
]

/**
 * 文献类型选项
 */
export type DocTypeOption =
  | 'all'            // 全部类型 (code=0)
  | 'journal'        // 期刊论文 (code=1)
  | 'conference'     // 会议论文 (code=2)
  | 'preprint'       // 预印本 (code=3)

export const DOC_TYPE_OPTIONS: { value: DocTypeOption; label: string }[] = [
  { value: 'all', label: '全部类型' },
  { value: 'journal', label: '期刊论文' },
  { value: 'conference', label: '会议论文' },
  { value: 'preprint', label: '预印本' },
]

// ==================== 位图转换工具 ====================

/**
 * 检索源位图常量
 */
const SOURCE_FLAG_MAP: Record<SearchSource, number> = {
  google_scholar: 1,   // 二进制 001
  arxiv: 2,           // 二进制 010
  ieee_xplore: 4,     // 二进制 100
}

/**
 * 将位图转换为检索源列表
 * @param flags 位图整数（如7 = 111表示全部选中）
 * @returns 检索源数组
 */
export function parseSourceFlags(flags: number): SearchSource[] {
  if (!flags || flags === 0) {
    return ['google_scholar'] // 默认值
  }

  const sources: SearchSource[] = []

  if ((flags & 1) !== 0) sources.push('google_scholar')
  if ((flags & 2) !== 0) sources.push('arxiv')
  if ((flags & 4) !== 0) sources.push('ieee_xplore')

  return sources.length > 0 ? sources : ['google_scholar']
}

/**
 * 将检索源列表转换为位图
 * @param sources 检索源数组
 * @returns 位图整数
 */
export function toSourceFlags(sources: SearchSource[]): number {
  if (!sources || sources.length === 0) {
    return 1 // 默认Google Scholar
  }

  return sources.reduce((flags, source) => {
    return flags | (SOURCE_FLAG_MAP[source] || 0)
  }, 0)
}

// ==================== 枚举解析工具 ====================

/**
 * 解析后端返回的排序字段
 * 支持多种格式：
 * 1. 枚举对象: {code: 1, value: "relevance"}
 * 2. 字符串值: "relevance"
 * 3. 枚举名: "RELEVANCE"
 * 4. 数字code: 1
 */
export function parseSortEnum(sort: any): SortOption {
  if (!sort) return 'relevance'

  // 情况1: 对象格式 {value: "relevance"}
  if (typeof sort === 'object' && sort.value) {
    return sort.value as SortOption
  }

  // 情况2/3: 字符串格式
  if (typeof sort === 'string') {
    const lower = sort.toLowerCase()
    if (SORT_OPTIONS.some(opt => opt.value === lower)) {
      return lower as SortOption
    }
    // 尝试匹配枚举名
    switch (sort.toUpperCase()) {
      case 'RELEVANCE': return 'relevance'
      case 'NEWEST': return 'date_desc'
      case 'OLDEST': return 'date_asc'
      case 'MOST_CITED': return 'citations'
    }
  }

  // 情况4: 数字code
  if (typeof sort === 'number') {
    switch (sort) {
      case 1: return 'relevance'
      case 2: return 'date_desc'
      case 3: return 'date_asc'
      case 4: return 'citations'
    }
  }

  console.warn('[UserConfig] Unknown sort format:', sort)
  return 'relevance' // 默认值
}

/**
 * 解析后端返回的文献类型字段
 */
export function parseDocTypeEnum(docType: any): DocTypeOption {
  if (!docType) return 'all'

  // 情况1: 对象格式 {value: "all"}
  if (typeof docType === 'object' && docType.value) {
    return docType.value as DocTypeOption
  }

  // 情况2/3: 字符串格式
  if (typeof docType === 'string') {
    const lower = docType.toLowerCase()
    if (DOC_TYPE_OPTIONS.some(opt => opt.value === lower)) {
      return lower as DocTypeOption
    }
    switch (docType.toUpperCase()) {
      case 'ALL': return 'all'
      case 'JOURNAL': return 'journal'
      case 'CONFERENCE': return 'conference'
      case 'PREPRINT': return 'preprint'
    }
  }

  // 情况4: 数字code
  if (typeof docType === 'number') {
    switch (docType) {
      case 0: return 'all'
      case 1: return 'journal'
      case 2: return 'conference'
      case 3: return 'preprint'
    }
  }

  console.warn('[UserConfig] Unknown docType format:', docType)
  return 'all' // 默认值
}

// ==================== 前端 → 后端 转换工具 ====================

/**
 * 排序方式前端值 → 后端枚举名 映射表
 */
const SORT_TO_ENUM_NAME: Record<SortOption, string> = {
  relevance: 'RELEVANCE',
  date_desc: 'NEWEST',
  date_asc: 'OLDEST',
  citations: 'MOST_CITED',
}

/**
 * 文献类型前端值 → 后端枚举名 映射表
 */
const DOC_TYPE_TO_ENUM_NAME: Record<DocTypeOption, string> = {
  all: 'ALL',
  journal: 'JOURNAL',
  conference: 'CONFERENCE',
  preprint: 'PREPRINT',
}

/**
 * 将前端配置转换为后端更新请求体（Partial Update）
 *
 * @param currentConfig 当前配置值
 * @param originalConfig 原始配置值（用于对比哪些字段被修改）
 * @returns 后端请求体（只包含修改的字段，未修改的字段为 null）
 *
 * @example
 * ```typescript
 * const request = buildUpdateRequest(currentConfig, originalConfig)
 * // 结果：{ yearStart: 2021, defaultSort: "NEWEST", ...null }
 * // 未修改的字段自动设为 null
 * ```
 */
export function buildUpdateRequest(
  currentConfig: UserSearchConfig,
  originalConfig: UserSearchConfig
): UserRetrieveRequestRaw {
  const request: UserRetrieveRequestRaw = {}

  // 对比每个字段，只有修改过的才包含在请求中
  request.yearStart = currentConfig.yearRangeStart !== originalConfig.yearRangeStart
    ? currentConfig.yearRangeStart
    : null

  request.yearEnd = currentConfig.yearRangeEnd !== originalConfig.yearRangeEnd
    ? currentConfig.yearRangeEnd
    : null

  request.maxResults = currentConfig.maxResults !== originalConfig.maxResults
    ? currentConfig.maxResults
    : null

  request.matchScore = currentConfig.minMatchScore !== originalConfig.minMatchScore
    ? currentConfig.minMatchScore
    : null

  // 检索源数组 → 位图转换 + 对比
  const currentFlags = toSourceFlags(currentConfig.searchSources)
  const originalFlags = toSourceFlags(originalConfig.searchSources)
  request.sourceFlags = currentFlags !== originalFlags
    ? currentFlags
    : null

  // 排序方式：前端字符串 → 后端枚举名
  request.defaultSort = currentConfig.defaultSort !== originalConfig.defaultSort
    ? SORT_TO_ENUM_NAME[currentConfig.defaultSort]
    : null

  // 文献类型：前端字符串 → 后端枚举名
  request.docType = currentConfig.paperType !== originalConfig.paperType
    ? DOC_TYPE_TO_ENUM_NAME[currentConfig.paperType]
    : null

  console.log('[UserConfig] Build update request:')
  console.log('  - Current:', currentConfig)
  console.log('  - Original:', originalConfig)
  console.log('  - Request:', request)

  return request
}
