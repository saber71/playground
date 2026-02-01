import type { ICursorManager } from "./ICursorManager.ts"
import type { IEraser } from "./IEraser.ts"
import type { IReadLine } from "./IReadLine.ts"
import type { ITerminal } from "./ITerminal.ts"

export interface SymbolKey<T> extends Symbol {}

export const InjectKeyTerminal: SymbolKey<ITerminal> = Symbol()
export const InjectKeyCursorManager: SymbolKey<ICursorManager> = Symbol()
export const InjectKeyEraser: SymbolKey<IEraser> = Symbol()
export const InjectKeyReadLine: SymbolKey<IReadLine> = Symbol()
