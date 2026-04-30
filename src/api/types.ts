/**
 * API 接口定义
 * 
 * 基于前端页面原型定义的完整API接口规范
 * 后端开发可参照此文档实现对应接口
 * 
 * 版本: 1.0
 * 日期: 2026-04-18
 */

// ============================
// 通用类型定义
// ============================

/**
 * 统一响应格式
 * 
 * 所有API接口都使用此响应格式
 * 后端实现时必须遵循此格式
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
  traceId?: string
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}

/**
 * 分页响应数据
 */
export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  numberOfElements: number
  size: number
  number: number
}

// ============================
// 认证模块 (Auth Module)
// ============================

/**
 * 登录请求
 * POST /api/v1/auth/login
 * 
 * 说明: 支持用户名或邮箱登录
 */
export interface LoginRequest {
  emailOrUsername: string
  password: string
}


/**
 * 注册请求
 * POST /api/v1/auth/register
 * 
 * 说明: 新用户注册，需要邮箱验证码
 */
export interface RegisterRequest {
  username: string
  email: string
  password: string
  agreeTerms: boolean
  validateCode: string
}

/**
 * 注册和登录的响应（旧版本，已废弃）
 * @deprecated 使用 AuthNoRefreshTokenResponse 替代
 */
export interface AuthResponse {
  token:TokenPairResponse
  user: UserInfo
}
/**
 * 令牌对，包含accessToken和refreshToken，返回给前端自动调用刷新接口（旧版本）
 * @deprecated 后端不再返回 refreshToken 在 JSON 中，改为 HttpOnly Cookie
 */
export interface TokenPairResponse {
  accessToken: string
  refreshToken: string
  expiresIn: string | number  // 支持多种Jackson序列化格式
  refreshExpiresIn: string | number
}

/**
 * 登录/注册响应（新版本）
 *
 * 对应后端: AuthNoRefreshTokenResponse
 *
 * 特点：
 * - 不包含 refreshToken（已在 HttpOnly Cookie 中）
 * - 直接返回 accessToken、过期时间和用户信息
 */
export interface AuthNoRefreshTokenResponse {
  accessToken: string
  expiresIn: string | number  // java.time.Instant 的序列化格式
  userInfoResponse: UserInfo
}

/**
 * 刷新令牌响应（新版本）
 *
 * 对应后端: AuthAccessToken
 *
 * 特点：
 * - 只返回新的 accessToken 和过期时间
 * - refreshToken 已通过 HttpOnly Cookie 更新
 */
export interface AuthAccessToken {
  accessToken: string
  expireIn: string | number  // 注意：字段名是 expireIn（不是 expiresIn）
}
/**
 * 用户信息
 */
export interface UserInfo {
  id: string
  username: string
  academicId?: string
  email: string
  nickname?: string
  avatarUrl?: string
  school?: string
  bio?: string
  gender?: string  // 性别："男" | "女" | "未知"
  createdAt: string
}

/**
 * 登出
 * POST /api/v1/auth/logout
 * 
 * 说明: 使当前token失效
 * 认证: 需要 Bearer Token
 */
export interface LogoutOrRefreshRequest {
  refreshToken: string
}
export interface PasswordResetRequest {
  emailOrUsername: string
  password: string,
  newPassword: string,
  code: string
}

/**
 * 忘记密码请求（无需旧密码）
 * POST /api/v1/auth/forget/password
 * 
 * 说明: 用户忘记密码时，通过邮箱验证码重置密码
 */
export interface ForgetPasswordRequest {
  emailOrUsername: string
  code: string
  newPassword: string
}

/**
 * 删除账号请求（需要验证码确认）
 * DELETE /api/v1/user/profile/user/delete
 *
 * 对应后端: com.xiaoce.agent.user.domain.dto.UserDeletedRequest
 *
 * 说明: 用户删除自己的账号，需要邮箱/用户名 + 验证场景 + 验证码三重验证
 */
export interface DeleteAccountRequest {
  /** 邮箱或用户名 (对应后端 emailOrUserName) */
  emailOrUserName: string
  /** 验证码使用场景 (对应后端 ValidateCodeSendSceneEnums, 固定值 "DELETEACCOUNT") */
  scene: 'DELETEACCOUNT'
  /** 验证码 (对应后端 validateCode) */
  validateCode: string
}

