<template>
  <div class="flex w-full items-start gap-4 justify-end message-enter relative" :style="{ animationDelay: animationDelay }">
    <div class="flex items-start gap-3 max-w-[calc(100%-5rem)]">
      <div class="max-w-[calc(100%-5rem)]">
        <div class="relative group">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-2xl rounded-tr-sm border-2 border-blue-200 dark:border-blue-700 px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
            <p class="text-[16px] font-medium text-gray-800 dark:text-gray-100 leading-relaxed">{{ content }}</p>
          </div>
          <div class="flex items-center justify-end gap-2 mt-2 px-1">
            <span class="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{{ formattedTime }}</span>
            <span v-if="status === 'read'" class="text-blue-500">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M1 13l5 5L17 7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 13l5 5L23 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span v-else-if="status === 'sent'" class="text-gray-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M2 13l5 5L18 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span v-else class="text-gray-400">
              <svg class="w-4 h-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </span>
          </div>
          <button class="absolute -top-2 -left-10 p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 transform" title="Copy message" @click="$emit('copy')">
            <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="flex flex-col items-end gap-1 flex-shrink-0 mt-0.5">
        <div class="w-14 h-14 rounded-full overflow-hidden border-[3px] border-blue-400 dark:border-blue-500 shadow-xl ring-4 ring-blue-100 dark:ring-blue-900/30">
          <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner">
            <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content: string
  timestamp: number
  status?: 'sending' | 'sent' | 'read'
  avatarUrl?: string
  animationDelay?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'sent',
  avatarUrl: '',
  animationDelay: '0ms',
})

defineEmits<{
  copy: []
}>()

const formattedTime = computed(() => {
  const date = new Date(props.timestamp)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
})
</script>
