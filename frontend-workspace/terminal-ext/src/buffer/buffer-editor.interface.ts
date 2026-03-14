import type { IDisposable } from "@saber71/shared"
import type { IStyleProvider } from "../capabilities.interface.ts"
import type { ITextMatrix } from "../text"
import type { IScreenBufferProvider } from "./buffer.interface.ts"

export type InputMode = "normal" | "insert"

export interface IScreenBufferEditor extends IStyleProvider, IScreenBufferProvider, IDisposable {
  getContent(): string

  getInputMode(): InputMode

  getTextMatrix(): ITextMatrix

  getCursorPos(): number

  setCursorPos(charIndex: number): this
}
