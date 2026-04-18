import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  SearchHistoryItem,
  SearchHistorySort,
  getSearchHistory,
  saveSearchHistory,
  addSearchHistory as addHistoryItem,
  removeSearchHistoryItem,
  clearAllSearchHistory,
  updateSearchHistoryItem,
  sortSearchHistory,
} from '../utils/searchHistory'

export const useSearchHistoryStore = defineStore('searchHistory', () => {
  const items = ref<SearchHistoryItem[]>(getSearchHistory())
  const isSidebarOpen = ref(false)
  const sort = ref<SearchHistorySort>({ field: 'date', order: 'desc' })
  const searchKeyword = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const filteredAndSortedItems = computed(() => {
    let result = [...items.value]

    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(item =>
        item.keyword.toLowerCase().includes(keyword) ||
        item.researchArea?.toLowerCase().includes(keyword)
      )
    }

    return sortSearchHistory(result, sort.value)
  })

  const totalCount = computed(() => items.value.length)

  function openSidebar() {
    isSidebarOpen.value = true
  }

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function setSort(newSort: SearchHistorySort) {
    sort.value = newSort
  }

  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }

  async function loadHistory() {
    isLoading.value = true
    error.value = null
    try {
      items.value = getSearchHistory()
    } catch (e) {
      error.value = '加载历史记录失败'
    } finally {
      isLoading.value = false
    }
  }

  function addHistory(data: Omit<SearchHistoryItem, 'id' | 'timestamp'> & { keyword: string }) {
    const newItem = addHistoryItem(data)
    items.value.unshift(newItem)
    return newItem
  }

  async function removeHistory(id: string) {
    removeSearchHistoryItem(id)
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  async function clearAll() {
    clearAllSearchHistory()
    items.value = []
  }

  function updateHistory(id: string, updates: Partial<SearchHistoryItem>) {
    updateSearchHistoryItem(id, updates)
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates }
    }
  }

  function reSearch(item: SearchHistoryItem) {
    console.log('重新搜索:', item.keyword)
  }

  return {
    items,
    isSidebarOpen,
    sort,
    searchKeyword,
    isLoading,
    error,
    filteredAndSortedItems,
    totalCount,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    setSort,
    setSearchKeyword,
    loadHistory,
    addHistory,
    removeHistory,
    clearAll,
    updateHistory,
    reSearch,
  }
})
