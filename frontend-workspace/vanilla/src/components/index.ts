import { type Ext, HTMLElementExt } from "./HTMLElementExt.ts"
import type { SlFlex } from "./SlFlex.ts"

declare global {
  interface HTMLElementTagNameMap {
    "sl-flex": SlFlex
  }
}

export * from "./HTMLElementExt.ts"
export * from "./SlFlex.ts"
export * from "./BaseElement.ts"

export function createElement<K extends keyof HTMLElementTagNameMap>(
  name: K,
): HTMLElementTagNameMap[K] & Ext {
  return HTMLElementExt(document.createElement(name) as any)
}
