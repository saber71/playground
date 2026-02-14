import type {
  IScreenBuffer,
  IScreenBufferManager,
  IScreenBufferManagerProvider,
  IScreenBufferProvider,
} from "./buffer.interface.ts"
import { ScreenBuffer, ScreenBufferManager } from "./buffer.ts"
import type { IBox, IStyleProvider, ITerminal, ITerminalStyle } from "./capabilities.interface.ts"
import { AbstractCursorPositionable, Box, TerminalStyle } from "./capabilities.ts"

export * from "./ansi-code"
export * from "./capabilities.interface.ts"
export * from "./capabilities.ts"
export * from "./buffer.interface.ts"
export * from "./buffer.ts"
export * from "./text.interface.ts"
export * from "./text.ts"
export * from "./types.ts"

export class TerminalExt
  extends AbstractCursorPositionable
  implements IStyleProvider, IScreenBufferProvider, IScreenBufferManagerProvider
{
  readonly screen: IBox
  private readonly _screenBufferManager: IScreenBufferManager

  constructor(
    readonly term: ITerminal,
    readonly style: ITerminalStyle = new TerminalStyle(),
  ) {
    super()
    this.screen = new Box(term, style).setStartPosition({ row: 1, col: 1 }).setEndPosition({
      get row() {
        return term.getRows()
      },
      get col() {
        return term.getCols()
      },
    })
    this._screenBufferManager = new ScreenBufferManager(
      new ScreenBuffer(term.getRows(), term.getCols(), this),
    )
  }

  getScreenBuffer(): IScreenBuffer {
    return this._screenBufferManager.getScreenBuffer()
  }

  getScreenBufferManager(): IScreenBufferManager {
    return this._screenBufferManager
  }

  getTerminal(): ITerminal {
    return this.term
  }

  getTerminalStyle() {
    return this.style
  }

  async flushBuffer() {
    const output = this.getScreenBuffer().outputDiff()
    if (!output) return
    return this.term.write(output)
  }
}
