import type { CursorPosition } from "../ansi-code.ts"
import type { IDimension } from "./IDimension.ts"

export interface IRange extends IDimension {
  getStartPosition(): Readonly<CursorPosition>

  getEndPosition(): Readonly<CursorPosition>
}

export abstract class AbstractRange implements IRange {
  abstract getEndPosition(): Readonly<CursorPosition>

  abstract getStartPosition(): Readonly<CursorPosition>

  getRows(): number {
    return this.getEndPosition().row - this.getStartPosition().row + 1
  }

  getCols(): number {
    return this.getEndPosition().col - this.getStartPosition().col + 1
  }
}