/**
 * 发送验证码请求
 * POST /api/v1/auth/sendCode
 * 
 * 说明: 用于忘记密码或注册时发送验证码
 * scene 参数说明:
 * - "FORGETPASSWORD": 忘记密码场景
 * - "RESETPASSWORD": 重置密码场景（需要旧密码验证）
 * - "REGISTER": 注册场景
 */
export interface SendCodeRequest {
  emailOrUsername: string  // 邮箱或用户名
  scene: string            // 场景标识: "REGISTER" | "RESETPASSWORD" | "FORGETPASSWORD"
}

/**
 * 发送验证码响应
 */
export interface SendCodeResponse {
  emailOrUsername: string
  scene: string
  expireTime: number
}

/**
 * 更新用户资料请求
 * PATCH /api/v1/user/profile/update
 * 后端使用 Optional 包装字段，未修改的字段传 null
 */
export interface UpdateUserProfileRequest {
  nickname?: string | null
  avatarUrl?: string | null
  academicId?: string | null
  email?: string | null
  bio?: string | null
  gender?: string | null
  school?: string | null
  validateCode?: string | null
}

/**
 * 验证码验证结果
 */
export interface ValidateCodeResult {
  status: 'VALID' | 'INVALID' | 'EXPIRED'
  attemptCounts: number
  maxAttemptCounts: number
}



// ============================
// 会话管理 (Session Module)
// ============================

/**
 * 会话信息
 */
export interface SessionInfo {
  id: string
  title: string
  lastQuery: string
  messageCount: number
  paperCount: number
  createdAt: string
  updatedAt: string
  status: 'active' | 'archived'
  researchArea?: string
}

/**
 * 创建会话请求
 * POST /api/v1/sessions
 * 
 * 说明: 新建对话会话
 * 认证: 需要 Bearer Token
 */
export interface CreateSessionRequest {
  title?: string
  metadata?: Record<string, any>
}

/**
 * 创建会话响应
 */
export interface CreateSessionResponse {
  id: string
  title: string
  createdAt: string
}

/**
 * 获取会话列表
 * GET /api/v1/sessions
 * 
 * 查询参数:
 * - page: 页码 (默认 0)
 * - size: 每页大小 (默认 20)
 * - keyword: 搜索关键词 (可选)
 * 
 * 认证: 需要 Bearer Token
 */
export interface GetSessionsParams extends PaginationParams {
  keyword?: string
}

/**
 * 获取会话详情
 * GET /api/v1/sessions/{sessionId}
 * 
 * 说明: 获取会话内消息列表和关联文献
 * 认证: 需要 Bearer Token
 */
export interface SessionDetail {
  id: string
  title: string
  messages: ChatMessage[]
  relatedPapers: PaperSummary[]
  createdAt: string
  updatedAt: string
}

/**
 * 删除会话
 * DELETE /api/v1/sessions/{sessionId}
 * 
 * 认证: 需要 Bearer Token
 */

/**
 * 重命名会话
 * PUT /api/v1/sessions/{sessionId}/title
 * 
 * 认证: 需要 Bearer Token
 */
export interface UpdateSessionTitleRequest {
  title: string
}

// ============================
// 聊天与消息 (Chat Module)
// ============================

/**
 * 聊天消息
 */
export interface ChatMessage {
  id?: string
  role: 'USER' | 'ASSISTANT'
  content: string
  timestamp: number
  status?: 'sending' | 'sent' | 'read'
  papersFound?: number
  relatedPaperIds?: string[]
  metadata?: Record<string, any>
}

/**
 * RAG 对话请求
 * POST /api/v1/rag/chat
 * 
 * 说明: 发送消息并获取AI回复
 * 认证: 需要 Bearer Token
 */
export interface RagChatRequest {
  sessionId: string
  query: string
  history?: ChatMessage[]
  options?: {
    maxContextPapers?: number
    includeCitations?: boolean
    filters?: {
      baselineModel?: string
      yearGte?: number
      yearLte?: number
      researchArea?: string
    }
  }
}

/**
 * RAG 对话响应
 */
export interface RagChatResponse {
  messageId: string
  sessionId: string
  response: string
  relatedPapers: PaperSummary[]
  sources?: {
    paperId: string
    text: string
    page?: number
  }[]
}

