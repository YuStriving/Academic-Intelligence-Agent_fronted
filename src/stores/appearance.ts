import { defineStore } from 'pinia'
import { ref } from 'vue'

export type FontSize = 'small' | 'standard' | 'large'
export type SpacingMode = 'compact' | 'standard' | 'loose'

const FONT_SCALE_MAP: Record<FontSize, number> = {
  small: 0.875,
  standard: 1,
  large: 1.125,
}

const SPACING_SCALE_MAP: Record<SpacingMode, number> = {
  compact: 0.75,
  standard: 1,
  loose: 1.25,
}

export const useAppearanceStore = defineStore('appearance', () => {
  const fontSize = ref<FontSize>('standard')
  const spacingMode = ref<SpacingMode>('standard')

  function initAppearance() {
    const savedFont = localStorage.getItem('app-font-size') as FontSize | null
    if (savedFont && (savedFont === 'small' || savedFont === 'standard' || savedFont === 'large')) {
      fontSize.value = savedFont
    }

    const savedSpacing = localStorage.getItem('app-spacing-mode') as SpacingMode | null
    if (savedSpacing && (savedSpacing === 'compact' || savedSpacing === 'standard' || savedSpacing === 'loose')) {
      spacingMode.value = savedSpacing
    }

    applyFontSize()
    applySpacingMode()
  }

  function setFontSize(size: FontSize) {
    fontSize.value = size
    localStorage.setItem('app-font-size', size)
    applyFontSize()
  }

  function setSpacingMode(mode: SpacingMode) {
    spacingMode.value = mode
    localStorage.setItem('app-spacing-mode', mode)
    applySpacingMode()
  }

  function applyFontSize() {
    const scale = FONT_SCALE_MAP[fontSize.value]
    document.documentElement.style.setProperty('--font-scale', String(scale))
    document.documentElement.style.fontSize = `${16 * scale}px`
  }

  function applySpacingMode() {
    const mode = spacingMode.value
    document.documentElement.setAttribute('data-spacing', mode)
    const scale = SPACING_SCALE_MAP[mode]
    document.documentElement.style.setProperty('--spacing-scale', String(scale))
  }

  return {
    fontSize,
    spacingMode,
    initAppearance,
    setFontSize,
    setSpacingMode,
  }
})
