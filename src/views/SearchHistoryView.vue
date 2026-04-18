<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 flex flex-col bg-[#f5f5f0] overflow-hidden">
        <div class="flex-1 overflow-y-auto p-8">
          <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-2xl font-bold text-gray-800">Search History <span class="text-xl font-normal text-gray-500">检索历史</span></h1>
              <div class="flex items-center gap-3">
                <button class="px-4 py-2 bg-[#1a2538] text-white text-sm rounded-lg hover:bg-[#243347] transition-colors flex items-center gap-2"
                        @click="handleOpenSidebar">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  打开侧边栏
                </button>
                <button class="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                        @click="handleClearAll">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Clear All History
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3 mb-6">
              <div class="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input v-model="searchKeyword"
                       type="text"
                       placeholder="Search history..."
                       class="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                       @input="handleSearch" />
              </div>
              <select v-model="filterStatus"
                      class="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none cursor-pointer hover:border-gray-300">
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="running">Running</option>
              </select>
              <select v-model="sortBy"
                      class="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 outline-none cursor-pointer hover:border-gray-300">
                <option value="date">Sort by Date</option>
                <option value="relevance">Sort by Relevance</option>
                <option value="papers">Sort by Papers</option>
              </select>
            </div>

            <div class="space-y-4">
              <div v-for="(session, index) in filteredHistory" :key="index"
                   class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
                   :class="selectedSessionId === session.id ? 'border-blue-400 ring-1 ring-blue-400' : ''"
                   @click="selectedSessionId = session.id">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-base font-semibold text-gray-800">{{ session.title }}</h3>
                      <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                            :class="statusClass(session.status)">
                        {{ session.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mb-3">{{ session.lastQuery }}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-400">
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                        {{ formatDate(session.createdAt) }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ session.messageCount }} messages
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ session.paperCount }} papers
                      </span>
                      <span v-if="session.researchArea" class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                        {{ session.researchArea }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Resume Session"
                            @click.stop="handleResume(session)">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 5.25a2.25 2.25 0 00-2.25 2.25v5.25a2.25 2.25 0 104.5 0V7.5a2.25 2.25 0 00-2.25-2.25z" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 5.25a2.25 2.25 0 00-2.25 2.25v5.25a2.25 2.25 0 104.5 0V7.5a2.25 2.25 0 00-2.25-2.25z" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Session"
                            @click.stop="handleDelete(session)">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="filteredHistory.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg class="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <p class="text-lg font-medium">No search history found</p>
                <p class="text-sm mt-1">Start a new research to see your history here</p>
              </div>
            </div>

            <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
              <button class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      :disabled="currentPage === 0"
                      @click="handlePageChange(currentPage - 1)">
                Previous
              </button>
              <button v-for="page in totalPages" :key="page"
                      class="px-3 py-1.5 rounded-lg text-sm transition-colors"
                      :class="currentPage === page - 1 ? 'bg-[#1a2538] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
                      @click="handlePageChange(page - 1)">
                {{ page }}
              </button>
              <button class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      :disabled="currentPage === totalPages - 1"
                      @click="handlePageChange(currentPage + 1)">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      <aside v-if="selectedSessionDetail" class="w-[380px] min-w-[380px] bg-[#f0ede5] border-l border-gray-200 flex flex-col overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-800">Session Details</h3>
          <button class="p-1 text-gray-400 hover:text-gray-600" @click="selectedSessionId = null">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-for="(msg, index) in selectedSessionDetail.messages" :key="index"
               class="flex flex-col"
               :class="msg.role === 'USER' ? 'items-end' : 'items-start'">
            <div class="max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed"
                 :class="msg.role === 'USER' ? 'bg-[#1a2538] text-white' : 'bg-white text-gray-700 border border-gray-200'">
              {{ msg.content }}
            </div>
            <span class="text-[10px] text-gray-400 mt-1">{{ formatTime(msg.createdAt) }}</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { useSearchHistoryStore } from '../stores/searchHistory'
import { getSearchHistory, saveSearchHistory, SearchHistoryItem } from '../utils/searchHistory'

const searchHistoryStore = useSearchHistoryStore()
const searchKeyword = ref('')
const filterStatus = ref('')
const sortBy = ref('date')
const selectedSessionId = ref<string | null>(null)
const currentPage = ref(0)
const pageSize = 20

const historyData = ref<any[]>([])

const sessionMessages: Record<string, any> = {
  'session-001': {
    messages: [
      { role: 'USER', content: '帮我总结使用 CodeBERT 做漏洞检测的方法', createdAt: '2026-04-17T10:00:00Z' },
      { role: 'ASSISTANT', content: '根据本地文献库分析，使用 CodeBERT 进行漏洞检测主要有以下几种方法：\n\n1. 基于预训练模型微调\n2. 结合图神经网络\n3. 多模态特征融合', createdAt: '2026-04-17T10:00:15Z' },
      { role: 'USER', content: '哪种方法效果最好？', createdAt: '2026-04-17T10:05:00Z' },
      { role: 'ASSISTANT', content: '根据最新研究，结合图神经网络的方法在 HumanEval 数据集上达到了 95.09% 的准确率，效果最佳。', createdAt: '2026-04-17T10:05:20Z' },
    ],
  },
}

const filteredHistory = computed(() => {
  let result = [...historyData.value]

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(h =>
      h.title.toLowerCase().includes(keyword) ||
      h.lastQuery.toLowerCase().includes(keyword) ||
      h.researchArea?.toLowerCase().includes(keyword)
    )
  }

  if (filterStatus.value) {
    result = result.filter(h => h.status === filterStatus.value)
  }

  if (sortBy.value === 'date') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortBy.value === 'relevance') {
    result.sort((a, b) => b.paperCount - a.paperCount)
  } else if (sortBy.value === 'papers') {
    result.sort((a, b) => b.messageCount - a.messageCount)
  }

  const start = currentPage.value * pageSize
  return result.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(historyData.value.length / pageSize))

