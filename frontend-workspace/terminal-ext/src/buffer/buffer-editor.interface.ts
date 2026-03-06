import type { IStyleProvider } from "../capabilities.interface.ts"
import type { IDisposable } from "../types.ts"
import type { IScreenBufferProvider } from "./buffer.interface.ts"

export type InputMode = "normal" | "insert"

export interface IScreenBufferEditor extends IStyleProvider, IScreenBufferProvider, IDisposable {
  getContent(): string

  getInputMode(): InputMode
}
