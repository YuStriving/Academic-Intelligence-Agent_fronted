<template>
  <div class="flex h-screen overflow-hidden bg-theme-bg-primary transition-colors duration-300">
    <Sidebar @selectChat="handleSelectChat" @newChat="handleNewChat" />

    <div class="flex flex-1 overflow-hidden relative">

      <div
        ref="chatAreaRef"
        class="flex flex-col bg-theme-bg-primary overflow-hidden transition-all duration-300 ease-in-out flex-1 min-w-0 relative"
      >
        <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-theme-border-primary bg-theme-bg-card transition-colors duration-300">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-theme-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xs font-medium text-theme-text-secondary">{{ $t('home.researchQuery') }}</span>
          </div>
          <button
            v-if="hasPapers"
            class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
            :title="isPanelExpanded ? $t('home.hidePapers') : $t('home.showPapers')"
            @click="isPanelExpanded = !isPanelExpanded"
          >
            <svg
              class="w-5 h-5 transition-transform duration-300"
              :class="isPanelExpanded ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-sm font-semibold whitespace-nowrap">{{ isPanelExpanded ? $t('home.hidePapers') : $t('home.showPapers') }}</span>
            <span v-if="!isPanelExpanded" class="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-white/20 rounded-full text-xs font-bold">
              {{ papers.length }}
            </span>
          </button>
        </div>

        <div v-if="messages.length === 0" class="flex-1 flex flex-col items-center justify-center px-4">
          <div class="text-center max-w-4xl mx-auto mb-12">
            <h1 class="text-4xl font-bold text-theme-text-primary mb-4">{{ greetingText }}</h1>
            <p class="text-2xl text-theme-text-secondary">{{ $t('home.greetingSubtitle') }}</p>
          </div>
          <div class="w-[50%] mx-auto">
            <div class="flex items-center gap-4 px-8 py-5 bg-theme-bg-active rounded-2xl border border-theme-border-primary focus-within:border-theme-border-focus transition-colors">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('home.askPlaceholder')"
                class="flex-1 bg-transparent text-lg text-theme-text-primary placeholder-theme-text-tertiary outline-none input-with-hidden-placeholder"
                @keydown.enter="handleSend"
              />
              <button class="p-2 bg-theme-btn-primary-bg rounded-xl text-white hover:bg-theme-btn-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="!searchQuery.trim() || isThinking"
                      @click="handleSend"
                      title="发送">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else ref="chatContainer" class="flex-1 overflow-y-auto scroll-smooth w-full px-4 md:px-8 py-6 space-y-6">
          <template v-for="(msg, index) in messages" :key="index">

            <UserChatBubble
              v-if="msg.role === 'user'"
              :content="msg.content"
              :timestamp="msg.timestamp"
              :status="msg.status"
              :avatar-url="authStore.user?.avatarUrl"
              :animation-delay="index * 50 + 'ms'"
              @copy="handleCopy(msg.content)"
            />

            <AIChatBubble
              v-else
              :content="msg.content"
              :timestamp="msg.timestamp"
              :papers-found="msg.papersFound"
              :animation-delay="index * 50 + 'ms'"
              @copy="handleCopy(msg.content)"
            />
          </template>

          <div v-if="isThinking" class="flex items-start gap-3 message-enter">
            <div class="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="bg-theme-btn-primary-bg rounded-2xl rounded-tl-sm px-5 py-3.5 transition-colors duration-300 shadow-md">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 bg-theme-text-tertiary rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2.5 h-2.5 bg-theme-text-tertiary rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2.5 h-2.5 bg-theme-text-tertiary rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
              <span class="text-[11px] text-theme-text-tertiary mt-1.5 block">{{ $t('home.aiThinking') }}</span>
            </div>
          </div>
        </div>

        <div v-if="messages.length > 0" class="pt-4 pb-6 bg-transparent transition-colors duration-300">
          <div class="w-[50%] mx-auto flex items-center gap-4">
            <div class="flex-1 flex items-center gap-3 px-6 py-5 bg-theme-bg-active rounded-2xl border border-transparent focus-within:border-theme-border-focus transition-colors">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('home.askPlaceholder')"
                class="flex-1 bg-transparent text-[17px] font-medium text-theme-text-primary placeholder-theme-text-tertiary outline-none tracking-wide input-with-hidden-placeholder"
                @keydown.enter="handleSend"
              />
              <button class="p-2 text-theme-text-tertiary hover:text-theme-text-secondary transition-colors" title="Voice input">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <button class="p-5 bg-theme-btn-primary-bg rounded-2xl text-white hover:bg-theme-btn-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!searchQuery.trim() || isThinking"
                    @click="handleSend">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col bg-theme-bg-card overflow-hidden transition-all duration-300 ease-in-out border-l border-theme-border-primary"
        :class="isPanelExpanded ? 'w-[420px] min-w-[420px] flex-shrink-0' : 'w-0 min-w-0 opacity-0 pointer-events-none border-l-0'"
      >
        <template v-if="isPanelExpanded">
          <div v-if="selectedPaperIndex === null" class="flex-1 overflow-y-auto space-y-3">
            <div class="flex items-center justify-between px-4 py-3 border-b border-theme-border-primary sticky top-0 z-10 bg-theme-bg-card transition-colors duration-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-xs font-medium text-theme-text-secondary">{{ $t('home.retrievedPapers', { count: papers.length }) }}</span>
              </div>
              <button class="p-1 text-theme-text-tertiary hover:text-theme-text-secondary hover:bg-theme-bg-hover rounded-lg transition-colors"
                      @click="isPanelExpanded = false">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="p-3 space-y-3">
              <div v-for="(paper, index) in papers" :key="index"
                   class="bg-theme-bg-input rounded-xl border border-theme-border-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
                   @click="selectedPaperIndex = index">
                <div class="px-4 py-2.5 border-b border-theme-border-secondary bg-theme-bg-card transition-colors duration-300">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5 text-xs text-theme-text-tertiary">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ paper.authors }}</span>
                    </div>
                    <span class="text-theme-border-secondary">|</span>
                    <div class="flex items-center gap-1.5 text-xs text-theme-text-tertiary">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ paper.source }}</span>
                    </div>
                    <span class="text-theme-border-secondary">|</span>
                    <div class="flex items-center gap-1.5 text-xs text-theme-text-tertiary">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ paper.date }}</span>
                    </div>
                  </div>
                </div>

                <div class="p-4">
                  <h3 class="text-sm font-semibold text-theme-text-primary leading-snug mb-2 hover:text-theme-text-link transition-colors">{{ paper.title }}</h3>
                  <p class="text-xs text-theme-text-secondary leading-relaxed line-clamp-2 mb-3">{{ paper.abstract }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                            :class="scoreClass(paper.score)">
                    {{ $t('home.score') }} {{ paper.score }}%
                      </span>
                      <span v-if="paper.persisted" class="text-xs text-theme-text-tertiary">{{ $t('home.locallyPersisted') }}</span>
                    </div>
                    <button v-if="paper.downloadable"
                            class="px-3 py-1.5 bg-theme-btn-primary-bg text-white text-xs rounded-lg hover:bg-theme-btn-primary-hover transition-colors"
                            @click.stop>
                      {{ $t('home.download') }}
                    </button>
                    <div v-else-if="paper.progress !== undefined" class="flex items-center gap-2">
                      <div class="w-32 h-1.5 bg-theme-bg-active rounded-full overflow-hidden">
                        <div class="h-full bg-theme-accent-primary rounded-full transition-all" :style="{ width: paper.progress + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col h-full">
            <div class="flex items-center justify-between px-4 py-3 border-b border-theme-border-primary sticky top-0 z-10 bg-theme-bg-card transition-colors duration-300">
              <button class="flex items-center gap-1.5 text-xs text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
                      @click="selectedPaperIndex = null">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ $t('home.backToPapers') }}
              </button>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="scoreClass(papers[selectedPaperIndex].score)">
                {{ $t('home.score') }} {{ papers[selectedPaperIndex].score }}%
                </span>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto">
              <div class="p-5">
                <h2 class="text-lg font-bold text-theme-text-primary leading-snug mb-3">{{ papers[selectedPaperIndex].title }}</h2>

                <div class="flex flex-wrap items-center gap-3 text-xs text-theme-text-tertiary mb-4 pb-4 border-b border-theme-border-secondary">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ papers[selectedPaperIndex].authors }}</span>
                  </div>
                  <span class="text-theme-border-secondary">|</span>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ papers[selectedPaperIndex].date }}</span>
                  </div>
                  <span class="text-theme-border-secondary">|</span>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ papers[selectedPaperIndex].source }}</span>
                  </div>
                  <span class="text-theme-border-secondary">|</span>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ $t('home.citations') }}: {{ papers[selectedPaperIndex].citations }}</span>
                  </div>
                </div>

                <div class="mb-5">
                  <h3 class="text-sm font-semibold text-theme-text-primary mb-2">{{ $t('home.abstract') }}</h3>
                  <p class="text-sm text-theme-text-secondary leading-relaxed">{{ papers[selectedPaperIndex].fullAbstract }}</p>
                </div>

                <div class="mb-5">
                  <h3 class="text-sm font-semibold text-theme-text-primary mb-2">{{ $t('home.keywords') }}</h3>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(kw, i) in papers[selectedPaperIndex].keywords" :key="i"
                          class="px-2.5 py-1 bg-theme-bg-active text-theme-text-secondary text-xs rounded-lg transition-colors">
                      {{ kw }}
                    </span>
                  </div>
                </div>

                <div v-if="papers[selectedPaperIndex].doi" class="mb-5">
                  <h3 class="text-sm font-semibold text-theme-text-primary mb-2">DOI</h3>
                  <p class="text-sm text-theme-text-link hover:underline cursor-pointer">{{ papers[selectedPaperIndex].doi }}</p>
                </div>

                <div class="flex items-center gap-3 pt-4 border-t border-theme-border-secondary">
                  <button class="px-4 py-2 bg-theme-btn-primary-bg text-white text-sm rounded-lg hover:bg-theme-btn-primary-hover transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('home.downloadPdf') }}
                  </button>
                  <button class="px-4 py-2 border border-theme-border-primary text-theme-text-secondary text-sm rounded-lg hover:bg-theme-bg-hover transition-colors flex items-center gap-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('home.saveToLibrary') }}
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

