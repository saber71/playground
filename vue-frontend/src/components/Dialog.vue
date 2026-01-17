<template>
  <el-dialog :title="title" v-model="visible">
    <slot></slot>
    <template #footer>
      <div class="dialog-footer">
        <slot name="footer">
          <el-button @click="emits('cancel')">{{ cancelText ?? '取消' }}</el-button>
          <el-button type="primary" @click="emits('confirm')">{{
            confirmText ?? '确定'
          }}</el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineProps<{ title: string; cancelText?: string; confirmText?: string }>()
const emits = defineEmits<{ cancel: []; confirm: []; change: [boolean] }>()

const visible = ref(false)
watch(visible, () => emits('change', visible.value))

defineExpose({
  open() {
    visible.value = true
  },
  close() {
    visible.value = false
  },
})
</script>

<style scoped lang="scss"></style>
