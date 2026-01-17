<template>
  <Dynamic v-for="(val, index) in configs" :config="val" :key="index"></Dynamic>
</template>

<script setup lang="ts">
import Dynamic from './Dynamic.vue'
import { DynamicComponent } from './DynamicComponent.ts'

defineProps<{ configs: DynamicComponent[] }>()
</script>

<style scoped lang="scss"></style>