？<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Sidebar from '../components/Sidebar.vue'
import UserChatBubble from '../components/UserChatBubble.vue'
import AIChatBubble from '../components/AIChatBubble.vue'
import { sessionApi } from '../api/session'
import type { SessionInfo, SessionDetail, ChatMessage as ApiChatMessage } from '../api/types'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api/auth'

const { t } = useI18n()
const authStore = useAuthStore()

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  papersFound?: number
  status?: 'sending' | 'sent' | 'read'
}

interface PaperResult {
  title: string
  authors: string
  date: string
  source: string
  score: number
  abstract: string
  fullAbstract: string
  keywords: string[]
  doi?: string
  citations: number
  downloadable: boolean
  persisted: boolean
  progress?: number
}

const searchQuery = ref('')
const messages = ref<ChatMessage[]>([])
const papers = ref<PaperResult[]>([])
const isPanelExpanded = ref(false)
const isThinking = ref(false)
const selectedPaperIndex = ref<number | null>(null)
const chatContainer = ref<HTMLElement | null>(null)
const currentSessionId = ref<string | null>(null)
const sessions = ref<SessionInfo[]>([])

const hasPapers = computed(() => papers.value.length > 0)

const greetingText = computed(() => {
  const username = authStore.user?.nickname || authStore.user?.name || authStore.user?.username || ''
  return username ? t('home.greeting', { name: username }) : t('home.greetingDefault')
})

