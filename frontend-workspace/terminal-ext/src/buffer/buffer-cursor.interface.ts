import type { IScreenBufferView } from "./buffer-view.interface.ts"
import type { IScreenBufferProvider } from "./buffer.interface.ts"

export interface IBufferCursorController extends IScreenBufferProvider {
  getScreenBufferView(): IScreenBufferView

  up(): this

  down(): this

  left(wrap?: boolean): this

  right(wrap?: boolean): this

  byChar(char: string): this
}
