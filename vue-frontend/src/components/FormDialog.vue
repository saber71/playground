<template>
  <Dialog
    ref="dialogRef"
    :title="title"
    :cancel-text="cancelText"
    :confirm-text="confirmText"
    @change="(val) => emits('change', val)"
    @cancel="emits('cancel')"
    @confirm="emits('confirm')"
  >
    <Form :config="config" :data="data" @change="handleFormChange" />
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '@/components/Dialog.vue'
import Form from '@/components/Form.vue'
import type { FormItems } from '@/utils/types.ts'
import { ref } from 'vue'

const props = defineProps<{
  title: string
  cancelText?: string
  confirmText?: string
  config: FormItems<any>
  data?: any
}>()
const emits = defineEmits<{
  cancel: []
  confirm: []
  change: [boolean]
  formChange: [string, any, any, number]
}>()
const dialogRef = ref<InstanceType<typeof Dialog>>(null as any)
const formRef = ref<InstanceType<typeof Form>>(null as any)

function handleFormChange(prop: string, value: any, formData: any, index: number) {
  emits('formChange', prop, value, formData, index)
  if (index === props.config.length - 1) emits('confirm')
}

defineExpose({
  open: () => dialogRef.value.open(),
  close: () => dialogRef.value.close(),
  reset: () => formRef.value.reset(),
  formRef: () => formRef.value.formRef(),
  formData: () => formRef.value.formData(),
})
</script>

<style scoped lang="scss"></style>
