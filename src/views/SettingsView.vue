<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 flex flex-col bg-[#f5f5f0] overflow-hidden">
        <div class="flex-1 overflow-y-auto p-8">
          <div class="max-w-3xl mx-auto">
            <h1 class="text-2xl font-bold text-gray-800 mb-8">Settings <span class="text-xl font-normal text-gray-500">设置</span></h1>

            <div class="space-y-6">
              <section class="bg-white rounded-xl border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Profile
                </h2>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Display Name</label>
                    <input v-model="settings.displayName" type="text"
                           class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input v-model="settings.email" type="email"
                           class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors" />
                  </div>
                </div>
              </section>

              <section class="bg-white rounded-xl border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Search Preferences
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Default Year Range</label>
                    <div class="flex items-center gap-3">
                      <input v-model.number="settings.yearRangeStart" type="number"
                             class="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors"
                             placeholder="2020" />
                      <span class="text-gray-400">to</span>
                      <input v-model.number="settings.yearRangeEnd" type="number"
                             class="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors"
                             placeholder="2026" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Minimum Match Score</label>
                    <div class="flex items-center gap-3">
                      <input v-model.number="settings.minMatchScore" type="range" min="0" max="1" step="0.05"
                             class="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                      <span class="text-sm text-gray-600 w-12">{{ (settings.minMatchScore * 100).toFixed(0) }}%</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Max Results per Search</label>
                    <input v-model.number="settings.maxResults" type="number"
                           class="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors"
                           min="10" max="100" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-2">Search Sources</label>
                    <div class="flex flex-wrap gap-3">
                      <label v-for="source in searchSources" :key="source.id"
                             class="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors"
                             :class="settings.sources.includes(source.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'">
                        <input type="checkbox" :value="source.id" v-model="settings.sources"
                               class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span class="text-sm text-gray-700">{{ source.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-white rounded-xl border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  RAG Configuration
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Max Context Papers</label>
                    <input v-model.number="settings.maxContextPapers" type="number"
                           class="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 transition-colors"
                           min="1" max="20" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm text-gray-700 font-medium">Include Citations in Response</label>
                      <p class="text-xs text-gray-400 mt-0.5">Add citation references to AI responses</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="settings.includeCitations" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm text-gray-700 font-medium">Enable Stream Response</label>
                      <p class="text-xs text-gray-400 mt-0.5">Stream AI responses token by token</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="settings.stream" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </section>

              <section class="bg-white rounded-xl border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Appearance
                </h2>
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm text-gray-700 font-medium">Auto-collapse Sidebar</label>
                    <p class="text-xs text-gray-400 mt-0.5">Automatically collapse sidebar when clicking the logo</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="settings.autoCollapseSidebar" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </section>

              <section class="bg-white rounded-xl border border-red-200 p-6">
                <h2 class="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Danger Zone
                </h2>
                <div class="flex flex-wrap gap-3">
                  <button class="px-4 py-2 bg-white border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                          @click="handleClearCache">
                    Clear Cache
                  </button>
                  <button class="px-4 py-2 bg-white border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                          @click="handleResetSettings">
                    Reset Settings
                  </button>
                  <button class="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          @click="handleDeleteAccount">
                    Delete Account
                  </button>
                </div>
              </section>

              <div class="flex items-center justify-end gap-3 pb-4">
                <button class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        @click="handleCancel">
                  Cancel
                </button>
                <button class="px-6 py-2.5 bg-[#1a2538] text-white text-sm font-medium rounded-lg hover:bg-[#2d4059] transition-colors"
                        @click="handleSave">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'

const searchSources = [
  { id: 'google_scholar', label: 'Google Scholar' },
  { id: 'semantic_scholar', label: 'Semantic Scholar' },
  { id: 'arxiv', label: 'arXiv' },
  { id: 'pubmed', label: 'PubMed' },
]

const settings = ref({
  displayName: 'Researcher',
  email: 'researcher@example.com',
  yearRangeStart: 2020,
  yearRangeEnd: 2026,
  minMatchScore: 0.7,
  maxResults: 50,
  sources: ['google_scholar', 'semantic_scholar'],
  maxContextPapers: 5,
  includeCitations: true,
  stream: false,
  autoCollapseSidebar: true,
})

function handleSave() {
  localStorage.setItem('app-settings', JSON.stringify(settings.value))
  alert('Settings saved successfully!')
}

function handleCancel() {
  const saved = localStorage.getItem('app-settings')
  if (saved) {
    settings.value = JSON.parse(saved)
  }
}

function handleClearCache() {
  if (confirm('Clear all cached data?')) {
    localStorage.clear()
    alert('Cache cleared!')
  }
}

function handleResetSettings() {
  if (confirm('Reset all settings to default?')) {
    settings.value = {
      displayName: 'Researcher',
      email: 'researcher@example.com',
      yearRangeStart: 2020,
      yearRangeEnd: 2026,
      minMatchScore: 0.7,
      maxResults: 50,
      sources: ['google_scholar', 'semantic_scholar'],
      maxContextPapers: 5,
      includeCitations: true,
      stream: false,
      autoCollapseSidebar: true,
    }
    localStorage.removeItem('app-settings')
  }
}

function handleDeleteAccount() {
  if (confirm('Delete your account? This action cannot be undone.')) {
    alert('Account deletion request submitted.')
  }
}
</script>
