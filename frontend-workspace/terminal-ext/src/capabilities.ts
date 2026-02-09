import deepEqual from "deep-equal"
import { Apply, type Color, isNil, parseColor } from "shared"
import {
  AnsiBack,
  AnsiCursor,
  AnsiFore,
  AnsiReset,
  AnsiStyle,
  parseAnsiCursorPosition,
} from "./ansi-code.ts"
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
  ITerminalStyle,
  IViewport,
  IWriteOption,
  IWriter,
} from "./capabilities.interface.ts"
import type { ITextChar, ITextViewport } from "./text.interface.ts"
import type { CursorPosition } from "./types.ts"

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
  private _parent?: IViewport | null

  setParent(val?: IViewport) {
    this._parent = val
    return this
  }

  getParent() {
    return this._parent
  }

  getStartPosition() {
    if (!this._startPosition) throw new Error("startPosition is not set")
    if (this._parent) {
      const parentStart = this._parent.getStartPosition()
      return {
        row: parentStart.row + this._startPosition.row,
        col: parentStart.col + this._startPosition.col,
      }
    }
    return this._startPosition
  }

  getEndPosition() {
    if (!this._endPosition) throw new Error("endPosition is not set")
    if (this._parent) {
      const parentStart = this._parent.getStartPosition()
      return {
        row: this._endPosition.row + parentStart.row,
        col: this._endPosition.col + parentStart.col,
      }
    }
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

export class TerminalStyle implements ITerminalStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  inverse?: boolean
  strikeThrough?: boolean
  forecolor?: Color | string | number
  backcolor?: Color | string | number
  parent?: ITerminalStyle

  constructor(option?: Partial<ITerminalStyle>) {
    Object.assign(this, option)
  }

  equals(other: ITerminalStyle): boolean {
    if (other === this) return true
    const props: Array<keyof ITerminalStyle> = [
      "bold",
      "italic",
      "underline",
      "inverse",
      "strikeThrough",
      "forecolor",
      "backcolor",
    ]
    for (let prop of props) {
      if (!deepEqual(this.get(prop), other.get(prop))) return false
    }
    return true
  }

  get<Key extends keyof ITerminalStyle>(key: Key): TerminalStyle[Key] | undefined {
    let result = this[key]
    let parent = this.parent
    while (isNil(result) && parent) {
      result = parent[key] as any
      parent = parent.parent
    }
    return result
  }

  toString(str: string = "", reset: boolean = true) {
    const fore = this.get("forecolor")
    const back = this.get("backcolor")
    const forecolor = !isNil(fore) ? parseColor(fore).join(";") : ""
    const backcolor = !isNil(back) ? parseColor(back).join(";") : ""
    const styles: number[] = []
    if (this.get("bold")) styles.push(AnsiStyle.BOLD)
    if (this.get("italic")) styles.push(AnsiStyle.ITALIC)
    if (this.get("strikeThrough")) styles.push(AnsiStyle.STRIKE_THROUGH)
    if (this.get("inverse")) styles.push(AnsiStyle.INVERSE)
    if (this.get("underline")) styles.push(AnsiStyle.UNDERLINE)
    const codes: string[] = []
    if (styles.length) codes.push(styles.join(";"))
    if (forecolor) codes.push(AnsiFore + ";" + forecolor)
    if (backcolor) codes.push(AnsiBack + ";" + backcolor)
    if (codes.length) return `\x1B[${codes.join(";")}m${str}${reset ? AnsiReset : ""}`
    return str
  }
}

export abstract class AbstractTerminalProvider implements ITerminalProvider {
  abstract getTerminal(): ITerminal
}

export abstract class AbstractStyleProvider implements IStyleProvider {
  abstract getTerminalStyle(): ITerminalStyle
}

export abstract class AbstractEraser extends AbstractTerminalProvider implements IEraser {
  async erase(view: IRect, style: IStyleProvider) {
    const end = view.getEndPosition()
    const start = view.getStartPosition()
    const term = this.getTerminal()
    for (let i = start.row; i <= end.row; i++) {
      await term.write(
        AnsiCursor.SET_POSITION(i, start.col) +
          style.getTerminalStyle().toString(" ".repeat(view.getCols())),
      )
    }
  }
}

export abstract class AbstractWriter extends AbstractTerminalProvider implements IWriter {
  async write(data: ITextViewport, view: IRect, style: IStyleProvider, options?: IWriteOption) {
    const start = view.getStartPosition()
    const term = this.getTerminal()
    const array: string[] = []
    const rows = data.getRegion().endRow - data.getRegion().startRow + 1
    for (let i = 0; i < rows && i < view.getRows(); i++) {
      const chars = data.getChars(i)
      if (chars.length === 0) continue
      let group: Readonly<ITextChar>[] = []
      const groups: Readonly<ITextChar>[][] = [group]
      for (let char of chars) {
        if (group.length) {
          const last = group.at(-1)!
          if (last.style.equals(char.style)) group.push(char)
          else {
            group = [char]
            groups.push(group)
          }
        } else {
          group.push(char)
        }
      }
      const strWithWidths = groups.map((group) => {
        const str = group.map((i) => i.char).join("")
        const width = group.reduce((acc, char) => acc + char.width, 0)
        return { str, width, style: group[0].style }
      })
      const strings = strWithWidths.map((i) => i.style.toString(i.str))
      const width = strWithWidths.reduce((pre, cur) => pre + cur.width, 0)
      let bias = view.getCols() - width
      if (options?.align === "center") bias = Math.floor(bias / 2)
      else if (options?.align === "left" || !options?.align) bias = 0
      array.push(
        style
          .getTerminalStyle()
          .toString(AnsiCursor.SET_POSITION(i + start.row, start.col + bias) + strings.join("")),
      )
    }
    await term.write(array.join(""))
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
    IEraser & Viewport & IStyleProvider & ICursorControl & ICursorPositionable & IWriter
  >(
    AbstractEraser,
    Viewport,
    AbstractStyleProvider,
    AbstractCursorControl,
    AbstractCursorPositionable,
    AbstractWriter,
  )
  implements IBox
{
  constructor(
    readonly term: ITerminal,
    readonly style: ITerminalStyle,
    parent?: IBox,
  ) {
    super()
    this.setParent(parent)
  }

  create(style?: Partial<ITerminalStyle>) {
    return new Box(
      this.term,
      new TerminalStyle(Object.assign({}, style, { parent: this.style })),
    ).setParent(this)
  }

  getTerminalStyle(): ITerminalStyle {
    return this.style
  }

  getTerminal(): ITerminal {
    return this.term
  }
}
