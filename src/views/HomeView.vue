<template>
  <div class="flex h-screen overflow-hidden bg-[#f5f5f0]">
    <Sidebar @selectChat="handleSelectChat" @newChat="handleNewChat" />

    <div class="flex flex-1 overflow-hidden relative">

      <div
        class="flex flex-col bg-[#f5f5f0] overflow-hidden transition-all duration-300 ease-in-out flex-1 min-w-0"
      >
        <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-200 bg-white">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xs font-medium text-gray-600">Research Query</span>
          </div>
          <button
            v-if="hasPapers"
            class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            :title="isPanelExpanded ? 'Hide papers' : 'Show papers'"
            @click="isPanelExpanded = !isPanelExpanded"
          >
            <svg
              class="w-4 h-4 transition-transform duration-300"
              :class="isPanelExpanded ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth">
          <template v-for="(msg, index) in messages" :key="index">

            <div v-if="msg.role === 'user'"
                 class="flex items-start gap-2.5 justify-end message-enter"
                 :style="{ animationDelay: index * 50 + 'ms' }">
              <div class="max-w-[82%]">
                <div class="relative group">
                  <div class="bg-white rounded-2xl rounded-tr-sm border border-gray-200 px-4 py-3 shadow-sm">
                    <p class="text-sm text-gray-800 leading-relaxed">{{ msg.content }}</p>
                  </div>
                  <div class="flex items-center justify-end gap-2 mt-1 px-1">
                    <span class="text-[10px] text-gray-400">{{ formatTime(msg.timestamp) }}</span>
                    <span v-if="msg.status === 'read'" class="text-blue-500">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M1 13l5 5L17 7" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 13l5 5L23 7" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                    <span v-else-if="msg.status === 'sent'" class="text-gray-400">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M2 13l5 5L18 7" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                    <span v-else class="text-gray-400">
                      <svg class="w-3.5 h-3.5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                    </span>
                  </div>
                  <button class="absolute -top-2 -left-8 p-1 bg-white border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Copy message"
                          @click="handleCopy(msg.content)">
                    <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="w-7 h-7 rounded-full bg-[#1a2538] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <div v-else
                 class="flex items-start gap-2.5 message-enter"
                 :style="{ animationDelay: index * 50 + 'ms' }">
              <div class="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="max-w-[82%]">
                <div class="relative group">
                  <div class="bg-[#1a2538] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <p class="text-sm text-white leading-relaxed">{{ msg.content }}</p>
                    <div v-if="msg.papersFound !== undefined" class="mt-3 flex items-center gap-2">
                      <span class="text-xs text-green-400 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ msg.papersFound }} papers found
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-1 px-1">
                    <span class="text-[10px] text-gray-400">{{ formatTime(msg.timestamp) }}</span>
                  </div>
                  <button class="absolute -top-2 -right-8 p-1 bg-white border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Copy message"
                          @click="handleCopy(msg.content)">
                    <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <div v-if="isThinking" class="flex items-start gap-2.5 message-enter">
            <div class="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="bg-[#1a2538] rounded-2xl rounded-tl-sm px-4 py-3">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
              <span class="text-[10px] text-gray-500 mt-1.5 block">AI is thinking...</span>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 bg-white">
          <div class="flex items-center gap-3">
            <div class="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl border border-transparent focus-within:border-gray-300 transition-colors">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Ask about research directions, papers, or to..."
                class="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                @keydown.enter="handleSend"
              />
              <button class="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Voice input">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <button class="p-3 bg-[#1a2538] rounded-xl text-white hover:bg-[#2d4059] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!searchQuery.trim() || isThinking"
                    @click="handleSend">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col bg-white overflow-hidden transition-all duration-300 ease-in-out border-l border-gray-200"
        :class="isPanelExpanded ? 'w-[420px] min-w-[420px] flex-shrink-0' : 'w-0 min-w-0 opacity-0 pointer-events-none border-l-0'"
      >
        <template v-if="isPanelExpanded">
          <div v-if="selectedPaperIndex === null" class="flex-1 overflow-y-auto space-y-3">
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 z-10 bg-white">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-xs font-medium text-gray-600">Retrieved Papers ({{ papers.length }})</span>
              </div>
              <button class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      @click="isPanelExpanded = false">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="p-3 space-y-3">
              <div v-for="(paper, index) in papers" :key="index"
                   class="bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
                   @click="selectedPaperIndex = index">
                <div class="px-4 py-2.5 border-b border-gray-100 bg-white">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ paper.authors }}</span>
                    </div>
                    <span class="text-gray-300">|</span>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ paper.source }}</span>
                    </div>
                    <span class="text-gray-300">|</span>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ paper.date }}</span>
                    </div>
                  </div>
                </div>

                <div class="p-4">
                  <h3 class="text-sm font-semibold text-gray-800 leading-snug mb-2 hover:text-blue-600 transition-colors">{{ paper.title }}</h3>
                  <p class="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">{{ paper.abstract }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                            :class="scoreClass(paper.score)">
                        Score {{ paper.score }}%
                      </span>
                      <span v-if="paper.persisted" class="text-xs text-gray-500">Locally Persisted</span>
                    </div>
                    <button v-if="paper.downloadable"
                            class="px-3 py-1.5 bg-[#1a2538] text-white text-xs rounded-lg hover:bg-[#2d4059] transition-colors"
                            @click.stop>
                      Download
                    </button>
                    <div v-else-if="paper.progress !== undefined" class="flex items-center gap-2">
                      <div class="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full transition-all" :style="{ width: paper.progress + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col h-full">
            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 z-10 bg-white">
              <button class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      @click="selectedPaperIndex = null">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Back to papers
              </button>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                      :class="scoreClass(papers[selectedPaperIndex].score)">
                  Score {{ papers[selectedPaperIndex].score }}%
                </span>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto">
              <div class="p-5">
                <h2 class="text-lg font-bold text-gray-800 leading-snug mb-3">{{ papers[selectedPaperIndex].title }}</h2>

                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ papers[selectedPaperIndex].authors }}</span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ papers[selectedPaperIndex].date }}</span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ papers[selectedPaperIndex].source }}</span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Citations: {{ papers[selectedPaperIndex].citations }}</span>
                  </div>
                </div>

                <div class="mb-5">
                  <h3 class="text-sm font-semibold text-gray-800 mb-2">Abstract</h3>
                  <p class="text-sm text-gray-600 leading-relaxed">{{ papers[selectedPaperIndex].fullAbstract }}</p>
                </div>

                <div class="mb-5">
                  <h3 class="text-sm font-semibold text-gray-800 mb-2">Keywords</h3>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(kw, i) in papers[selectedPaperIndex].keywords" :key="i"
                          class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      {{ kw }}
                    </span>
                  </div>
                </div>

                <div v-if="papers[selectedPaperIndex].doi" class="mb-5">
                  <h3 class="text-sm font-semibold text-gray-800 mb-2">DOI</h3>
                  <p class="text-sm text-blue-600 hover:underline cursor-pointer">{{ papers[selectedPaperIndex].doi }}</p>
                </div>

                <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button class="px-4 py-2 bg-[#1a2538] text-white text-sm rounded-lg hover:bg-[#2d4059] transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Download PDF
                  </button>
                  <button class="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Save to Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  status?: 'sending' | 'sent' | 'read'
  papersFound?: number
}

