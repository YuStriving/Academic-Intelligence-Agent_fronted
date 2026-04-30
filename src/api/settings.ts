/**
 * 用户设置API
 * 
 * 后端实现参照：
 * - GET  /api/v1/user/profile/AIRAG        - 获取 AI RAG 配置
 * - PATCH /api/v1/user/profile/AIRAG/update - 更新 AI RAG 配置（部分更新）
 * - GET  /api/v1/settings                   - 获取用户设置
 * - PUT  /api/v1/settings                  - 更新用户设置
 * - POST /api/v1/settings/clear-cache       - 清除缓存
 * - POST /api/v1/settings/reset             - 重置设置到默认值
 * - DELETE /api/v1/settings/account         - 删除账户
 */

import { http } from './client'
import type { UserSettings, AiRAGConfigResponse, AiRAGConfigRequest } from './types'

export const settingsApi = {
  // ==================== AI RAG 配置 ====================

  /**
   * 获取 AI RAG 配置
   * GET /api/v1/user/profile/AIRAG
   */
  getAiRAGConfig(): Promise<AiRAGConfigResponse> {
    return http.get<AiRAGConfigResponse>('/api/v1/user/profile/AIRAG')
  },

  /**
   * 更新 AI RAG 配置（部分更新/Patch）
   * PATCH /api/v1/user/profile/AIRAG/update
   * 
   * @param data 需要更新的配置项（可选字段，只传需要修改的）
   * 
   * @example
   * // 只更新大模型
   * updateAiRAGConfig({ modelProvider: 2 })
   * 
   * // 只更新 API Key
   * updateAiRAGConfig({ apiKey: 'sk-xxxxx' })
   * 
   * // 同时更新多个字段
   * updateAiRAGConfig({
   *   modelProvider: 1,
   *   maxContextPapers: 5,
   *   includeCitation: true
   * })
   */
  updateAiRAGConfig(data: Partial<AiRAGConfigRequest>): Promise<AiRAGConfigResponse> {
    return http.patch<AiRAGConfigResponse>('/api/v1/user/profile/AIRAG/update', data)
  },

  // ==================== 用户基础设置 ====================

  /**
   * 获取用户设置
   * GET /api/v1/settings
   */
  getSettings(): Promise<UserSettings> {
    return http.get<UserSettings>('/api/v1/settings')
  },

  /**
   * 更新用户设置
   * PUT /api/v1/settings
   */
  updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
    return http.put<UserSettings>('/api/v1/settings', data)
  },

  /**
   * 清除缓存
   * POST /api/v1/settings/clear-cache
   */
  clearCache(): Promise<void> {
    return http.post<void>('/api/v1/settings/clear-cache')
  },

  /**
   * 重置设置到默认值
   * POST /api/v1/settings/reset
   */
  resetSettings(): Promise<UserSettings> {
    return http.post<UserSettings>('/api/v1/settings/reset')
  },

  /**
   * 删除账户
   * DELETE /api/v1/settings/account
   */
  deleteAccount(): Promise<void> {
    return http.delete<void>('/api/v1/settings/account')
  },
}