function scoreClass(score: number): string {
  if (score >= 90) return 'bg-theme-bg-success text-theme-text-success'
  if (score >= 80) return 'bg-theme-bg-info text-theme-text-info'
  if (score >= 70) return 'bg-theme-bg-warning text-theme-text-warning'
  return 'bg-theme-bg-error text-theme-text-error'
}

function getCopyMessage(): string {
  return t('home.copyMessage')
}

async function handleCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    console.log(getCopyMessage())
  }
}

async function handleSend() {
  if (!searchQuery.value.trim() || isThinking.value) return

  const userMessage: ChatMessage = {
    role: 'user',
    content: searchQuery.value,
    timestamp: Date.now(),
    status: 'sent',
  }

  messages.value.push(userMessage)
  isThinking.value = true
  searchQuery.value = ''

  await nextTick()
  scrollToBottom()

  let sessionId = currentSessionId.value
  if (!sessionId) {
    try {
      const newSession = await sessionApi.createSession({ title: searchQuery.value || 'New Chat' })
      sessionId = newSession.id
      currentSessionId.value = sessionId
      loadSessions()
    } catch (error) {
      console.error('Failed to create session:', error)
      isThinking.value = false
      return
    }
  }

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      isThinking.value = false
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: `Based on your research query, I've analyzed the relevant literature and identified key findings in this domain.`,
        timestamp: Date.now(),
        papersFound: papers.value.length,
      }
      messages.value.push(aiMessage)
      resolve()
    }, 2000)
  })

  await nextTick()
  scrollToBottom()
}

function handleSelectChat(index: number) {
  console.log('Select chat:', index)
  const selectedSession = sessions.value[index]
  if (!selectedSession) return
  
  loadSessionMessages(selectedSession.id)
}

