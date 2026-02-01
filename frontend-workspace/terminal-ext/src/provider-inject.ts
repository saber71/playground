import type { SymbolKey } from "./inject-key.ts"

const map = new Map<SymbolKey<any>, any>()

export function providerValue<T>(key: SymbolKey<T>, value: T) {
  map.set(key, value)
  return value
}

export function injectValue<T>(key: SymbolKey<T>): T {
  if (!map.has(key)) throw new Error(`${key} is not provided`)
  return map.get(key)!
}
