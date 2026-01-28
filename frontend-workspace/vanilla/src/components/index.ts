import { type Ext, HTMLElementExt } from "./HTMLElementExt.ts"
import type { SlFlex } from "./SlFlex.ts"
import type { SlGrid } from "./SlGrid.ts"

declare global {
  interface HTMLElementTagNameMap {
    "sl-flex": SlFlex
    "sl-grid": SlGrid
  }
}

export * from "./HTMLElementExt.ts"
export * from "./SlFlex.ts"
export * from "./SlGrid.ts"
export * from "./BaseElement.ts"

export function createElExt<K extends keyof HTMLElementTagNameMap>(
  name: K,
): HTMLElementTagNameMap[K] & Ext {
  // constructor.observedAttributes
  const el = document.createElement(name)
  return HTMLElementExt(el as any)
}
