import type { AxiosResponse } from 'axios'
import { dayjs, ElMessage, type TableColumnCtx } from 'element-plus'

export const commonCatch = (res: AxiosResponse) => {
  ElMessage({
    message: res.data || '操作失败',
    type: 'error',
  })
}

export const commonDatetimeFormatter = (datetime: string | number | Date) =>
  dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')

export const commonTableColumnDatetimeFormatter = (
  row: any,
  column: TableColumnCtx,
  cellValue: any,
  index: number,
) => commonDatetimeFormatter(cellValue)
