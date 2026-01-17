<template>
  <Dynamics :configs="dynamicConfigs"></Dynamics>
  <Grid :columns="2" gap="20px">
    <div style="background: red; height: 10px"></div>
    <div style="background: blue; height: 10px"></div>
    <div style="background: blue; height: 10px"></div>
  </Grid>
</template>

<script setup lang="ts">
import Dialog from '@/components/Dialog.vue'
import { DynamicComponent } from '@/components/Dynamics/DynamicComponent.ts'
import Dynamics from '@/components/Dynamics/Dynamics.vue'
import Form from '@/components/Form.vue'
import Grid from '@/components/Grid.vue'
import type { FormItems } from '@/utils/types.ts'
import { AddLocation, Delete } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const button1 = new DynamicComponent(
  ElButton,
  { type: 'primary', icon: h(AddLocation) },
  {
    click: () => {
      console.log(dynamicForm.ref.formData())
    },
  },
).child('console log formData')
const button2 = new DynamicComponent(
  ElButton,
  { type: 'primary', icon: h(Delete) },
  {
    click: () => {
      dialog.ref.open()
    },
  },
).child('show dialog')
const dialog = new DynamicComponent(
  Dialog,
  { title: 'test dialog' },
  {
    confirm: () => {
      console.log('confirm')
      dialog.ref.close()
    },
    cancel() {
      console.log('cancel')
      dialog.ref.close()
    },
  },
)
const dynamicForm = new DynamicComponent(Form, {
  config: [
    { label: 'label1', prop: 'prop1', component: { type: 'text' }, rule: { required: true } },
    { label: 'label2', prop: 'prop2', component: { type: 'password' }, rule: { required: true } },
    { label: 'label3', prop: 'prop3', component: { type: 'boolean' }, initValue: false },
    {
      label: 'label4',
      prop: 'prop4',
      component: {
        type: 'select',
        options: [
          { label: '123', value: 1 },
          { label: '23', value: 3 },
        ],
      },
    },
  ] as FormItems<any>,
})
const dynamicConfigs: DynamicComponent[] = [button1, button2, dialog, dynamicForm]
</script>
