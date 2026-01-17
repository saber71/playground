<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" :inline="inline">
    <el-form-item v-for="(val, index) in config" :key="index" :label="val.label" :prop="val.prop">
      <template v-if="val.component.type === 'input-number'">
        <el-slider
          v-if="isSlider(val.component)"
          v-model="formData[val.prop]"
          :min="(val.component as any).min"
          :max="(val.component as any).max"
          show-input
          :range="isNumberRange(val.component)"
          @change="onChange"
        ></el-slider>
        <el-input-number
          v-else
          v-model="formData[val.prop]"
          :min="(val.component as any).min"
          :max="(val.component as any).max"
          :placeholder="'请输入' + val.label"
          controls-position="right"
          @change="onChange"
        ></el-input-number>
      </template>
      <el-select-v2
        v-else-if="val.component.type === 'select'"
        v-model="formData[val.prop]"
        :options="(val.component as any).options"
        filterable
        :multiple="(val.component as any).multiple"
        :placeholder="'请选择' + val.label"
        clearable
        @change="onChange"
      ></el-select-v2>
      <el-date-picker
        v-else-if="val.component.type === 'date' || val.component.type === 'datetime'"
        v-model="formData[val.prop]"
        :type="val.component.type"
        placeholder="选择日期"
        clearable
        @change="onChange"
      />
      <el-switch
        v-else-if="val.component.type === 'boolean'"
        v-model="formData[val.prop]"
      ></el-switch>
      <el-input
        v-else
        :type="val.component.type"
        v-model="formData[val.prop]"
        :placeholder="'请输入' + val.label"
        clearable
        @change="onChange"
      ></el-input>
    </el-form-item>
    <slot v-bind="formData"></slot>
  </el-form>
</template>

<script setup lang="ts">
import type { FormItems } from '@/utils/types.ts'
import type { FormInstance, FormItemRule } from 'element-plus'
import { reactive, ref } from 'vue'

const props = defineProps<{
  config: FormItems<any>
  inline?: boolean
  data?: any
}>()
const emits = defineEmits<{ change: [string, any, any, number] }>()

const formRef = ref<FormInstance>(null as any)
const formData = props.data ?? reactive<Record<string | symbol, any>>({})
const rules = reactive<Record<string | symbol, FormItemRule>>({})
for (let item of props.config) {
  if (!(item.prop in formData)) formData[item.prop] = item.initValue ?? ''
  if (item.rule) {
    if (!item.rule.trigger) item.rule.trigger = 'change'
    if (item.rule.required && !item.rule.message) item.rule.message = item.label + '不得为空'
    if (item.rule.validator) {
      const originValidator = item.rule.validator
      ;(item.rule as any).validator = (_: any, value: any, cb: any) => {
        const result = originValidator(value, formData)
        if (result) cb(new Error(result))
        else cb()
      }
    }
    rules[item.prop] = [item.rule] as any
  }
}

function isSlider(arg: any) {
  return typeof arg.min === 'number' && typeof arg.max === 'number'
}

function isNumberRange(arg: any) {
  return isSlider(arg) && arg.initValue instanceof Array
}

function onChange(val: any) {
  val.onChange?.(formData[val.prop], formData)
  emits('change', val.prop, formData[val.prop], formData, props.config.indexOf(val))
}

function reset() {
  for (let item of props.config) {
    const value = formData[item.prop]
    if (item.initValue !== undefined) formData[item.prop] = item.initValue
    else if (value instanceof Array) formData[item.prop] = []
    else formData[item.prop] = ''
  }
}

defineExpose({ formRef: () => formRef.value, formData: () => formData, reset })
</script>

<style scoped lang="scss"></style>
