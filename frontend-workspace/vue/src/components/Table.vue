<template>
  <Form v-if="filters" :config="filters" inline :data="query" />
  <el-table class="table" :data="data" :max-height="maxHeight" :height="height">
    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      :label="column.label"
      :prop="column.prop"
      v-bind="column.config"
    >
      <template v-if="column.config?.slot" #default="scope">
        <slot :name="column.config.slot" v-bind="scope" />
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="margin-top: 16px; justify-content: flex-end"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    :page-size="pageSize"
    :current-page="curPage"
    @size-change="handleSizeChange"
    @current-change="handlePageChange"
  />
</template>

<script lang="ts" setup>
import type { Page } from '@/api/request.ts'
import Form from '@/components/Form.vue'
import type { FormItems, TableColumns } from '@/utils/types.ts'
import { reactive, ref } from 'vue'

const props = defineProps<{
  filters?: FormItems<any>
  dataGetter: (page: number, size: number, query: any) => Promise<Page<any>>
  columns: TableColumns
  maxHeight?: string | number
  height?: string | number
}>()

const curPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const data = ref<Array<any>>([])
const query = reactive<Record<string | symbol, any>>({})
props.filters?.forEach((filter) => {
  query[filter.prop] = ''
  const originOnChange = filter.onChange
  filter.onChange = (...args) => {
    originOnChange?.(...args)
    fetchData(1)
  }
})

function handleSizeChange(size: number) {
  pageSize.value = size
  fetchData(1, size)
}

function handlePageChange(page: number) {
  curPage.value = page
  fetchData(page)
}

async function fetchData(page: number = curPage.value, size: number = pageSize.value) {
  const res = await props.dataGetter(page, size, query)
  data.value = res.content
  total.value = res.page.totalElements
}

fetchData()

function refreshData(page: number = curPage.value, size: number = pageSize.value) {
  curPage.value = page
  pageSize.value = size
  return fetchData()
}

defineExpose<{ refreshData: (page?: number, size?: number) => Promise<void> }>({ refreshData })
</script>

<style lang="scss">
.query-form + .table {
  margin-top: 16px;
}
</style>
