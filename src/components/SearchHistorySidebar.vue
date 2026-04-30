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
        class="relative w-[380px] h-full bg-theme-bg-sidebar text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out"
        :class="store.isSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex items-center justify-between px-5 py-4 border-b border-theme-border-sidebar">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-theme-text-sidebar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <h2 class="text-base font-semibold tracking-wide">{{ $t('searchHistory.sidebarTitle') }}</h2>
            <span class="px-2 py-0.5 bg-theme-bg-sidebar-active text-xs text-theme-text-sidebar-hover rounded-full">{{ store.totalCount }}</span>
          </div>
          <button
            class="p-1.5 text-theme-text-sidebar hover:text-white hover:bg-theme-bg-sidebar-hover rounded-lg transition-colors"
            @click="handleClose"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="px-4 py-3 border-b border-theme-border-sidebar space-y-3">
          <div class="flex items-center gap-2 px-3 py-2 bg-theme-bg-sidebar-hover rounded-lg border border-transparent focus-within:border-theme-border-sidebar transition-colors">
            <svg class="w-4 h-4 text-theme-text-sidebar flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              v-model="searchInput"
              type="text"
              :placeholder="$t('searchHistory.sidebarPlaceholder')"
              class="flex-1 bg-transparent text-sm text-white placeholder-theme-text-sidebar outline-none"
              @input="handleSearch"
            />
          </div>

          <div class="flex items-center gap-2">
            <select
              v-model="currentSortField"
              class="flex-1 px-3 py-2 bg-theme-bg-sidebar-hover border border-transparent rounded-lg text-xs text-theme-text-sidebar-hover outline-none cursor-pointer hover:border-theme-border-sidebar focus:border-theme-border-sidebar transition-colors appearance-none"
              @change="handleSort"
            >
              <option value="date">{{ $t('searchHistory.sortByDate') }}</option>
              <option value="frequency">{{ $t('searchHistory.sortByFrequency') }}</option>
            </select>
            <button
              class="p-2 bg-theme-bg-sidebar-hover border border-transparent rounded-lg text-theme-text-sidebar hover:text-white hover:border-theme-border-sidebar transition-colors"
              :title="currentSortOrder === 'desc' ? $t('searchHistory.sortByDate') : $t('searchHistory.sortByDate')"
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
            <div class="w-8 h-8 border-2 border-theme-text-sidebar border-t-green-400 rounded-full animate-spin"></div>
            <p class="text-sm text-theme-text-sidebar mt-3">{{ $t('searchHistory.loading') }}</p>
          </div>

          <div v-else-if="store.error" class="flex flex-col items-center justify-center py-12 text-center">
            <svg class="w-10 h-10 text-red-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="text-sm text-red-400">{{ store.error }}</p>
            <button class="mt-3 px-3 py-1.5 bg-theme-bg-sidebar-hover text-sm text-theme-text-sidebar-hover rounded-lg hover:bg-theme-bg-sidebar-active transition-colors" @click="handleRetry">
              {{ $t('searchHistory.retry') }}
            </button>
          </div>

          <div v-else-if="store.filteredAndSortedItems.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <svg class="w-12 h-12 text-theme-text-sidebar mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <p class="text-sm text-theme-text-sidebar font-medium">{{ searchKeyword ? $t('searchHistory.sidebarNoMatch') : $t('searchHistory.sidebarNoHistory') }}</p>
            <p class="text-xs text-theme-text-sidebar mt-1">{{ searchKeyword ? $t('searchHistory.sidebarNoMatchDesc') : $t('searchHistory.sidebarNoHistoryDesc') }}</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="item in store.filteredAndSortedItems"
              :key="item.id"
              class="group px-3 py-3 bg-theme-bg-sidebar-hover hover:bg-theme-bg-sidebar-active rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-theme-border-sidebar"
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
                <div class="flex items-center gap-3 text-xs text-theme-text-sidebar">
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('searchHistory.resultsCount', { count: item.resultCount }) }}
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
                    class="p-1 text-theme-text-sidebar hover:text-blue-400 hover:bg-theme-bg-sidebar rounded transition-colors"
                    :title="$t('searchHistory.reSearch')"
                    @click.stop="handleReSearch(item)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-.492-9.644a9.973 9.973 0 016.053-2.018m0 0a9.973 9.973 0 016.053 2.018M7.973 4.358a9.973 9.973 0 00-2.018 6.053m0 0a9.973 9.973 0 002.018 6.053" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    class="p-1 text-theme-text-sidebar hover:text-red-400 hover:bg-theme-bg-sidebar rounded transition-colors"
                    :title="$t('common.delete')"
                    @click.stop="handleDelete(item)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="item.researchArea" class="mt-2 flex items-center">
                <span class="px-2 py-0.5 bg-theme-bg-info text-theme-text-info text-[10px] rounded">{{ item.researchArea }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-3 border-t border-theme-border-sidebar">
          <button
            class="w-full px-4 py-2.5 bg-theme-bg-error text-theme-text-error text-sm rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="store.totalCount === 0"
            @click="handleShowClearConfirm"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ $t('searchHistory.clearAllHistory') }}
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

        <div class="relative bg-theme-bg-sidebar rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all duration-300 scale-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-theme-bg-error rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-theme-text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-white">{{ $t('searchHistory.confirmClearTitle') }}</h3>
              <p class="text-xs text-theme-text-sidebar mt-0.5">{{ $t('searchHistory.confirmClearSubtitle') }}</p>
            </div>
          </div>

          <p class="text-sm text-theme-text-sidebar-hover mb-6">
            {{ $t('searchHistory.confirmClearMessage', { count: store.totalCount }) }}
          </p>

          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2.5 bg-theme-bg-sidebar-hover text-theme-text-sidebar-hover text-sm rounded-lg hover:bg-theme-bg-sidebar-active transition-colors"
              @click="handleCancelClear"
            >
              {{ $t('searchHistory.cancel') }}
            </button>
            <button
              class="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              @click="handleConfirmClear"
            >
              {{ $t('searchHistory.confirmClear') }}
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
import { useI18n } from 'vue-i18n'
import type { SearchHistoryItem, SortField, SortOrder } from '../utils/searchHistory'

const { t } = useI18n()
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
      return 'bg-theme-bg-success text-theme-text-success'
    case 'failed':
      return 'bg-theme-bg-error text-theme-text-error'
    case 'running':
      return 'bg-theme-bg-info text-theme-text-info'
    default:
      return 'bg-theme-bg-active text-theme-text-tertiary'
  }
}

function statusText(status: string): string {
  switch (status) {
    case 'completed':
      return t('searchHistory.statusCompleted')
    case 'failed':
      return t('searchHistory.statusFailed')
    case 'running':
      return t('searchHistory.statusRunning')
    default:
      return t('searchHistory.statusUnknown')
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

  if (seconds < 60) return t('searchHistory.timeJustNow')
  if (minutes < 60) return t('searchHistory.timeMinutesAgo', { minutes })
  if (hours < 24) return t('searchHistory.timeHoursAgo', { hours })
  if (days < 7) return t('searchHistory.timeDaysAgo', { days })
  if (weeks < 4) return t('searchHistory.timeWeeksAgo', { weeks })
  return t('searchHistory.timeMonthsAgo', { months })
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
