export interface PageVo<T> {
  content: T[]
  page: {
    number: number
    size: number
    totalElements: number
    totalPages: number
  }
}
