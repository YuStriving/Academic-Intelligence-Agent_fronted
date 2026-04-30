<template>
  <aside 
    class="bg-theme-bg-sidebar flex flex-col text-white transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0"
    :class="sidebarStore.isCollapsed ? 'w-[64px] min-w-[64px]' : 'w-[280px] min-w-[280px]'"
  >
    <div :class="sidebarStore.isCollapsed ? 'flex items-center justify-center' : 'p-4'">
        <div :class="sidebarStore.isCollapsed ? 'mb-0 mx-auto justify-center w-[40px]' : 'flex items-center gap-3 mb-8'"
             @click="handleToggle">
          <div class="relative w-10 h-10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 cursor-pointer group">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8 group-hover:scale-110">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 bg-theme-bg-sidebar-tooltip rounded-md shadow-lg text-[11px] text-theme-text-sidebar whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              {{ sidebarStore.isCollapsed ? $t('sidebar.expandMenu') : $t('sidebar.collapseMenu') }}
              <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-theme-bg-sidebar-tooltip rotate-45"></div>
            </div>
          </div>
          <div v-if="!sidebarStore.isCollapsed" class="text-sm font-semibold leading-tight whitespace-nowrap">
            Academic<br>Intelligence Agent
          </div>
        </div>

      <nav v-if="!sidebarStore.isCollapsed" class="space-y-1">
        <a href="#" class="flex items-center gap-3 rounded-lg transition-colors overflow-hidden"
           :class="[
             sidebarStore.isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
             activeMenu === 'chat' ? 'bg-theme-bg-sidebar-active text-white' : 'text-theme-text-sidebar hover:bg-theme-bg-sidebar-hover hover:text-white'
           ]"
           @click.prevent="navigateTo('chat')">
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4.5v15m7.5-7.5h-15" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm whitespace-nowrap transition-opacity duration-300"
                :class="sidebarStore.isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">{{ $t('sidebar.newChat') }}</span>
        </a>
        <a href="#" class="flex items-center gap-3 rounded-lg transition-colors overflow-hidden"
           :class="[
             sidebarStore.isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
             activeMenu === 'library' ? 'bg-theme-bg-sidebar-active text-white' : 'text-theme-text-sidebar hover:bg-theme-bg-sidebar-hover hover:text-white'
           ]"
           @click.prevent="navigateTo('library')">
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm whitespace-nowrap transition-opacity duration-300"
                :class="sidebarStore.isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">{{ $t('sidebar.myLibrary') }}</span>
        </a>
        <a href="#" class="flex items-center gap-3 rounded-lg transition-colors overflow-hidden"
           :class="[
             sidebarStore.isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
             activeMenu === 'history' ? 'bg-theme-bg-sidebar-active text-white' : 'text-theme-text-sidebar hover:bg-theme-bg-sidebar-hover hover:text-white'
           ]"
           @click.prevent="navigateTo('history')">
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm whitespace-nowrap transition-opacity duration-300"
                :class="sidebarStore.isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">{{ $t('sidebar.searchHistory') }}</span>
        </a>
        <a href="#" class="flex items-center gap-3 rounded-lg transition-colors overflow-hidden"
           :class="[
             sidebarStore.isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
             activeMenu === 'settings' ? 'bg-theme-bg-sidebar-active text-white' : 'text-theme-text-sidebar hover:bg-theme-bg-sidebar-hover hover:text-white'
           ]"
           @click.prevent="navigateTo('settings')">
          <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm whitespace-nowrap transition-opacity duration-300"
                :class="sidebarStore.isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">{{ $t('sidebar.settings') }}</span>
        </a>
      </nav>
    </div>

    <div v-if="!sidebarStore.isCollapsed" class="flex-1 flex flex-col overflow-hidden">
      <template v-if="activeMenu === 'chat'">
        <div class="px-4 pt-4">
          <div class="border-t border-theme-border-sidebar pt-4 mb-3">
            <div class="flex items-center justify-between px-2">
              <span class="text-xs text-theme-text-sidebar uppercase tracking-wider font-medium">{{ $t('sidebar.chatHistory') }}</span>
              <button class="p-1 text-theme-text-sidebar hover:text-theme-text-sidebar-hover transition-colors"
                      @click="isChatHistoryOpen = !isChatHistoryOpen">
                <svg class="w-3.5 h-3.5 transition-transform duration-200"
                     :class="isChatHistoryOpen ? 'rotate-180' : ''"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <template v-if="isChatHistoryOpen">
          <div class="px-4 mb-3">
            <div class="flex items-center gap-2 px-3 py-2 bg-theme-bg-sidebar-hover rounded-lg">
              <svg class="w-4 h-4 text-theme-text-sidebar flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input v-model="chatSearchQuery"
                     type="text"
                     :placeholder="$t('sidebar.searchChats')"
                     class="flex-1 bg-transparent text-xs text-theme-text-sidebar-hover placeholder-theme-text-sidebar outline-none" />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
            <div v-for="(chat, index) in filteredChats" :key="index"
                 class="group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                 :class="selectedChatIndex === index ? 'bg-theme-bg-sidebar-active' : 'hover:bg-theme-bg-sidebar-hover'"
                 @click="handleSelectChat(index)">
              <div class="flex-1 min-w-0 pr-16">
                <div class="text-sm text-white truncate">{{ chat.title }}</div>
                <div class="text-xs text-theme-text-sidebar mt-0.5">{{ chat.time }}</div>
              </div>
              <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="p-1 text-theme-text-sidebar hover:text-blue-400 transition-colors"
                        title="Rename chat"
                        @click.stop="handleRenameChat(index)">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="p-1 text-theme-text-sidebar hover:text-red-400 transition-colors"
                        title="Delete chat"
                        @click.stop="handleDeleteChat(index)">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="filteredChats.length === 0" class="flex flex-col items-center justify-center py-8 text-theme-text-sidebar">
              <svg class="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="text-xs">{{ $t('sidebar.noChatsFound') }}</p>
            </div>
          </div>
        </template>
      </template>

      <template v-else-if="activeMenu === 'library'">
        <div class="px-4 pt-4">
          <div class="border-t border-theme-border-sidebar pt-4 mb-3 px-2">
            <span class="text-xs text-theme-text-sidebar uppercase tracking-wider font-medium">{{ $t('sidebar.recentDownloads') }}</span>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
          <div v-for="(paper, index) in recentDownloads" :key="index"
               class="group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
               :class="selectedDownloadIndex === index ? 'bg-theme-bg-sidebar-active' : 'hover:bg-theme-bg-sidebar-hover'"
               @click="handleSelectDownload(index)">
            <div class="flex-1 min-w-0">
              <div class="text-sm text-white truncate">{{ paper.title }}</div>
              <div class="text-xs text-theme-text-sidebar mt-0.5">{{ paper.authors }}</div>
            </div>
            <div class="flex-shrink-0">
              <svg v-if="paper.status === 'completed'" class="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else class="w-4 h-4 text-theme-text-sidebar animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.864a8.25 8.25 0 0113.803-3.7l3.181 3.182" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="!sidebarStore.isCollapsed" class="px-4 py-3 border-t border-theme-border-sidebar">
      <a href="#" class="flex items-center gap-3 rounded-lg text-theme-text-sidebar hover:bg-theme-bg-sidebar-hover hover:text-white transition-colors px-4 py-2.5"
         @click.prevent="handleSignOut">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m0 0h12.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-sm whitespace-nowrap">{{ $t('sidebar.signOut') }}</span>
      </a>
    </div>
  </aside>

  <SearchHistorySidebar />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSidebarStore } from '../stores/sidebar'
