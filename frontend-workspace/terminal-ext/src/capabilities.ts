import { Apply } from "shared"
import { AnsiCursor, parseAnsiCursorPosition } from "./ansi-code.ts"
import type {
  IBox,
  ICursorControl,
  ICursorPositionable,
  IDimension,
  IEraser,
  IRect,
  IStyleProvider,
  ITerminal,
  ITerminalProvider,
  IViewport,
  IWriter,
} from "./capabilities.interface.ts"
import { TerminalStyle } from "./TerminalStyle.ts"
import { TerminalText } from "./TerminalText.ts"
import type { CursorPosition } from "./types.ts"

export abstract class AbstractTerminalProvider implements ITerminalProvider {
  abstract getTerminal(): ITerminal
}

export class StyleProvider implements IStyleProvider {
  private _style?: TerminalStyle

  getTerminalStyle(): TerminalStyle {
    if (!this._style) this._style = new TerminalStyle()
    return this._style
  }
}

export abstract class AbstractDimension implements IDimension {
  abstract getRows(): number

  abstract getCols(): number
}

export abstract class AbstractRect extends AbstractDimension implements IRect {
  abstract getEndPosition(): Readonly<CursorPosition>

  abstract getStartPosition(): Readonly<CursorPosition>

  getRows(): number {
    return this.getEndPosition().row - this.getStartPosition().row + 1
  }

  getCols(): number {
    return this.getEndPosition().col - this.getStartPosition().col + 1
  }
}

export class Viewport extends AbstractRect implements IViewport {
  private _startPosition?: CursorPosition
  private _endPosition?: CursorPosition

  getStartPosition() {
    if (!this._startPosition) throw new Error("startPosition is not set")
    return this._startPosition
  }

  getEndPosition() {
    if (!this._endPosition) throw new Error("endPosition is not set")
    return this._endPosition
  }

  setStartPosition(value: CursorPosition): this {
    this._startPosition = value
    return this
  }

  setEndPosition(value: CursorPosition): this {
    this._endPosition = value
    return this
  }
}

export abstract class AbstractEraser extends AbstractTerminalProvider implements IEraser {
  async erase(view: IRect, style: IStyleProvider) {
    const end = view.getEndPosition()
    const start = view.getStartPosition()
    const term = this.getTerminal()
    for (let i = start.col; i < end.col; i++) {
      await term.write(
        AnsiCursor.SET_POSITION(start.row, i) +
          style.getTerminalStyle().toString(" ".repeat(view.getRows())),
      )
    }
  }
}

export abstract class AbstractWriter extends AbstractTerminalProvider implements IWriter {
  async write(data: TerminalText[], view: IRect, style: IStyleProvider) {
    const maxWidth = view.getRows()
    const start = view.getStartPosition()
    const wrapped = TerminalText.wrap(maxWidth, ...data)
    const term = this.getTerminal()
    for (let i = Math.max(0, wrapped.length - view.getCols()); i < wrapped.length; i++) {
      await term.write(
        style
          .getTerminalStyle()
          .toString(
            AnsiCursor.SET_POSITION(i + start.col, start.row) +
              wrapped[i].map((i) => i.toString()).join(""),
          ),
      )
    }
  }
}

export abstract class AbstractCursorControl
  extends AbstractTerminalProvider
  implements ICursorControl
{
  showCursor() {
    return this.getTerminal().write(AnsiCursor.SHOW)
  }

  hideCursor() {
    return this.getTerminal().write(AnsiCursor.HIDE)
  }

  saveCursorPosition() {
    return this.getTerminal().write(AnsiCursor.SAVE_POSITION)
  }

  restoreCursorPosition() {
    return this.getTerminal().write(AnsiCursor.RESTORE_POSITION)
  }
}

export abstract class AbstractCursorPositionable
  extends AbstractTerminalProvider
  implements ICursorPositionable
{
  async getCursorPosition(view?: IRect) {
    const term = this.getTerminal()
    return new Promise<CursorPosition>((resolve) => {
      term.onData((str, stop) => {
        const pos = parseAnsiCursorPosition(str)
        if (!pos) return
        stop()
        if (view) {
          const start = view.getStartPosition()
          pos.row -= start.row
          pos.col -= start.col
        }
        resolve(pos)
      })
      term.write(AnsiCursor.REQUEST_POSITION)
    })
  }

  setCursorPosition(pos: CursorPosition, view?: IRect) {
    if (view) {
      pos = Object.assign({}, pos)
      const start = view.getStartPosition()
      pos.row += start.row
      pos.col += start.col
    }
    return this.getTerminal().write(AnsiCursor.SET_POSITION(pos.row, pos.col))
  }
}

export class Box
  extends Apply<
    IEraser & IViewport & IStyleProvider & ICursorControl & ICursorPositionable & IWriter
  >(
    AbstractEraser,
    Viewport,
    StyleProvider,
    AbstractCursorControl,
    AbstractCursorPositionable,
    AbstractWriter,
  )
  implements IBox
{
  constructor(
    readonly term: ITerminal,
    readonly style: TerminalStyle,
  ) {
    super()
  }

  getTerminalStyle(): TerminalStyle {
    return this.style
  }

  getTerminal(): ITerminal {
    return this.term
  }
}