async function loadSessions() {
  try {
    const response = await sessionApi.getSessions({ page: 0, size: 20 })
    sessions.value = response.content
  } catch (error) {
    console.error('Failed to load sessions:', error)
  }
}

async function loadSessionMessages(sessionId: string) {
  try {
    const sessionDetail: SessionDetail = await sessionApi.getSessionDetail(sessionId)
    currentSessionId.value = sessionId
    messages.value = sessionDetail.messages.map((msg: ApiChatMessage) => ({
      role: msg.role === 'USER' ? 'user' : 'assistant',
      content: msg.content,
      timestamp: msg.timestamp || Date.now(),
      papersFound: msg.papersFound,
      status: msg.status,
    }))
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Failed to load session messages:', error)
    messages.value = []
  }
}

function handleNewChat() {
  currentSessionId.value = null
  messages.value = []
  papers.value = []
  isPanelExpanded.value = false
  selectedPaperIndex.value = null
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated && (!authStore.user?.avatarUrl || !authStore.user?.nickname)) {
    try {
      const userInfo = await authApi.getMe()
      if (userInfo.avatarUrl || userInfo.nickname) {
        if (authStore.user) {
          if (userInfo.avatarUrl) authStore.user.avatarUrl = userInfo.avatarUrl
          if (userInfo.nickname) authStore.user.nickname = userInfo.nickname
          localStorage.setItem('user', JSON.stringify(authStore.user))
        }
      }
    } catch (err) {
      console.error('Failed to fetch user avatar:', err)
    }
  }

  const mockPapers: PaperResult[] = [
    {
      title: 'CodeFIx: Fine-tuning Large Language Models for Program Repair',
      authors: 'Wang et al.',
      date: '2024-03',
      source: 'ICSE 2024',
      score: 95,
      abstract: 'We propose CodeFIx, a novel approach that fine-tunes large language models specifically for automated program repair tasks.',
      fullAbstract: 'We propose CodeFIx, a novel approach that fine-tunes large language models specifically for automated program repair tasks. Our method leverages a curated dataset of bug-fix pairs and employs a two-stage training strategy that first teaches the model general code understanding, then specializes it for repair. Experimental results show that CodeFIx achieves state-of-the-art performance on the Defects4J benchmark, correctly repairing 38% more bugs than previous approaches.',
      keywords: ['Program Repair', 'LLM', 'Fine-tuning', 'CodeBERT'],
      doi: '10.1109/ICSE.2024.00042',
      citations: 127,
      downloadable: true,
      persisted: true,
    },
    {
      title: 'Semantic-Aware Code Representation for Vulnerability Detection',
      authors: 'Zhang et al.',
      date: '2024-01',
      source: 'ASE 2024',
      score: 88,
      abstract: 'This paper presents a semantic-aware code representation method that significantly improves vulnerability detection accuracy.',
      fullAbstract: 'This paper presents a semantic-aware code representation method that significantly improves vulnerability detection accuracy. By combining abstract syntax trees with data flow analysis, our approach captures both syntactic and semantic properties of code. We evaluate on multiple vulnerability datasets and demonstrate a 15% improvement in F1-score over baseline methods.',
      keywords: ['Vulnerability Detection', 'Code Representation', 'AST', 'Deep Learning'],
      doi: '10.1109/ASE.2024.00031',
      citations: 89,
      downloadable: true,
      persisted: false,
      progress: 45,
    },
    {
      title: 'Transformer-Based Code Generation: A Comprehensive Survey',
      authors: 'Li et al.',
      date: '2024-02',
      source: 'TSE 2024',
      score: 82,
      abstract: 'A comprehensive survey of transformer-based models for code generation, covering architectures, training strategies, and evaluation metrics.',
      fullAbstract: 'A comprehensive survey of transformer-based models for code generation, covering architectures, training strategies, and evaluation metrics. We review over 150 papers and categorize approaches by their underlying architecture, pre-training objectives, and fine-tuning strategies. The survey also identifies open challenges and future directions in the field.',
      keywords: ['Code Generation', 'Transformer', 'Survey', 'NLP'],
      doi: '10.1109/TSE.2024.3356789',
      citations: 203,
      downloadable: false,
      persisted: true,
    },
  ]

  papers.value = mockPapers
})
</script>

<style scoped>
.message-enter {
  animation: messageEnter 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes messageEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-with-hidden-placeholder:focus::placeholder {
  color: transparent;
}
</style>
