import type { Class } from "./types.ts"

export function Apply<T = any>(...array: Class<any>[]): Class<T> {
  const Base = class MultiBase {}
  array.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        Base.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      )
    })
  })
  return Base as any
}
