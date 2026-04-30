<template>
  <div class="match-score-slider" :class="{ 'slider-disabled': disabled }">
    <div 
      ref="trackRef"
      class="slider-track"
      :class="{ 'active': isDragging, 'disabled': disabled }"
      @mousedown="onMouseDown"
      @touchstart.passive="onTouchStart"
    >
      <!-- 填充轨道 -->
      <div 
        class="slider-fill" 
        :style="{ width: fillPercentage + '%' }"
        :class="{ 'disabled': disabled }"
      ></div>
      
      <!-- 滑块按钮 -->
      <div 
        class="slider-thumb"
        :style="{ left: thumbPosition + '%' }"
        :class="{ 
          'dragging': isDragging, 
          'disabled': disabled,
          [`score-${currentLabel}`]: true 
        }"
      ></div>
      
      <!-- 刻度标记 -->
      <div class="tick-marks">
        <div 
          v-for="tick in ticks" 
          :key="tick.value"
          class="tick-mark"
          :class="{ 
            'active': modelValue >= tick.value,
            'disabled': disabled
          }"
          :style="{ left: tick.position + '%' }"
        ></div>
      </div>
    </div>
    
    <!-- 数值显示 -->
    <div class="slider-value-display" :class="{ 'disabled': disabled }">
      {{ displayValue }}%
    </div>
    
    <!-- 标签提示 -->
    <div v-if="showTooltip && !disabled" class="tooltip" :style="{ left: tooltipPosition + '%' }">
      {{ currentLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean  // 新增：是否禁用
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false  // 默认不禁用
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const trackRef = ref<HTMLElement>()
const isDragging = ref(false)

// 标签配置
const scoreLabels: Record<number, string> = {
  40: '宽松',
  50: '适中',
  60: '推荐',
  70: '严格',
  80: '精确'
}

const ticks = computed(() => {
  const result = []
  for (let value = props.min; value <= props.max; value += props.step) {
    result.push({
      value,
      position: ((value - props.min) / (props.max - props.min)) * 100
    })
  }
  return result
})

const fillPercentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

const thumbPosition = computed(() => fillPercentage.value)

const displayValue = computed(() => Math.round(props.modelValue))

const currentLabel = computed(() => scoreLabels[props.modelValue] || '')

const showTooltip = computed(() => isDragging.value)

const tooltipPosition = computed(() => thumbPosition.value)

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function snapToStep(value: number): number {
  const stepped = Math.round(value / props.step) * props.step
  return clamp(stepped, props.min, props.max)
}

function getPositionFromEvent(event: MouseEvent | TouchEvent): number {
  if (!trackRef.value) return props.modelValue
  
  const rect = trackRef.value.getBoundingClientRect()
  
  let clientX: number
  if ('touches' in event) {
    clientX = event.touches[0].clientX
  } else {
    clientX = event.clientX
  }
  
  const position = ((clientX - rect.left) / rect.width) * 100
  const value = props.min + (position / 100) * (props.max - props.min)
  
  return snapToStep(value)
}

function updateValue(newValue: number) {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
  }
}

function onMouseDown(event: MouseEvent) {
  if (props.disabled) return  // 禁用时阻止所有交互
  
  event.preventDefault()
  isDragging.value = true
  updateValue(getPositionFromEvent(event))
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(event: MouseEvent) {
  if (!isDragging.value || props.disabled) return
  updateValue(getPositionFromEvent(event))
}

function onMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function onTouchStart(event: TouchEvent) {
  if (props.disabled) return  // 禁用时阻止所有交互
  
  isDragging.value = true
  updateValue(getPositionFromEvent(event))
  
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
}

function onTouchMove(event: TouchEvent) {
  if (!isDragging.value || props.disabled) return
  event.preventDefault()
  updateValue(getPositionFromEvent(event))
}

function onTouchEnd() {
  isDragging.value = false
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
})
</script>

<style scoped>
.match-score-slider {
  position: relative;
  width: 100%;
  padding: 8px 0;
  user-select: none;
  transition: opacity 0.2s ease;
}

/* 禁用状态 */
.slider-disabled {
  opacity: 0.6;
  pointer-events: none;  /* 关键：禁止所有鼠标/触摸事件 */
}

.slider-track {
  position: relative;
  width: 100%;
  height: 8px;
  background: linear-gradient(to right, #e5e7eb, #f3f4f6);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider-track:hover:not(.disabled) {
  height: 10px;
}

.slider-track.active:not(.disabled) {
  height: 12px;
}

/* 禁用的轨道 */
.slider-track.disabled {
  background: #e5e7eb;
  cursor: not-allowed;
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  border-radius: 4px;
  transition: width 0.1s ease-out;
  pointer-events: none;
}

.slider-fill.disabled {
  background: #9ca3af;  /* 禁用时使用灰色 */
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 22px;
  height: 22px;
  background: white;
  border: 3px solid #10b981;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  z-index: 10;
  pointer-events: auto;
}

/* 禁用的滑块 */
.slider-thumb.disabled {
  border-color: #9ca3af;
  box-shadow: 0 2px 8px rgba(156, 163, 175, 0.2);
  cursor: not-allowed;
  pointer-events: none;
}

.slider-thumb:hover:not(.disabled) {
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.slider-thumb.dragging:not(.disabled) {
  transform: translate(-50%, -50%) scale(1.25);
  border-color: #059669;
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
  cursor: grabbing;
}

/* 分数相关的颜色变化 */
.slider-thumb.score-40 { border-color: #f59e0b; }
.slider-thumb.score-50 { border-color: #84cc16; }
.slider-thumb.score-60 { border-color: #10b981; }
.slider-thumb.score-70 { border-color: #06b6d4; }
.slider-thumb.score-80 { border-color: #8b5cf6; }

.tick-marks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tick-mark {
  position: absolute;
  top: 50%;
  width: 2px;
  height: 12px;
  background: #d1d5db;
  transform: translate(-50%, -50%);
  border-radius: 1px;
  transition: all 0.2s ease;
}

.tick-mark.active:not(.disabled) {
  background: #10b981;
  height: 16px;
  width: 3px;
}

.tick-mark.disabled {
  background: #9ca3af;
}

.slider-value-display {
  text-align: center;
  margin-top: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #10b981;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  transition: color 0.2s ease;
}

.slider-value-display.disabled {
  color: #9ca3af;
}

.tooltip {
  position: absolute;
  top: -36px;
  transform: translateX(-50%);
  padding: 4px 12px;
  background: #1f2937;
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  animation: fadeInUp 0.2s ease;
  z-index: 20;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: #1f2937;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
