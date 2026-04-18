<template>
  <Teleport to="body">
    <div
      v-if="store.isSidebarOpen"
      class="fixed inset-0 z-50 flex justify-end"
      @click.self="handleClose"
    >
      <div
        class="absolute inset-0 bg-black/40 transition-opacity duration-300"
        @click="handleClose"
      ></div>

      <aside
        class="relative w-[380px] h-full bg-[#1a2538] text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out"
        :class="store.isSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex items-center justify-between px-5 py-4 border-b border-[#2d4059]">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <h2 class="text-base font-semibold tracking-wide">Search History</h2>
            <span class="px-2 py-0.5 bg-[#2d4059] text-xs text-gray-300 rounded-full">{{ store.totalCount }}</span>
          </div>
          <button
            class="p-1.5 text-gray-400 hover:text-white hover:bg-[#243347] rounded-lg transition-colors"
            @click="handleClose"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="px-4 py-3 border-b border-[#2d4059] space-y-3">
          <div class="flex items-center gap-2 px-3 py-2 bg-[#243347] rounded-lg border border-transparent focus-within:border-[#2d4059] transition-colors">
            <svg class="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              v-model="searchInput"
              type="text"
              placeholder="搜索历史记录..."
              class="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              @input="handleSearch"
            />
          </div>

          <div class="flex items-center gap-2">
            <select
              v-model="currentSortField"
              class="flex-1 px-3 py-2 bg-[#243347] border border-transparent rounded-lg text-xs text-gray-300 outline-none cursor-pointer hover:border-[#2d4059] focus:border-[#2d4059] transition-colors appearance-none"
              @change="handleSort"
            >
              <option value="date">按时间排序</option>
              <option value="frequency">按结果数排序</option>
            </select>
            <button
              class="p-2 bg-[#243347] border border-transparent rounded-lg text-gray-400 hover:text-white hover:border-[#2d4059] transition-colors"
              :title="currentSortOrder === 'desc' ? '降序' : '升序'"
              @click="toggleSortOrder"
            >
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="currentSortOrder === 'asc' ? 'rotate-180' : ''"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-3">
          <div v-if="store.isLoading" class="flex flex-col items-center justify-center py-12">
            <div class="w-8 h-8 border-2 border-gray-500 border-t-green-400 rounded-full animate-spin"></div>
            <p class="text-sm text-gray-500 mt-3">加载中...</p>
          </div>

          <div v-else-if="store.error" class="flex flex-col items-center justify-center py-12 text-center">
            <svg class="w-10 h-10 text-red-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="text-sm text-red-400">{{ store.error }}</p>
            <button class="mt-3 px-3 py-1.5 bg-[#243347] text-sm text-gray-300 rounded-lg hover:bg-[#2d4059] transition-colors" @click="handleRetry">
              重试
            </button>
          </div>

          <div v-else-if="store.filteredAndSortedItems.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <svg class="w-12 h-12 text-gray-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <p class="text-sm text-gray-500 font-medium">{{ searchKeyword ? '未找到匹配的记录' : '暂无搜索历史' }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ searchKeyword ? '尝试其他关键词' : '开始新的搜索以积累历史' }}</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="item in store.filteredAndSortedItems"
              :key="item.id"
              class="group px-3 py-3 bg-[#243347] hover:bg-[#2d4059] rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-[#2d4059]"
              @click="handleReSearch(item)"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <p class="text-sm text-white leading-snug flex-1 truncate">{{ item.keyword }}</p>
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0"
                  :class="statusClass(item.status)"
                >
                  {{ statusText(item.status) }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ item.resultCount }} 篇
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ formatRelativeTime(item.timestamp) }}
                  </span>
                </div>

                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    class="p-1 text-gray-500 hover:text-blue-400 hover:bg-[#1a2538] rounded transition-colors"
                    title="重新搜索"
                    @click.stop="handleReSearch(item)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-.492-9.644a9.973 9.973 0 016.053-2.018m0 0a9.973 9.973 0 016.053 2.018M7.973 4.358a9.973 9.973 0 00-2.018 6.053m0 0a9.973 9.973 0 002.018 6.053" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    class="p-1 text-gray-500 hover:text-red-400 hover:bg-[#1a2538] rounded transition-colors"
                    title="删除"
                    @click.stop="handleDelete(item)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="item.researchArea" class="mt-2 flex items-center">
                <span class="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded">{{ item.researchArea }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-3 border-t border-[#2d4059]">
          <button
            class="w-full px-4 py-2.5 bg-red-500/10 text-red-400 text-sm rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="store.totalCount === 0"
            @click="handleShowClearConfirm"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            清空全部历史
          </button>
        </div>
      </aside>
    </div>

    <Teleport to="body">
      <div
        v-if="showClearConfirm"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="handleCancelClear"
      >
        <div class="absolute inset-0 bg-black/60" @click="handleCancelClear"></div>

        <div class="relative bg-[#1a2538] rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all duration-300 scale-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-white">确认清空</h3>
              <p class="text-xs text-gray-500 mt-0.5">此操作不可恢复</p>
            </div>
          </div>

          <p class="text-sm text-gray-400 mb-6">
            确定要清空所有 {{ store.totalCount }} 条搜索历史吗？删除后将无法恢复。
          </p>

          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 bg-[#243347] text-gray-300 text-sm rounded-lg hover:bg-[#2d4059] transition-colors"
              @click="handleCancelClear"
            >
              取消
            </button>
            <button
              class="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              @click="handleConfirmClear"
            >
              确认清空
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSearchHistoryStore } from '../stores/searchHistory'
import type { SearchHistoryItem, SortField, SortOrder } from '../utils/searchHistory'

const store = useSearchHistoryStore()
const searchInput = ref('')
const currentSortField = ref<SortField>('date')
const currentSortOrder = ref<SortOrder>('desc')
const showClearConfirm = ref(false)

const searchKeyword = ref('')

function handleClose() {
  store.closeSidebar()
}

function handleSearch() {
  store.setSearchKeyword(searchInput.value)
}

function handleSort() {
  store.setSort({ field: currentSortField.value, order: currentSortOrder.value })
}

function toggleSortOrder() {
  currentSortOrder.value = currentSortOrder.value === 'desc' ? 'asc' : 'desc'
  handleSort()
}

function handleRetry() {
  store.loadHistory()
}

function handleReSearch(item: SearchHistoryItem) {
  store.reSearch(item)
}

async function handleDelete(item: SearchHistoryItem) {
  await store.removeHistory(item.id)
}

function handleShowClearConfirm() {
  showClearConfirm.value = true
}

function handleCancelClear() {
  showClearConfirm.value = false
}

async function handleConfirmClear() {
  await store.clearAll()
  showClearConfirm.value = false
}

function statusClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-400'
    case 'failed':
      return 'bg-red-500/10 text-red-400'
    case 'running':
      return 'bg-blue-500/10 text-blue-400'
    default:
      return 'bg-gray-500/10 text-gray-400'
  }
}

function statusText(status: string): string {
  switch (status) {
    case 'completed':
      return '完成'
    case 'failed':
      return '失败'
    case 'running':
      return '运行中'
    default:
      return '未知'
  }
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (weeks < 4) return `${weeks}周前`
  return `${months}个月前`
}

watch(() => store.isSidebarOpen, (isOpen) => {
  if (isOpen) {
    store.loadHistory()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>
