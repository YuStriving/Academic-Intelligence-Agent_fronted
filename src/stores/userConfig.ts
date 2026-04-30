/**
 * 用户配置 Store (Pinia)
 *
 * 功能：
 * 1. 管理用户检索偏好配置
 * 2. 从服务器加载配置
 * 3. 本地缓存（localStorage）
 * 4. 提供响应式状态供组件使用
 *
 * 使用方式：
 * ```typescript
 * const configStore = useUserConfigStore()
 * await configStore.loadConfig()
 * console.log(configStore.config.defaultSort) // "relevance"
 * ```
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userPreferencesApi } from '../api/userPreferences'
import type {
  UserSearchConfig,
  SearchSource,
  SortOption,
  DocTypeOption,
} from '../types/userConfig'
import {
  toSourceFlags,
  SORT_OPTIONS,
  DOC_TYPE_OPTIONS,
} from '../types/userConfig'

// ==================== 默认配置常量 ====================

const DEFAULT_CONFIG: UserSearchConfig = {
  yearRangeStart: 2020,
  yearRangeEnd: 2026,
  maxResults: 5,
  minMatchScore: 70,
  searchSources: ['google_scholar'],
  defaultSort: 'relevance',
  paperType: 'all',
}

// localStorage 存储键名
const STORAGE_KEY = 'user-search-config'

// ==================== Store 定义 ====================

export const useUserConfigStore = defineStore('userConfig', () => {
  // ==================== 状态 (State) ====================

  /**
   * 配置数据
   */
  const config = ref<UserSearchConfig>({ ...DEFAULT_CONFIG })

  /**
   * 加载状态
   */
  const isLoading = ref(false)

  /**
   * 错误信息
   */
  const error = ref<string | null>(null)

  /**
   * 最后加载时间
   */
  const lastLoadedAt = ref<Date | null>(null)

  // ==================== 计算属性 (Getters) ====================

  /**
   * 是否已从服务器加载过配置
   */
  const isLoaded = computed(() => lastLoadedAt.value !== null)

  /**
   * 检索源是否包含指定源
   */
  const hasSource = computed(() => {
    return (source: SearchSource) => config.value.searchSources.includes(source)
  })

  /**
   * 获取当前排序选项的显示名称
   */
  const sortLabel = computed(() => {
    return SORT_OPTIONS.find(opt => opt.value === config.value.defaultSort)?.label ?? '相关度'
  })

  /**
   * 获取当前文献类型的显示名称
   */
  const docTypeLabel = computed(() => {
    return DOC_TYPE_OPTIONS.find(opt => opt.value === config.value.paperType)?.label ?? '全部类型'
  })

  // ==================== 操作 (Actions) ====================

  /**
   * 从服务器加载配置
   *
   * 流程：
   * 1. 调用 GET /api/v1/user/profile/retrieve
   * 2. 转换为前端格式
   * 3. 更新store状态
   * 4. 缓存到localStorage
   */
  async function loadConfig(): Promise<void> {
    if (isLoading.value) {
      console.log('[UserConfig] Already loading, skipping...')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      console.log('[UserConfig] Loading config from server...')

      // 从API获取配置
      const serverConfig = await userPreferencesApi.getSearchPreferences()

      // 更新状态
      config.value = serverConfig
      lastLoadedAt.value = new Date()

      // 缓存到localStorage
      saveToLocalStorage()

      console.log('[UserConfig] Config loaded successfully:', config.value)
    } catch (err: any) {
      error.value = err.message || 'Failed to load config'
      console.error('[UserConfig] Failed to load config:', err)

      // 如果服务器失败，尝试从本地缓存恢复
      restoreFromLocalStorage()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新配置（部分更新）
   *
   * @param partial 要更新的字段
   *
   * @example
   * ```typescript
   * configStore.updateConfig({
   *   maxResults: 10,
   *   defaultSort: 'date_desc'
   * })
   * ```
   */
  function updateConfig(partial: Partial<UserSearchConfig>): void {
    Object.assign(config.value, partial)
    saveToLocalStorage()
    console.log('[UserConfig] Config updated:', partial)
  }

  /**
   * 设置检索源列表
   *
   * @param sources 检索源数组
   */
  function setSearchSources(sources: SearchSource[]): void {
    config.value.searchSources = sources
    saveToLocalStorage()
  }

  /**
   * 切换单个检索源的选中状态
   *
   * @param source 检索源
   */
  function toggleSearchSource(source: SearchSource): void {
    const index = config.value.searchSources.indexOf(source)
    if (index >= 0) {
      // 已选中，移除
      config.value.searchSources.splice(index, 1)
    } else {
      // 未选中，添加
      config.value.searchSources.push(source)
    }
    saveToLocalStorage()
  }

  /**
   * 设置排序方式
   *
   * @param sort 排序选项
   */
  function setDefaultSort(sort: SortOption): void {
    config.value.defaultSort = sort
    saveToLocalStorage()
  }

  /**
   * 设置文献类型
   *
   * @param docType 文献类型选项
   */
  function setDocType(docType: DocTypeOption): void {
    config.value.paperType = docType
    saveToLocalStorage()
  }

  /**
   * 重置为默认配置
   */
  function resetToDefault(): void {
    config.value = { ...DEFAULT_CONFIG }
    saveToLocalStorage()
    console.log('[UserConfig] Reset to default config')
  }

  /**
   * 清除所有数据（登出时调用）
   */
  function clear(): void {
    config.value = { ...DEFAULT_CONFIG }
    lastLoadedAt.value = null
    error.value = null
    localStorage.removeItem(STORAGE_KEY)
    console.log('[UserConfig] All data cleared')
  }

  // ==================== 私有方法 ====================

  /**
   * 保存到localStorage
   */
  function saveToLocalStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
    } catch (err) {
      console.error('[UserConfig] Failed to save to localStorage:', err)
    }
  }

  /**
   * 从localStorage恢复
   */
  function restoreFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UserSearchConfig
        config.value = { ...DEFAULT_CONFIG, ...parsed }
        console.log('[UserConfig] Restored from localStorage')
      }
    } catch (err) {
      console.error('[UserConfig] Failed to restore from localStorage:', err)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  /**
   * 初始化时尝试从localStorage恢复
   */
  function initFromCache(): void {
    restoreFromLocalStorage()
  }

  // 初始化：尝试从缓存恢复
  initFromCache()

  // ==================== 返回公共接口 ====================

  return {
    // State
    config,
    isLoading,
    error,
    lastLoadedAt,

    // Getters
    isLoaded,
    hasSource,
    sortLabel,
    docTypeLabel,

    // Actions
    loadConfig,
    updateConfig,
    setSearchSources,
    toggleSearchSource,
    setDefaultSort,
    setDocType,
    resetToDefault,
    clear,
  }
})
