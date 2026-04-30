/**
 * 用户配置 API 封装
 *
 * 对接后端:
 * - GET /api/v1/user/profile/retrieve  获取检索偏好
 * - PATCH /api/v1/user/profile/preferences/update  更新检索偏好
 */

import { http } from './client'
import type {
  UserRetrieveResponseRaw,
  UserRetrieveRequestRaw,
  UserSearchConfig,
} from '../types/userConfig'
import {
  parseSourceFlags,
  parseSortEnum,
  parseDocTypeEnum,
} from '../types/userConfig'

// ==================== API 接口定义 ====================

export interface UserPreferencesAPI {
  /**
   * 获取用户检索偏好配置
   * GET /api/v1/user/profile/retrieve
   */
  getSearchPreferences(): Promise<UserSearchConfig>

  /**
   * 更新用户检索偏好配置（部分更新）
   * PATCH /api/v1/user/profile/preferences/update
   *
   * @param request 更新请求体（只包含修改的字段，未修改的字段为 null）
   * @returns 更新后的配置
   */
  updateSearchPreferences(request: UserRetrieveRequestRaw): Promise<UserSearchConfig>
}

// ==================== API 实现 ====================

/**
 * 转换后端原始响应为前端标准格式
 */
function transformResponse(raw: UserRetrieveResponseRaw): UserSearchConfig {
  return {
    userId: raw.userid,

    // 检索偏好设置
    yearRangeStart: raw.yearStart ?? 2020,
    yearRangeEnd: raw.yearEnd ?? 2026,
    maxResults: raw.maxResults ?? 5,
    minMatchScore: raw.matchScore ?? 70,

    // 位图 → 数组转换
    searchSources: parseSourceFlags(raw.sourceFlags ?? 7),

    // 枚举解析（支持多种格式）
    defaultSort: parseSortEnum(raw.defaultSort),
    paperType: parseDocTypeEnum(raw.docType),
  }
}

export const userPreferencesApi: UserPreferencesAPI = {
  /**
   * 获取用户检索偏好
   *
   * @returns 标准化的前端配置对象
   *
   * @example
   * ```typescript
   * const config = await userPreferencesApi.getSearchPreferences()
   * console.log(config.searchSources) // ["google_scholar", "arxiv"]
   * console.log(config.defaultSort)    // "relevance"
   * ```
   */
  async getSearchPreferences(): Promise<UserSearchConfig> {
    // 调用后端API
    // 完整路径: GET /api/v1/user/profile/retrieve
    const rawData = await http.get<UserRetrieveResponseRaw>(
      '/api/v1/user/profile/retrieve'  // ✅ 修正：添加正确的API前缀
    )

    console.log('[UserConfig] Raw response from server:', rawData)

    // 转换为前端友好格式
    const config = transformResponse(rawData as unknown as UserRetrieveResponseRaw)

    console.log('[UserConfig] Transformed config:', config)

    return config
  },

  /**
   * 更新用户检索偏好（部分更新）
   *
   * @param request 更新请求体，只包含修改的字段
   * @returns 更新后的完整配置
   *
   * @example
   * ```typescript
   * const request = {
   *   yearStart: 2021,        // 修改了起始年份
   *   defaultSort: 'NEWEST',  // 修改了排序方式
   *   yearEnd: null,          // 未修改结束年份
   *   // ... 其他字段同理
   * }
   * const updatedConfig = await userPreferencesApi.updateSearchPreferences(request)
   * ```
   */
  async updateSearchPreferences(request: UserRetrieveRequestRaw): Promise<UserSearchConfig> {
    console.log('[UserConfig] Sending update request:', request)

    // 调用后端更新接口
    // 完整路径: PATCH /api/v1/user/profile/preferences/update
    const rawData = await http.patch<UserRetrieveResponseRaw>(
      '/api/v1/user/profile/retrieve/update',
      request
    )

    console.log('[UserConfig] Update response from server:', rawData)

    // 将后端响应转换为前端格式
    const updatedConfig = transformResponse(rawData as unknown as UserRetrieveResponseRaw)

    console.log('[UserConfig] Updated config:', updatedConfig)

    return updatedConfig
  },
}

export default userPreferencesApi
