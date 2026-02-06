import type { IBox, IStyleProvider, ITerminal, ITerminalStyle } from "./capabilities.interface.ts"
import { AbstractCursorPositionable, Box, TerminalStyle } from "./capabilities.ts"

export * from "./ansi-code"
export * from "./capabilities.interface.ts"
export * from "./capabilities.ts"
export * from "./types.ts"
export * from "./text.interface.ts"
export * from "./text.ts"

export class TerminalExt extends AbstractCursorPositionable implements IStyleProvider {
  readonly screen: IBox

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
  }

  getTerminal(): ITerminal {
    return this.term
  }

  getTerminalStyle() {
    return this.style
  }
}
