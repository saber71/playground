export * from "./buffer.ts"
export * from "./cursor.ts"
export * from "./erase.ts"
export * from "./key-code.ts"
export * from "./style.ts"

export function hasAnsiCode(str: string) {
  return /\x1b\[[^A-Za-z]*[A-Za-z]/.test(str)
}
