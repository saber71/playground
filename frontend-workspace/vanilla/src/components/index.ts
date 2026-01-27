import type { Flex } from "./Flex.ts"
import { type Ext, HTMLElementExt } from "./HTMLElementExt.ts"

declare global {
  interface HTMLElementTagNameMap {
    "sl-flex": Flex
  }
}

export * from "./HTMLElementExt.ts"
export * from "./Flex.ts"
export * from "./BaseElement.ts"

export function createElement<K extends keyof HTMLElementTagNameMap>(
  name: K,
): HTMLElementTagNameMap[K] & Ext {
  return HTMLElementExt(document.createElement(name) as any)
}
