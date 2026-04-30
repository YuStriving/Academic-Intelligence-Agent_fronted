/**
 * 文献管理API
 * 
 * 后端实现参照：
 * - GET    /api/v1/papers
 * - GET    /api/v1/papers/{paperId}
 * - POST   /api/v1/papers/{paperId}/download
 * - GET    /api/v1/papers/{paperId}/file
 * - GET    /api/v1/papers/{paperId}/citation
 * - GET    /api/v1/papers/recent
 * - DELETE /api/v1/papers/{paperId}
 */

import { http } from './client'
import type {
  PaperInfo,
  PaperDetail,
  GetPapersParams,
  PageResponse,
  DownloadPaperResponse,
  ExportCitationResponse,
  RecentPaper,
} from './types'

export const paperApi = {
  /**
   * 获取文献列表（分页+过滤）
   * GET /api/v1/papers?researchArea=xxx&baselineModel=xxx&page=0&size=20
   */
  getPapers(params?: GetPapersParams): Promise<PageResponse<PaperInfo>> {
    return http.get<PageResponse<PaperInfo>>('/api/v1/papers', { params })
  },

  /**
   * 获取文献详情
   * GET /api/v1/papers/{paperId}?includeBaselineTable=false
   */
  getPaperDetail(paperId: string, includeBaselineTable = false): Promise<PaperDetail> {
    return http.get<PaperDetail>(`/api/v1/papers/${paperId}`, {
      params: { includeBaselineTable },
    })
  },

  /**
   * 触发文献下载
   * POST /api/v1/papers/{paperId}/download
   * 
   * 说明: 创建下载任务，返回taskId用于轮询进度
   */
  downloadPaper(paperId: string): Promise<DownloadPaperResponse> {
    return http.post<DownloadPaperResponse>(`/api/v1/papers/${paperId}/download`)
  },

  /**
   * 获取PDF文件
   * GET /api/v1/papers/{paperId}/file
   * 
   * 说明: 返回PDF文件二进制流
   * 使用方式: 在iframe/PDF.js组件中使用blob URL
   */
  getPaperFile(paperId: string): Promise<Blob> {
    return http.get<Blob>(`/api/v1/papers/${paperId}/file`, {
      responseType: 'blob',
    })
  },

  /**
   * 导出引用格式
   * GET /api/v1/papers/{paperId}/citation?format=bibtex
   * 
   * 支持格式: bibtex, apa, mla, chicago
   */
  exportCitation(paperId: string, format: string): Promise<ExportCitationResponse> {
    return http.get<ExportCitationResponse>(`/api/v1/papers/${paperId}/citation`, {
      params: { format },
    })
  },

  /**
   * 获取最近下载（侧边栏用）
   * GET /api/v1/papers/recent?limit=10
   */
  getRecentPapers(limit = 10): Promise<RecentPaper[]> {
    return http.get<RecentPaper[]>('/api/v1/papers/recent', { params: { limit } })
  },

  /**
   * 删除文献
   * DELETE /api/v1/papers/{paperId}
   */
  deletePaper(paperId: string): Promise<void> {
    return http.delete<void>(`/api/v1/papers/${paperId}`)
  },
}
