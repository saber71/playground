import type { IStyleProvider } from "../capabilities.interface.ts"
import type { IScreenBufferManager } from "./buffer-manager.interface.ts"
import type { IScreenBuffer } from "./buffer.interface.ts"
import { ScreenBuffer } from "./buffer.ts"

export class ScreenBufferManager implements IScreenBufferManager {
  private readonly _stack: IScreenBuffer[] = []

  constructor(buffer: IScreenBuffer) {
    this._stack.push(buffer)
  }

  getScreenBuffer(): IScreenBuffer {
    return this._stack.at(-1)!
  }

  add(styleProvider: IStyleProvider): this {
    const buffer = this.getScreenBuffer()
    this._stack.push(new ScreenBuffer(buffer.getRows(), buffer.getCols(), styleProvider))
    return this
  }

  pop() {
    if (this._stack.length === 1) throw new Error("Cannot pop the last buffer")
    this._stack.pop()
    this.getScreenBuffer().markFullUpdate()
    return this
  }
}
