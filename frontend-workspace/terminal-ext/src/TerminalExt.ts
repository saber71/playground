import type { ITerminal } from "./capabilities/ITerminal.ts"
import { CursorManager, type ICursorManager } from "./ICursorManager.ts"
import { Eraser, type IEraser } from "./IEraser.ts"
import {
  InjectKeyCursorManager,
  InjectKeyEraser,
  InjectKeyReadLine,
  InjectKeyTerminal,
} from "./inject-key.ts"
import { type IReadLine, ReadLine } from "./IReadLine.ts"
import { providerValue } from "./provider-inject.ts"

export class TerminalExt {
  readonly cursorManager: ICursorManager
  readonly eraser: IEraser
  readonly readline: IReadLine

  constructor(readonly term: ITerminal) {
    providerValue(InjectKeyTerminal, term)
    this.cursorManager = providerValue(InjectKeyCursorManager, new (CursorManager(Object))())
    this.eraser = providerValue(InjectKeyEraser, new (Eraser(Object))())
    this.readline = providerValue(InjectKeyReadLine, new (ReadLine(Object))())
  }
}
