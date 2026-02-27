import { ScreenBufferView } from "./buffer.ts"
import type {
  IInputBox,
  ITerminalComponent,
  ITerminalComponentManager,
} from "./component.interface.ts"
import type { ITextView } from "./text.interface.ts"
import { TextView } from "./text.ts"
import type { StopListener } from "./types.ts"

export abstract class TerminalComponent extends ScreenBufferView implements ITerminalComponent {
  private _isFocused = false
  private readonly _focusListener: Array<(stop: StopListener) => void> = []
  private readonly _blurListener: Array<(stop: StopListener) => void> = []
  private readonly _keypressListener: Array<(char: string, stop: StopListener) => void> = []
  protected readonly _stopListeners: StopListener[] = []

  init(): this {
    return this
  }

  dispose(): this {
    for (let stopListener of this._stopListeners) {
      stopListener()
    }
    this._stopListeners.length = 0
    return super.dispose()
  }

  onKeyPress(listener: (char: string, stop: StopListener) => void): StopListener {
    const stop: StopListener = () => {
      const index = this._keypressListener.indexOf(listener)
      if (index >= 0) this._keypressListener.splice(index, 1)
    }
    this._keypressListener.push(listener)
    return stop
  }

  keypress(char: string): this {
    if (this._isFocused) {
      for (let listener of this._keypressListener) {
        listener(char, () => {
          const index = this._keypressListener.indexOf(listener)
          if (index >= 0) this._keypressListener.splice(index, 1)
        })
      }
    }
    return this
  }

  onFocus(listener: (stop: StopListener) => void): StopListener {
    const stop: StopListener = () => {
      const index = this._focusListener.indexOf(listener)
      if (index >= 0) this._focusListener.splice(index, 1)
    }
    this._focusListener.push(listener)
    return stop
  }

  onBlur(listener: (stop: StopListener) => void): StopListener {
    const stop: StopListener = () => {
      const index = this._blurListener.indexOf(listener)
      if (index >= 0) this._blurListener.splice(index, 1)
    }
    this._blurListener.push(stop)
    return stop
  }

  focus(): this {
    if (!this._isFocused) {
      this._isFocused = true
      for (let listener of this._focusListener) {
        const stop: StopListener = () => {
          const index = this._focusListener.indexOf(listener)
          if (index >= 0) this._focusListener.splice(index, 1)
        }
        listener(stop)
      }
    }
    return this
  }

  blur(): this {
    if (this._isFocused) {
      this._isFocused = false
      for (let listener of this._blurListener) {
        const stop: StopListener = () => {
          const index = this._blurListener.indexOf(listener)
          if (index >= 0) this._blurListener.splice(index, 1)
        }
        listener(stop)
      }
    }
    return this
  }

  isFocused(): boolean {
    return this._isFocused
  }
}

export class TerminalComponentManager implements ITerminalComponentManager {
  private _focused: ITerminalComponent | undefined

  focus(component: ITerminalComponent): this {
    this._focused = component
    component.focus()
    return this
  }

  blur(): this {
    if (this._focused) {
      this._focused.blur()
      this._focused = undefined
    }
    return this
  }

  getFocused(): ITerminalComponent | undefined {
    return this._focused
  }

  keypress(char: string): this {
    this._focused?.keypress(char)
    return this
  }
}

export class InputBox extends TerminalComponent implements IInputBox {
  private readonly _text: ITextView = new TextView([])

  init(): this {
    this._stopListeners.push(
      this.onKeyPress((char) => {
        if (!this.isFocused()) return
        this._text.append(char)
        const curCell = this.getScreenBuffer().getCursorOn()
      }),
    )
    return this
  }
}
