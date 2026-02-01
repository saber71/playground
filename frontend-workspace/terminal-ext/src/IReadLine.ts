import type { Class } from "shared"
import { InjectKeyTerminal } from "./inject-key.ts"
import { injectValue } from "./provider-inject.ts"

export interface IReadLine {
  read(prompt?: any): Promise<string>
}

export function ReadLine<Base extends Class<Object>>(base: Base): Base & Class<IReadLine> {
  return class extends base implements IReadLine {
    readonly term = injectValue(InjectKeyTerminal)

    async read(prompt?: any) {
      if (prompt) await this.term.write(prompt)
      return new Promise<string>((resolve) => {
        let input = ""
        this.term.onData((str: string, stop) => {
          if (str === "\n" || str === "\r") {
            this.term.write("\n")
            resolve(input)
            stop()
          } else {
            input += str
            this.term.write(str)
          }
        })
      })
    }
  }
}
