import type { IDisposable } from "@saber71/shared"
import type { IStyleProvider } from "../capabilities.interface.ts"
import type { ITextCellMatrixRow } from "./buffer-text-matrix.interface.ts"
import type { IScreenBufferViewProvider } from "./buffer-view.interface.ts"

export interface IWriteOption {
  clear?: boolean
}

export interface IScreenBufferWriter
  extends IStyleProvider, IDisposable, IScreenBufferViewProvider {
  write(textRows: ITextCellMatrixRow[], option?: IWriteOption): this

  erase(): this
}
