export interface SearchHistoryItem {
  id: string
  keyword: string
  timestamp: number
  resultCount: number
  status: 'completed' | 'failed' | 'running'
  researchArea?: string
}

export type SortField = 'date' | 'frequency'
export type SortOrder = 'asc' | 'desc'

export interface SearchHistorySort {
  field: SortField
  order: SortOrder
}

const STORAGE_KEY = 'academic_search_history'
const MAX_HISTORY_COUNT = 100

export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as SearchHistoryItem[]
  } catch {
    return []
  }
}

export function saveSearchHistory(history: SearchHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_COUNT)))
  } catch {
    console.error('Failed to save search history to localStorage')
  }
}

export function addSearchHistory(item: Omit<SearchHistoryItem, 'id' | 'timestamp'> & { keyword: string }): SearchHistoryItem {
  const history = getSearchHistory()
  const newItem: SearchHistoryItem = {
    ...item,
    id: generateId(),
    timestamp: Date.now(),
  }
  history.unshift(newItem)
  saveSearchHistory(history)
  return newItem
}

export function removeSearchHistoryItem(id: string): void {
  const history = getSearchHistory()
  const filtered = history.filter(item => item.id !== id)
  saveSearchHistory(filtered)
}

export function clearAllSearchHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function updateSearchHistoryItem(id: string, updates: Partial<SearchHistoryItem>): void {
  const history = getSearchHistory()
  const index = history.findIndex(item => item.id === id)
  if (index !== -1) {
    history[index] = { ...history[index], ...updates }
    saveSearchHistory(history)
  }
}

export function sortSearchHistory(history: SearchHistoryItem[], sort: SearchHistorySort): SearchHistoryItem[] {
  const sorted = [...history]
  const multiplier = sort.order === 'asc' ? 1 : -1

  sorted.sort((a, b) => {
    if (sort.field === 'date') {
      return multiplier * (a.timestamp - b.timestamp)
    } else if (sort.field === 'frequency') {
      return multiplier * (a.resultCount - b.resultCount)
    }
    return 0
  })

  return sorted
}

function generateId(): string {
  return `search-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
