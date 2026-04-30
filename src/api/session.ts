/**
 * 会话管理API
 * 
 * 后端实现参照：
 * - POST   /api/v1/sessions
 * - GET    /api/v1/sessions
 * - GET    /api/v1/sessions/{id}
 * - DELETE /api/v1/sessions/{id}
 * - PUT    /api/v1/sessions/{id}/title
 */

import { http } from './client'
import type {
  SessionInfo,
  CreateSessionRequest,
  CreateSessionResponse,
  SessionDetail,
  GetSessionsParams,
  UpdateSessionTitleRequest,
  PageResponse,
} from './types'

export const sessionApi = {
  /**
   * 创建新会话
   * POST /api/v1/sessions
   */
  createSession(data: CreateSessionRequest): Promise<CreateSessionResponse> {
    return http.post<CreateSessionResponse>('/api/v1/sessions', data)
  },

  /**
   * 获取会话列表（分页）
   * GET /api/v1/sessions?page=0&size=20&keyword=xxx
   */
  getSessions(params?: GetSessionsParams): Promise<PageResponse<SessionInfo>> {
    return http.get<PageResponse<SessionInfo>>('/api/v1/sessions', { params })
  },

  /**
   * 获取会话详情
   * GET /api/v1/sessions/{id}
   */
  getSessionDetail(sessionId: string): Promise<SessionDetail> {
    return http.get<SessionDetail>(`/api/v1/sessions/${sessionId}`)
  },

  /**
   * 删除会话
   * DELETE /api/v1/sessions/{id}
   */
  deleteSession(sessionId: string): Promise<void> {
    return http.delete<void>(`/api/v1/sessions/${sessionId}`)
  },

  /**
   * 重命名会话
   * PUT /api/v1/sessions/{id}/title
   */
  updateSessionTitle(sessionId: string, data: UpdateSessionTitleRequest): Promise<void> {
    return http.put<void>(`/api/v1/sessions/${sessionId}/title`, data)
  },
}
