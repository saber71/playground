import type { SlButtonGroup } from "@shoelace-style/shoelace"
import type { BaseComponent } from "./core/base.component.ts"
import type { BlockComponent } from "./core/block.component.ts"
import type { ButtonComponent } from "./core/button.component.ts"
import type { InputComponent } from "./core/input.component.ts"
import type { TextComponent } from "./core/text.component.ts"

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

export type PropertyKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

export type Class<T> = new (...args: any[]) => T

export type Watcher = () => void
export type StopWatcher = () => void

export interface ComponentNameMapClass {
  button: ButtonComponent
  "button-group": BaseComponent<SlButtonGroup>
  input: InputComponent
  text: TextComponent
  block: BlockComponent
}

export type ComponentName = keyof ComponentNameMapClass
