import type {
  IScreenBuffer,
  IScreenBufferManager,
  IScreenBufferManagerProvider,
  IScreenBufferProvider,
} from "./buffer"
import { ScreenBuffer, ScreenBufferManager } from "./buffer"
import type { IStyleProvider, ITerminal, ITerminalStyle } from "./capabilities.interface.ts"
import { TerminalStyle } from "./capabilities.ts"
import type { ITerminalLines, ITerminalLinesProvider } from "./lines.interface.ts"
import { TerminalLines } from "./lines.ts"

export * from "./ansi-code"
export * from "./buffer"
export * from "./text"
export * from "./capabilities.interface.ts"
export * from "./capabilities.ts"
export * from "./lines.interface.ts"
export * from "./lines.ts"
export * from "./types.ts"
export * from "./utils.ts"

export class TerminalExt
  implements
    IStyleProvider,
    IScreenBufferProvider,
    IScreenBufferManagerProvider,
    ITerminalLinesProvider
{
  private readonly _screenBufferManager: IScreenBufferManager
  private readonly _terminalLines: ITerminalLines

  constructor(
    readonly term: ITerminal,
    readonly style: ITerminalStyle = new TerminalStyle(),
  ) {
    this._screenBufferManager = new ScreenBufferManager(
      new ScreenBuffer(term.getRows(), term.getCols(), this),
    )
    this._terminalLines = new TerminalLines(this)
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

  getTerminalLines(): ITerminalLines {
    return this._terminalLines
  }
}