interface Paper {
  title: string
  authors: string
  date: string
  source: string
  abstract: string
  fullAbstract: string
  score: number
  persisted: boolean
  downloadable: boolean
  progress?: number
  keywords: string[]
  citations: number
  doi: string | null
}

const searchQuery = ref('')
const selectedPaperIndex = ref<number | null>(null)
const isThinking = ref(false)
const isPanelExpanded = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const hasPapers = computed(() => {
  return messages.value.some(m => m.papersFound && m.papersFound > 0)
})

const messages = ref<ChatMessage[]>([
  {
    role: 'user',
    content: 'What are the cosmic modets practro research models in month literature?',
    timestamp: Date.now() - 60000,
    status: 'read',
  },
  {
    role: 'assistant',
    content: 'Based on your query about cosmic research models in recent literature, I\'ve analyzed several key papers. Here are the top results:',
    timestamp: Date.now() - 55000,
    papersFound: 4,
  },
])

const papers = ref<Paper[]>([
  {
    title: 'CodeFIx: Fine-tuning Large Language Models for Reliable Program Bug Repair',
    authors: 'Wang et al., 2024',
    date: 'Mar 15, 2024',
    source: 'arXiv',
    abstract: 'A novel approach to fine-tuning large language models for reliable program bug repair, meeting software engineering needs and automation standards...',
    fullAbstract: 'Fine-tuning large language models for reliable program bug repair has become a critical area of research. In this paper, we present CodeFix, a novel approach that leverages pre-trained language models for automated bug detection and repair. Our method combines static analysis with deep learning to achieve state-of-the-art results on multiple benchmarks. We evaluate our approach on the HumanEval and Defects4J datasets, demonstrating significant improvements over existing methods in both accuracy and efficiency.',
    score: 92,
    persisted: true,
    downloadable: false,
    keywords: ['CodeFix', 'Large Language Models', 'Bug Repair', 'Fine-tuning', 'Program Analysis'],
    citations: 33,
    doi: '10.48550/arXiv.2403.xxxxx',
  },
  {
    title: 'Semantic-Aware Code Representation for Vulnerability Detection',
    authors: 'Zhang et al., 2024',
    date: 'Feb 28, 2024',
    source: 'IEEE',
    abstract: 'This paper explores semantic-aware code representation learning for improved vulnerability detection in software systems...',
    fullAbstract: 'This paper explores the application of fine-tuned language models for program bug repair. We introduce a novel architecture that combines syntactic and semantic information to improve repair accuracy. Our experiments show that the proposed method achieves competitive results on standard benchmarks while maintaining computational efficiency.',
    score: 88,
    persisted: false,
    downloadable: true,
    keywords: ['Program Repair', 'Language Models', 'Syntax Analysis', 'Semantics'],
    citations: 21,
    doi: '10.1109/IEEE.2024.yyyyy',
  },
  {
    title: 'Transformer-Based Code Generation: A Comprehensive Survey',
    authors: 'Li et al., 2024',
    date: 'Jan 10, 2024',
    source: 'ACM',
    abstract: 'A comprehensive survey on transformer-based architectures for code generation tasks across multiple programming languages...',
    fullAbstract: 'We present a comprehensive study on using large language models for program bug repair. Our approach leverages transformer-based architectures to understand code semantics and generate accurate repairs. The method is evaluated across multiple programming languages and shows consistent improvements.',
    score: 75,
    persisted: false,
    downloadable: false,
    progress: 60,
    keywords: ['Transformers', 'Code Generation', 'Bug Detection', 'Multi-language'],
    citations: 15,
    doi: null,
  },
  {
    title: 'Knowledge Graph Enhanced Code Understanding for Software Engineering',
    authors: 'Chen et al., 2023',
    date: 'Dec 5, 2023',
    source: 'Springer',
    abstract: 'This work addresses the challenge of reliable program bug repair using fine-tuned language models with knowledge graph integration...',
    fullAbstract: 'This work addresses the challenge of reliable program bug repair using fine-tuned language models. We propose a framework that integrates multiple sources of information including code structure, execution traces, and natural language documentation to improve repair quality.',
    score: 72,
    persisted: false,
    downloadable: false,
    keywords: ['Framework', 'Code Structure', 'Execution Traces', 'Documentation'],
    citations: 8,
    doi: '10.1007/springer.2023.zzzzz',
  },
])

