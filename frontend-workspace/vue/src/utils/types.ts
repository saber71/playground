import type { FormItemRule, InputType, TableColumnCtx } from 'element-plus'
import type { VNode } from 'vue'

export interface BaseEntity {
  createAt: string
  updateAt: string
  deleted: boolean
  deleteAt: string
  deleteBy: number | null
}

export type TableColumns = Array<{
  label: string
  prop: string
  config?: {
    slot?: string
    width?: string | number
    minWidth?: string | number
    type?: 'selection' | 'index'
    showOverflowTooltip?: boolean
    formatter?: (row: any, column: TableColumnCtx, cellValue: any, index: number) => VNode | string
  }
}>

export type FormItems<T> = Array<{
  label: string
  prop: keyof T
  initValue?: any
  onChange?: (value: any, formData: T) => void
  component:
    | { type: InputType }
    | { type: 'input-number'; min?: number; max?: number }
    | {
        type: 'select'
        options: Array<{ label: string; value: string }>
        multiple?: boolean
      }
    | { type: 'date' | 'datetime' }
    | { type: 'boolean' }
  rule?: Omit<FormItemRule, 'validator'> & {
    validator?: (value: any, formData: any) => void | string
  }
}>