/**
 * 文献摘要信息
 */
export interface PaperSummary {
  id: string
  title: string
  relevanceScore: number
  citation?: string
}

// ============================
// 检索任务 (Search Module)
// ============================

/**
 * 检索请求
 * POST /api/v1/search/tasks
 * 
 * 说明: 创建外网检索任务
 * 认证: 需要 Bearer Token
 */
export interface SearchRequest {
  query: string
  sessionId?: string
  options?: {
    yearRange?: {
      start: number
      end: number
    }
    minMatchScore?: number
    maxResults?: number
    sources?: string[]
  }
}

/**
 * 检索任务响应
 */
export interface SearchTaskResponse {
  taskId: string
  status: TaskStatus
  createdAt: string
}

/**
 * 任务状态枚举
 */
export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

/**
 * 查询任务进度
 * GET /api/v1/search/tasks/{taskId}
 * 
 * 查询参数:
 * - includePapers: 是否包含检索结果 (默认 false)
 * 
 * 认证: 需要 Bearer Token
 */
export interface TaskProgressResponse {
  taskId: string
  type: 'SEARCH' | 'DOWNLOAD' | 'VECTORIZATION'
  status: TaskStatus
  progress: number
  statusMessage: string
  result?: {
    papers: PaperInfo[]
    totalCount: number
    completedCount: number
  }
}

/**
 * 取消任务
 * DELETE /api/v1/search/tasks/{taskId}
 * 
 * 认证: 需要 Bearer Token
 */

/**
 * 获取检索历史
 * GET /api/v1/search/history
 * 
 * 查询参数:
 * - page: 页码 (默认 0)
 * - size: 每页大小 (默认 20)
 * - keyword: 搜索关键词
 * - status: 状态过滤 (completed/failed/running)
 * 
 * 认证: 需要 Bearer Token
 */
export interface GetSearchHistoryParams extends PaginationParams {
  keyword?: string
  status?: string
}

/**
 * 检索历史项
 */
export interface SearchHistoryItem {
  id: string
  keyword: string
  timestamp: number
  resultCount: number
  status: 'completed' | 'failed' | 'running'
  researchArea?: string
}

/**
 * 删除检索历史
 * DELETE /api/v1/search/history/{id}
 * 
 * 认证: 需要 Bearer Token
 */

/**
 * 清空检索历史
 * DELETE /api/v1/search/history
 * 
 * 认证: 需要 Bearer Token
 */

// ============================
// 文献管理 (Paper Module)
// ============================

/**
 * 文献信息
 */
export interface PaperInfo {
  id: string
  title: string
  authors: string[]
  year: number
  venue: string
  doi: string
  abstract: string
  matchScore: number
  downloadStatus: 'PENDING' | 'DOWNLOADING' | 'COMPLETED' | 'FAILED'
  filePath?: string
  fileSize?: number
  researchArea?: string
  baselineModel?: string
  technicalModules: string[]
  vectorized: boolean
  citationCount: number
  createdAt: string
  updatedAt: string
}

/**
 * 文献详情
 */
export interface PaperDetail extends PaperInfo {
  publicationDate: string
  keywords: string[]
  fullAbstract: string
  baselineComparison?: BaselineComparison[]
  implementationDetails?: ImplementationDetails
  openSourceUrl?: string
  userAnnotations?: UserAnnotations
}

/**
 * Baseline 对比表
 */
export interface BaselineComparison {
  modelName: string
  corePerformance: string
  testDataset: string
  year: number
  isHighlighted: boolean
}

/**
 * 实现细节
 */
export interface ImplementationDetails {
  coreInnovations: string[]
  technicalDetails: string[]
  openSourceCode: string
}

/**
 * 用户标注
 */
export interface UserAnnotations {
  notes?: string
  tags?: string[]
  rating?: number
  addedToComparison: boolean
}

/**
 * 获取文献列表
 * GET /api/v1/papers
 * 
 * 查询参数:
 * - researchArea: 研究领域 (模糊匹配)
 * - baselineModel: Baseline模型 (精确匹配)
 * - technicalModule: 技术模块
 * - yearGte: 年份 >=
 * - yearLte: 年份 <=
 * - downloadStatus: 下载状态
 * - vectorized: 是否已向量化
 * - keyword: 全文搜索
 * - page: 页码 (默认 0)
 * - size: 每页大小 (默认 20)
 * - sort: 排序字段
 * 
 * 认证: 需要 Bearer Token
 */
