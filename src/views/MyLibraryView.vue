<template>
  <div class="flex h-screen overflow-hidden bg-[#f5f5f0]">
    <Sidebar @selectChat="handleSelectChat" @newChat="handleNewChat" :activeMenu="'library'" />

    <div class="flex flex-1 overflow-hidden relative">
      <main class="flex flex-col bg-[#f5f5f0] overflow-hidden flex-1 min-w-0">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <h1 class="text-xl font-bold text-gray-800">My Library <span class="text-lg font-normal text-gray-500 ml-2">我的文献库</span></h1>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 class="text-2xl font-bold text-gray-800 leading-snug mb-4">{{ currentPaper.title }}</h2>

              <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-5 pb-5 border-b border-gray-100">
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ currentPaper.authors }}</span>
                </div>
                <span class="text-gray-300">|</span>
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ currentPaper.source }}</span>
                </div>
                <span class="text-gray-300">|</span>
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ currentPaper.date }}</span>
                </div>
                <span class="text-gray-300">|</span>
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>DOI: {{ currentPaper.doi }}</span>
                </div>
                <span class="text-gray-300">|</span>
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Citations: {{ currentPaper.citations }}</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mb-6">
                <span v-for="(kw, i) in currentPaper.keywords" :key="i"
                      class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                  {{ kw }}
                </span>
              </div>

              <div class="mb-8">
                <h3 class="text-sm font-bold text-gray-800 mb-3">Abstract</h3>
                <p class="text-sm text-gray-600 leading-relaxed">{{ currentPaper.fullAbstract }}</p>
              </div>

              <div class="mb-8">
                <h3 class="text-sm font-bold text-gray-800 mb-3">Model Performance</h3>
                <div class="overflow-hidden rounded-lg border border-gray-200">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-[#d4edc2]">
                        <th class="border-b border-r border-gray-300 px-4 py-2.5 text-left font-semibold text-gray-700">Model Name</th>
                        <th class="border-b border-r border-gray-300 px-4 py-2.5 text-left font-semibold text-gray-700">Core Performance</th>
                        <th class="border-b border-r border-gray-300 px-4 py-2.5 text-left font-semibold text-gray-700">Test Dataset</th>
                        <th class="border-b border-gray-300 px-4 py-2.5 text-left font-semibold text-gray-700">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, index) in performanceData" :key="index"
                          :class="row.isSota ? 'bg-[#d4edc2]' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')">
                        <td class="border-b border-r border-gray-200 px-4 py-2.5 font-medium" :class="row.isSota ? 'text-gray-800' : 'text-gray-700'">
                          {{ row.model }}
                        </td>
                        <td class="border-b border-r border-gray-200 px-4 py-2.5" :class="row.isSota ? 'font-bold text-gray-800' : 'text-gray-600'">
                          {{ row.accuracy }}
                        </td>
                        <td class="border-b border-r border-gray-200 px-4 py-2.5" :class="row.isSota ? 'font-semibold text-gray-800' : 'text-gray-600'">
                          {{ row.dataset }}
                        </td>
                        <td class="border-b border-gray-200 px-4 py-2.5" :class="row.isSota ? 'font-bold text-gray-800' : 'text-gray-600'">
                          {{ row.year }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="mb-8">
                <h3 class="text-sm font-bold text-gray-800 mb-4">Model Implementation Details</h3>
                <div class="flex gap-8">
                  <div class="flex-1">
                    <div class="bg-gray-100 rounded-lg p-6 flex items-center justify-center border border-gray-200">
                      <svg viewBox="0 0 280 120" class="w-full max-w-[280px]">
                        <rect x="10" y="40" width="35" height="40" rx="4" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/>
                        <text x="27" y="65" text-anchor="middle" class="text-[10px] fill-gray-600">Input</text>

                        <line x1="45" y1="60" x2="65" y2="60" stroke="#9ca3af" stroke-width="1"/>

                        <rect x="65" y="30" width="20" height="60" rx="3" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/>
                        <text x="75" y="65" text-anchor="middle" class="text-[8px] fill-gray-600">TF</text>

                        <line x1="85" y1="60" x2="105" y2="60" stroke="#9ca3af" stroke-width="1"/>

                        <rect x="105" y="20" width="70" height="80" rx="6" fill="#d4edc2" stroke="#6b7280" stroke-width="1"/>
                        <text x="140" y="55" text-anchor="middle" class="text-[10px] fill-gray-700 font-semibold">Model</text>
                        <text x="140" y="75" text-anchor="middle" class="text-[8px] fill-gray-500">Implementation</text>

                        <line x1="175" y1="60" x2="195" y2="60" stroke="#9ca3af" stroke-width="1"/>

                        <rect x="195" y="30" width="20" height="60" rx="3" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/>
                        <text x="205" y="65" text-anchor="middle" class="text-[8px] fill-gray-600">TF</text>

                        <line x1="215" y1="60" x2="235" y2="60" stroke="#9ca3af" stroke-width="1"/>

                        <rect x="235" y="40" width="35" height="40" rx="4" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/>
                        <text x="252" y="65" text-anchor="middle" class="text-[10px] fill-gray-600">Output</text>
                      </svg>
                    </div>
                  </div>

                  <div class="flex-1 space-y-4">
                    <div>
                      <h4 class="text-xs font-bold text-gray-800 mb-2">Core Innovations</h4>
                      <ul class="text-xs text-gray-600 space-y-1.5">
                        <li class="flex items-start gap-2">
                          <span class="text-green-500 mt-0.5">●</span>
                          <span>Proposed novel fine-tuning approach for reliable program bug repair</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-green-500 mt-0.5">●</span>
                          <span>Combined static analysis with deep learning for improved accuracy</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-green-500 mt-0.5">●</span>
                          <span>Achieved state-of-the-art results on HumanEval and Defects4J datasets</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-gray-800 mb-2">Technical Implementation Details</h4>
                      <ul class="text-xs text-gray-600 space-y-1.5">
                        <li class="flex items-start gap-2">
                          <span class="text-blue-500 mt-0.5">●</span>
                          <span>Pre-trained language model fine-tuning with code-specific objectives</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-blue-500 mt-0.5">●</span>
                          <span>Multi-stage training pipeline with progressive difficulty</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-gray-800 mb-2">Open-Source Code</h4>
                      <a href="#" class="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.692-1.226 1.182-.337 2.448-.505 3.712-.505 1.264 0 2.53.168 3.712.505 1.684.904 2.692 1.226 2.692 1.226.652 1.652.241 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        https://github.com/CodeFix/large-language-model-bug-repair
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <aside
        class="flex flex-col bg-white overflow-hidden transition-all duration-300 ease-in-out border-l border-gray-200 flex-shrink-0"
        :class="isRightSidebarOpen ? 'w-[360px] min-w-[360px]' : 'w-0 min-w-0 opacity-0 pointer-events-none border-l-0'"
      >
        <template v-if="isRightSidebarOpen">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <h3 class="text-sm font-bold text-gray-800">Downloaded Literature List</h3>
            <button class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    @click="isRightSidebarOpen = false">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="px-4 py-3 border-b border-gray-200 flex items-center gap-2 flex-shrink-0">
            <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-transparent focus-within:border-gray-300 transition-colors">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input v-model="searchQuery" type="text" placeholder="Search" class="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none"/>
            </div>
            <button class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">Filter</button>
            <button class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
              Sort
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 4.5h14.25m-14.25 0l5.25 5.25m-5.25-5.25l5.25-5.25M3 19.5h14.25m-14.25 0l5.25-5.25m-5.25 5.25l5.25 5.25" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-3 space-y-2">
            <div v-for="(paper, index) in filteredPapers" :key="index"
                 class="bg-white rounded-xl border p-3 cursor-pointer transition-all hover:shadow-sm"
                 :class="selectedPaper?.title === paper.title ? 'border-[#1a2538] shadow-md' : 'border-gray-200'"
                 @click="selectedPaper = paper">
              <h4 class="text-xs font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">{{ paper.title }}</h4>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-gray-500">{{ paper.authors }} | {{ paper.year }}</span>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <button class="px-4 py-1.5 bg-[#1a2538] text-white text-xs rounded-lg hover:bg-[#2d4059] transition-colors flex items-center gap-1.5"
                        @click.stop="handleOpenFile(paper)">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3.75 9.776c.121-.276.264-.538.427-.784l9.368-14.05a1.125 1.125 0 011.89 0l9.368 14.05c.163.246.306.508.427.784m-13.126 5.478a5.25 5.25 0 010-9.504m13.126 9.504a5.25 5.25 0 000-9.504M4.5 16.5v3a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 19.5v-3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Open
                </button>
                <button class="px-2.5 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                        @click.stop="handleDelete(paper)">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </template>
      </aside>

      <button
        v-if="!isRightSidebarOpen"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-white border border-gray-200 rounded-l-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        @click="isRightSidebarOpen = true"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15.75 4.5l-7.5 7.5 7.5 7.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isRightSidebarOpen = ref(true)
const searchQuery = ref('')

interface Paper {
  title: string
  authors: string
  date: string
  source: string
  fullAbstract: string
  keywords: string[]
  citations: number
  doi: string
  year: string
}

const currentPaper = computed<Paper>(() => {
  if (selectedPaper.value) {
    const idx = downloadedPapers.value.findIndex(p => p.title === selectedPaper.value!.title)
    return idx !== -1 ? downloadedPapers.value[idx] : downloadedPapers.value[0]
  }
  return downloadedPapers.value[0]
})

const selectedPaper = ref<Paper | null>(downloadedPapers.value[0] || null)

const performanceData = [
  { model: 'CodeT5 et al.', accuracy: '78.42%', dataset: 'HumanEval', year: '2021', isSota: false },
  { model: 'CodeBERT et al.', accuracy: '82.15%', dataset: 'Defects4J', year: '2022', isSota: false },
  { model: 'SOTA (CodeFix)', accuracy: '93.80%', dataset: 'HumanEval', year: '2024', isSota: true },
  { model: 'SEXS et al.', accuracy: '88.00%', dataset: 'HumanEval', year: '2020', isSota: false },
  { model: 'UniPLane et al.', accuracy: '91.31%', dataset: 'HumanEval', year: '2020', isSota: false },
  { model: 'Synthetic et al.', accuracy: '90.09%', dataset: 'Defects4J', year: '2023', isSota: false },
  { model: 'Prediff et al.', accuracy: '92.27%', dataset: 'HumanEval', year: '2023', isSota: false },
]

const downloadedPapers = ref<Paper[]>([
  {
    title: 'CodeFIx: Fine-tuning Large Language Models for Reliable Program Bug Repair',
    authors: 'Wang et al., 2024',
    date: 'Mar 15, 2024',
    source: 'arXiv Preprint',
    fullAbstract: 'Fine-tuning large language models for reliable program bug repair has become a critical area of research in software engineering. In this paper, we present CodeFix, a novel approach that leverages pre-trained language models for automated bug detection and repair. Our method combines static analysis with deep learning to achieve state-of-the-art results on multiple benchmarks including HumanEval and Defects4J. We demonstrate significant improvements over existing methods in both accuracy and efficiency, with our approach achieving a 93.80% success rate on bug repair tasks.',
    keywords: ['CodeFix', 'Large Language Models', 'Bug Repair', 'Fine-tuning', 'Program Analysis'],
    citations: 33,
    doi: '10.48550/arXiv.2403.xxxxx',
  },
  {
    title: 'Semantic-Aware Code Representation for Vulnerability Detection',
    authors: 'Zhang et al., 2024',
    date: 'Feb 28, 2024',
    source: 'IEEE TSE',
    fullAbstract: 'This paper explores semantic-aware code representation learning for improved vulnerability detection in software systems. We propose a novel architecture that captures both syntactic and semantic features of source code through multi-modal learning.',
    keywords: ['Vulnerability Detection', 'Code Representation', 'Deep Learning'],
    citations: 21,
    doi: '10.1109/TSE.2024.yyyyy',
  },
  {
    title: 'Transformer-Based Code Generation: A Comprehensive Survey',
    authors: 'Li et al., 2024',
    date: 'Jan 10, 2024',
    source: 'ACM Computing Surveys',
    fullAbstract: 'A comprehensive survey on transformer-based architectures for code generation tasks across multiple programming languages. We review recent advances and provide insights into future research directions.',
    keywords: ['Transformers', 'Code Generation', 'Survey'],
    citations: 15,
    doi: '10.1145/3600000',
  },
  {
    title: 'Knowledge Graph Enhanced Code Understanding for Software Engineering',
    authors: 'Chen et al., 2023',
    date: 'Dec 5, 2023',
    source: 'Springer',
    fullAbstract: 'This work addresses the challenge of reliable program bug repair using fine-tuned language models with knowledge graph integration to improve code understanding.',
    keywords: ['Knowledge Graph', 'Code Understanding'],
    citations: 8,
    doi: '10.1007/s00000-023-00000-0',
  },
])

const filteredPapers = computed(() => {
  if (!searchQuery.value.trim()) return downloadedPapers.value
  const query = searchQuery.value.toLowerCase()
  return downloadedPapers.value.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.authors.toLowerCase().includes(query)
  )
})

function handleDelete(paper: Paper) {
  const idx = downloadedPapers.value.findIndex(p => p.title === paper.title)
  if (idx === -1) return
  downloadedPapers.value.splice(idx, 1)
  if (selectedPaper.value?.title === paper.title) {
    selectedPaper.value = downloadedPapers.value[0] || null
  }
}

function handleOpenFile(paper: Paper) {
  console.log('Opening local file for:', paper.title)
}

function handleSelectChat(index: number) {
  router.push('/')
}

function handleNewChat() {
  router.push('/')
}
</script>

<style scoped>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