const selectedSessionDetail = computed(() => {
  if (!selectedSessionId.value) return null
  return sessionMessages[selectedSessionId.value] || null
})

function initSampleData() {
  const existing = getSearchHistory()
  if (existing.length === 0) {
    const sampleData: SearchHistoryItem[] = [
      {
        id: 'search-1',
        keyword: 'CodeBERT 漏洞检测方法',
        timestamp: Date.now() - 3600000,
        resultCount: 8,
        status: 'completed',
        researchArea: '网络安全',
      },
      {
        id: 'search-2',
        keyword: 'LLM 程序自动修复',
        timestamp: Date.now() - 86400000,
        resultCount: 5,
        status: 'completed',
        researchArea: '程序修复',
      },
      {
        id: 'search-3',
        keyword: 'Transformer 代码分析应用',
        timestamp: Date.now() - 172800000,
        resultCount: 2,
        status: 'failed',
        researchArea: '深度学习',
      },
      {
        id: 'search-4',
        keyword: '知识图谱构建方法',
        timestamp: Date.now() - 259200000,
        resultCount: 10,
        status: 'completed',
        researchArea: '知识图谱',
      },
      {
        id: 'search-5',
        keyword: '代码生成模型对比',
        timestamp: Date.now() - 345600000,
        resultCount: 4,
        status: 'running',
        researchArea: '代码生成',
      },
    ]
    saveSearchHistory(sampleData)
  }
  loadData()
}

function loadData() {
  const data = getSearchHistory()
  historyData.value = data.map(item => ({
    id: item.id,
    title: item.keyword,
    lastQuery: item.keyword,
    messageCount: item.resultCount * 2,
    paperCount: item.resultCount,
    createdAt: new Date(item.timestamp).toISOString(),
    updatedAt: new Date(item.timestamp).toISOString(),
    status: item.status,
    researchArea: item.researchArea,
  }))
}

function handleOpenSidebar() {
  searchHistoryStore.openSidebar()
}

function statusClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'failed':
      return 'bg-red-100 text-red-700'
    case 'running':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function handleSearch() {
  currentPage.value = 0
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleResume(session: any) {
  console.log('Resume session:', session.id)
}

function handleDelete(session: any) {
  const index = historyData.value.findIndex(h => h.id === session.id)
  if (index > -1) {
    historyData.value.splice(index, 1)
    if (selectedSessionId.value === session.id) {
      selectedSessionId.value = null
    }
  }
}

function handleClearAll() {
  if (confirm('确定要清空所有检索历史吗？此操作不可恢复。')) {
    historyData.value = []
    selectedSessionId.value = null
  }
}

onMounted(() => {
  initSampleData()
})
</script>
