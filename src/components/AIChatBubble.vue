<template>
  <div class="flex items-start gap-3 message-enter" :style="{ animationDelay: animationDelay }">
    <div class="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="max-w-[calc(100%-3rem)]">
      <div class="relative group">
        <div class="bg-theme-bg-chat-ai rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-md transition-colors duration-300">
          <p class="text-[15px] text-theme-text-inverse leading-relaxed">{{ content }}</p>
          <div v-if="papersFound !== undefined" class="mt-3 flex items-center gap-2">
            <span class="text-xs text-green-400 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ t('home.papersFound', { count: papersFound }) }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-1.5 px-1">
          <span class="text-[11px] text-theme-text-tertiary">{{ formattedTime }}</span>
        </div>
        <button class="absolute -top-2 -right-10 p-1.5 bg-theme-bg-card border border-theme-border-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" title="Copy message" @click="$emit('copy')">
          <svg class="w-4 h-4 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  content: string
  timestamp: number
  papersFound?: number
  animationDelay?: string
}

const props = withDefaults(defineProps<Props>(), {
  papersFound: undefined,
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
