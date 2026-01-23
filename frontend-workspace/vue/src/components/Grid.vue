<template>
  <div class="grid-container" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  columnGap?: number | string
  rowGap?: number | string
  inline?: boolean
  flowDirection?: 'column' | 'row'
  gap?: number | string
  columns: number
}>()

const style = computed<any>(() => {
  return {
    display: props.inline ? 'inline-grid' : 'grid',
    columnGap: toPx(props.columnGap),
    rowGap: toPx(props.rowGap),
    gridAutoFlow: props.flowDirection,
    gap: toPx(props.gap),
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  } as Partial<CSSStyleDeclaration>
})

function toPx(val?: number | string) {
  return typeof val === 'number' ? val + 'px' : val
}
</script>

<style scoped lang="scss"></style>