function scoreClass(score: number): string {
  if (score >= 90) return 'bg-green-100 text-green-700'
  if (score >= 80) return 'bg-blue-100 text-blue-700'
  return 'bg-blue-50 text-blue-600'
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

async function handleCopy(content: string) {
  try {
    await navigator.clipboard.writeText(content)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = content
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

async function handleSend() {
  if (!searchQuery.value.trim() || isThinking.value) return

  const query = searchQuery.value.trim()
  searchQuery.value = ''

  messages.value.push({
    role: 'user',
    content: query,
    timestamp: Date.now(),
    status: 'sending',
  })

  await scrollToBottom()

  setTimeout(() => {
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg.role === 'user') {
      lastMsg.status = 'sent'
    }
  }, 500)

  isThinking.value = true
  await scrollToBottom()

  setTimeout(() => {
    isThinking.value = false

    const hasPapersQuery = query.toLowerCase().includes('paper') ||
                           query.toLowerCase().includes('research') ||
                           query.toLowerCase().includes('model')

    if (hasPapersQuery) {
      const papersCount = Math.floor(Math.random() * 5) + 1
      messages.value.push({
        role: 'assistant',
        content: 'I\'ve found several relevant papers based on your query. Let me analyze the results and provide a comprehensive summary.',
        timestamp: Date.now(),
        papersFound: papersCount,
      })
      isPanelExpanded.value = true
    } else {
      messages.value.push({
        role: 'assistant',
        content: 'That\'s an interesting question. Let me help you with that. Based on my understanding, I can provide some insights on this topic.',
        timestamp: Date.now(),
      })
    }

    const userMsg = messages.value.find(m => m.role === 'user' && m.status !== 'read')
    if (userMsg) {
      userMsg.status = 'read'
    }

    scrollToBottom()
  }, 2000)
}

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

onMounted(() => {
  if (hasPapers.value) {
    isPanelExpanded.value = true
  }
  scrollToBottom()
})
</script>

<style scoped>
.message-enter {
  animation: messageSlideIn 0.3s ease-out both;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>
