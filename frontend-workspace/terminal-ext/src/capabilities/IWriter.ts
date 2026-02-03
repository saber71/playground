import { Apply, toString } from "shared"
import { TerminalText } from "../TerminalText.ts"
import type { IRange } from "./IRange.ts"
import { type IStyleProvider, StyleProvider } from "./IStyleProvider.ts"
import { type ITerminalProvider, TerminalProvider } from "./ITerminalProvider.ts"

export interface IWriter extends ITerminalProvider {
  write(data: any): this

  writeEcho(data: any): Promise<string>

  flush(): Promise<void>
}

export interface IRangedWriter extends IWriter, IRange {}

export interface IStyledWriter extends IWriter, IStyleProvider {}

export class Writer extends TerminalProvider implements IWriter {
  private _writeBuffer?: string[]

  get writeBuffer(): string[] {
    if (!this._writeBuffer) this._writeBuffer = []
    return this._writeBuffer
  }

  write(data: any) {
    this.writeBuffer.push(toString(data))
    return this
  }

  async writeEcho(data: any): Promise<string> {
    await this.flush()
    return new Promise((resolve) => {
      const term = this.getTerminal()
      term.onData(resolve, true)
      term.write(toString(data))
    })
  }

  async flush() {
    if (!this.writeBuffer.length) return
    const writeBuffer = this.writeBuffer.join("")
    this.writeBuffer.length = 0
    await this.getTerminal().write(writeBuffer)
  }
}

export class StyledWriter
  extends Apply<IStyleProvider & Writer>(Writer, StyleProvider)
  implements IStyledWriter
{
  write(data: any) {
    if (data instanceof TerminalText) data = data.toString()
    else data = this.getTerminalStyle().toString(toString(data))
    Writer.prototype.write.call(this, data)
    return this
  }
}
