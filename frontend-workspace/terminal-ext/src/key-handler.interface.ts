import type { IKey } from "./ansi-code"
import type { IDisposable } from "./types.ts"

// 当返回false时将不再执行后续的监听器
export type KeyListener = (key: IKey) => void | false

export type IKeySubscription = IDisposable

export interface IKeyHandler extends IDisposable {
  isEnabled(): boolean

  enable(): this

  disable(): this

  onData(cb: KeyListener): IKeySubscription
}
