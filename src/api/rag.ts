/**
 * RAG对话API
 * 
 * 后端实现参照：
 * - POST /api/v1/rag/chat
 */

import { http } from './client'
import type {
  RagChatRequest,
  RagChatResponse,
} from './types'

export const ragApi = {
  /**
   * 发送对话消息
   * POST /api/v1/rag/chat
   *
   * 说明: 发送用户问题，获取 JSON 格式的 AI 回复
   */
  chat(data: RagChatRequest): Promise<RagChatResponse> {
    return http.post<RagChatResponse>('/api/v1/rag/chat', data)
  },
}
