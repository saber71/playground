<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <div>
          <el-button
            v-if="enableRefresh || enableRefresh === undefined"
            :icon="Refresh"
            @change="emits('refresh')"
          ></el-button>
          <slot name="header"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'

defineProps<{ title: string; enableRefresh?: boolean }>()
const emits = defineEmits<{ refresh: [] }>()
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
