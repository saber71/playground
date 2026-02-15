import type { IScreenBufferView } from "./buffer.interface.ts"
import type { StopListener } from "./types.ts"

export interface ITerminalComponent extends IScreenBufferView {
  onFocus(listener: (stop: StopListener) => void): StopListener

  focus(): this

  onBlur(listener: (stop: StopListener) => void): StopListener

  blur(): this

  isFocused(): boolean
}

export interface ITerminalComponentManager {
  focus(component: ITerminalComponent): this

  blur(): this

  getFocused(): ITerminalComponent | undefined
}

export interface ITerminalComponentManagerProvider {
  getTerminalComponentManager(): ITerminalComponentManager
}