export interface GetPapersParams extends PaginationParams {
  researchArea?: string
  baselineModel?: string
  technicalModule?: string
  yearGte?: number
  yearLte?: number
  downloadStatus?: string
  vectorized?: boolean
  keyword?: string
}

/**
 * 获取文献详情
 * GET /api/v1/papers/{paperId}
 * 
 * 查询参数:
 * - includeBaselineTable: 是否包含Baseline对比表 (默认 false)
 * 
 * 认证: 需要 Bearer Token
 */

/**
 * 下载文献
 * POST /api/v1/papers/{paperId}/download
 * 
 * 说明: 触发PDF下载任务
 * 认证: 需要 Bearer Token
 */
export interface DownloadPaperResponse {
  taskId: string
  status: TaskStatus
}

/**
 * 获取PDF文件
 * GET /api/v1/papers/{paperId}/file
 * 
 * 说明: 返回PDF文件流
 * 响应类型: application/pdf
 * 认证: 需要 Bearer Token
 */

/**
 * 导出引用
 * GET /api/v1/papers/{paperId}/citation
 * 
 * 查询参数:
 * - format: 引用格式 (bibtex/apa/mla/chicago)
 * 
 * 认证: 需要 Bearer Token
 */
export interface ExportCitationResponse {
  format: string
  content: string
}

/**
 * 获取最近下载（侧边栏用）
 * GET /api/v1/papers/recent
 * 
 * 查询参数:
 * - limit: 返回数量 (默认 10)
 * 
 * 认证: 需要 Bearer Token
 */
export interface RecentPaper {
  id: string
  title: string
  authors: string
  year: number
  downloadStatus: string
  progress: number
  matchScore: number
  downloadedAt: string | null
}

/**
 * 删除文献
 * DELETE /api/v1/papers/{paperId}
 * 
 * 认证: 需要 Bearer Token
 */

// ============================
// 用户设置 (Settings Module)
// ============================

/**
 * 用户设置
 */
export interface UserSettings {
  username: string
  nickname: string
  email: string
  academicId: string
  gender: string
  school: string
  bio: string
  yearRangeStart: number
  yearRangeEnd: number
  minMatchScore: number
  maxResults: number
  sources: string[]
  maxContextPapers: number
  includeCitations: boolean
  autoCollapseSidebar: boolean
}

/**
 * AI RAG 配置响应（后端返回，API Key 已脱敏）
 */
export interface AiRAGConfigResponse {
  modelProvider: number
  modelName: string
  maxContextPapers: number
  responseLengthLimit: number
  maskedApiKey: string | null    // 脱敏后的 API Key：sk-****xxxx
  hasApiKey: boolean            // 是否已设置 API Key
  citationFormat: number
  citationFormatName: string
  includeCitation: boolean
}

/**
 * AI RAG 配置请求（前端发送，支持部分更新 Patch）
 * 所有字段均为可选，只有传入的字段才会更新
 */
export interface AiRAGConfigRequest {
  modelProvider?: number        // 1-DeepSeek, 2-Tongyi
  maxContextPapers?: number      // 1-10
  responseLengthLimit?: number   // 100-10000
  apiKey?: string               // 明文 API Key（不传则不更新）
  citationFormat?: number       // 1-APA, 2-MLA, 3-Chicago, 4-IEEE
  includeCitation?: boolean      // true/false
}

/**
 * 获取用户设置
 * GET /api/v1/settings
 * 
 * 认证: 需要 Bearer Token
 */

/**
 * 更新用户设置
 * PUT /api/v1/settings
 * 
 * 认证: 需要 Bearer Token
 */

/**
 * 清除缓存
 * POST /api/v1/settings/clear-cache
 * 
 * 认证: 需要 Bearer Token
 */

/**
 * 重置设置
 * POST /api/v1/settings/reset
 * 
 * 认证: 需要 Bearer Token
 */

/**
 * 删除账户
 * DELETE /api/v1/settings/account
 * 
 * 认证: 需要 Bearer Token
 */

// ============================
// 错误码定义
// ============================

export const ErrorCodes = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
} as const

export interface ApiError {
  code: number
  message: string
  details?: Record<string, string[]>
}
