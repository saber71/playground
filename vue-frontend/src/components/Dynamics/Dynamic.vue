<template>
  <component ref="el" :is="config.component" v-bind="config.getProps()" v-on="config.events">
    <template v-for="val in config.getChildren()">
      <Dynamic v-if="val instanceof DynamicComponent" :config="val"></Dynamic>
      <template v-else>{{ val }}</template>
    </template>
  </component>
</template>

<script setup lang="ts">
import { DynamicComponent } from '@/components/Dynamics/DynamicComponent.ts'
import { onMounted, ref } from 'vue'

const props = defineProps<{ config: DynamicComponent }>()
const el = ref()
onMounted(() => {
  props.config.mount(el.value)
})
</script>

<style scoped lang="scss"></style>