import { useSearchHistoryStore } from '../stores/searchHistory'
import { useAuthStore } from '../stores/auth'
import { sessionApi } from '../api/session'
import type { SessionInfo } from '../api/types'
import SearchHistorySidebar from './SearchHistorySidebar.vue'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()
const sidebarStore = useSidebarStore()
const searchHistoryStore = useSearchHistoryStore()
const selectedChatIndex = ref(0)
const selectedDownloadIndex = ref(0)
const isChatHistoryOpen = ref(true)
const chatSearchQuery = ref('')

const activeMenu = computed<'chat' | 'library' | 'history' | 'settings'>(() => {
  const path = route.path
  if (path === '/library') return 'library'
  if (path === '/search-history') return 'history'
  if (path === '/settings') return 'settings'
  return 'chat'
})

const props = defineProps<{
  sessions?: SessionInfo[]
}>()

const emit = defineEmits<{
  (e: 'selectChat', session: SessionInfo): void
  (e: 'newChat'): void
  (e: 'deleteSession', sessionId: string): void
  (e: 'renameSession', sessionId: string, newTitle: string): void
}>()

const filteredChats = computed(() => {
  if (!chatSearchQuery.value.trim()) return recentChats
  const query = chatSearchQuery.value.toLowerCase()
  return recentChats.filter(chat =>
    chat.title.toLowerCase().includes(query) ||
    chat.time.toLowerCase().includes(query)
  )
})

function navigateTo(menu: string) {
  switch (menu) {
    case 'chat':
      router.push('/')
      break
    case 'library':
      router.push('/library')
      break
    case 'history':
      router.push('/search-history')
      break
    case 'settings':
      router.push('/settings')
      break
  }
}

function handleSelectChat(index: number) {
  selectedChatIndex.value = index
  emit('selectChat', index)
}

function handleSelectDownload(index: number) {
  selectedDownloadIndex.value = index
}

function handleNewChat() {
  emit('newChat')
}

function handleToggle() {
  sidebarStore.toggle()
}

function handleDeleteChat(index: number) {
  recentChats.splice(index, 1)
  if (selectedChatIndex.value >= recentChats.length) {
    selectedChatIndex.value = Math.max(0, recentChats.length - 1)
  }
}

function handleRenameChat(index: number) {
  const newTitle = prompt('Rename chat:', recentChats[index].title)
  if (newTitle && newTitle.trim()) {
    recentChats[index].title = newTitle.trim()
  }
}

function handleSignOut() {
  authStore.logout()
  router.push('/login')
}

const recentChats = [
  { title: 'What are the cosmic modets practro research models...', time: '10:30 AM', status: 'completed' },
  { title: 'How to use CodeBERT for vulnerability detection...', time: '9:15 AM', status: 'completed' },
  { title: 'Transformer architecture in code analysis...', time: 'Yesterday', status: 'loading' },
  { title: 'Knowledge graph construction methods...', time: 'Yesterday', status: 'completed' },
  { title: 'Compare different code generation models...', time: '2 days ago', status: 'completed' },
]

const recentDownloads = [
  { title: 'CodeFIx: Fine-tuning Large Language Models...', authors: 'Wang et al., 2024', status: 'completed' },
  { title: 'Semantic-Aware Code Representation for Vuln...', authors: 'Zhang et al., 2024', status: 'completed' },
  { title: 'Transformer-Based Code Generation: A Compre...', authors: 'Li et al., 2024', status: 'loading' },
  { title: 'Knowledge Graph Enhanced Code Understanding...', authors: 'Chen et al., 2023', status: 'completed' },
]
</script>
