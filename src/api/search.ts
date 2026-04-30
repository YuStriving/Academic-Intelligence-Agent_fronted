/**
 * 检索任务API
 * 
 * 后端实现参照：
 * - POST   /api/v1/search/tasks
 * - GET    /api/v1/search/tasks/{taskId}
 * - DELETE /api/v1/search/tasks/{taskId}
 * - GET    /api/v1/search/history
 * - DELETE /api/v1/search/history/{id}
 * - DELETE /api/v1/search/history
 */

import { http } from './client'
import type {
  SearchRequest,
  SearchTaskResponse,
  TaskProgressResponse,
  GetSearchHistoryParams,
  SearchHistoryItem,
  PageResponse,
} from './types'

export const searchApi = {
  /**
   * 创建检索任务
   * POST /api/v1/search/tasks
   * 
   * 说明: 提交检索请求，立即返回taskId
   * 前端需要轮询 GET /api/v1/search/tasks/{taskId} 获取进度
   */
  createSearchTask(data: SearchRequest): Promise<SearchTaskResponse> {
    return http.post<SearchTaskResponse>('/api/v1/search/tasks', data)
  },

  /**
   * 查询任务进度
   * GET /api/v1/search/tasks/{taskId}?includePapers=false
   * 
   * 说明: 轮询获取任务执行进度和结果
   * 参数 includePapers=true 时返回完整文献列表
   */
  getTaskProgress(taskId: string, includePapers = false): Promise<TaskProgressResponse> {
    return http.get<TaskProgressResponse>(`/api/v1/search/tasks/${taskId}`, {
      params: { includePapers },
    })
  },

  /**
   * 取消任务
   * DELETE /api/v1/search/tasks/{taskId}
   */
  cancelTask(taskId: string): Promise<void> {
    return http.delete<void>(`/api/v1/search/tasks/${taskId}`)
  },

  /**
   * 获取检索历史
   * GET /api/v1/search/history?page=0&size=20&keyword=xxx&status=completed
   */
  getSearchHistory(params?: GetSearchHistoryParams): Promise<PageResponse<SearchHistoryItem>> {
    return http.get<PageResponse<SearchHistoryItem>>('/api/v1/search/history', { params })
  },

  /**
   * 删除检索历史
   * DELETE /api/v1/search/history/{id}
   */
  deleteSearchHistory(id: string): Promise<void> {
    return http.delete<void>(`/api/v1/search/history/${id}`)
  },

  /**
   * 清空检索历史
   * DELETE /api/v1/search/history
   */
  clearSearchHistory(): Promise<void> {
    return http.delete<void>('/api/v1/search/history')
  },
}
