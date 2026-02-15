import type { IScreenBufferView } from "./buffer.interface.ts"
import type { StopListener } from "./types.ts"

export interface ITerminalComponent extends IScreenBufferView {
  onFocus(listener: (stop: StopListener) => void): StopListener

  focus(): this

  onBlur(listener: (stop: StopListener) => void): StopListener

  blur(): this

  isFocused(): boolean

  onKeyPress(listener: (char: string, stop: StopListener) => void): StopListener

  keypress(char: string): this
}

export interface ITerminalComponentManager {
  focus(component: ITerminalComponent): this

  blur(): this

  getFocused(): ITerminalComponent | undefined

  keypress(char: string): this
}

export interface ITerminalComponentManagerProvider {
  getTerminalComponentManager(): ITerminalComponentManager
}

export interface IInputBox extends ITerminalComponent {}
