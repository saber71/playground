import type { IStyleProvider } from "../capabilities.interface.ts"
import type { IScreenBufferProvider } from "./buffer.interface.ts"

export interface IScreenBufferManager extends IScreenBufferProvider {
  pop(): this

  add(styleProvider: IStyleProvider): this
}

export interface IScreenBufferManagerProvider {
  getScreenBufferManager(): IScreenBufferManager
}
