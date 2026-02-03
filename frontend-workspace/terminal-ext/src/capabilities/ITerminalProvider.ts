import { InjectKeyTerminal } from "../inject-key.ts"
import { injectValue } from "../provider-inject.ts"
import type { ITerminal } from "./ITerminal.ts"

export interface ITerminalProvider {
  getTerminal(): ITerminal
}

export class TerminalProvider implements ITerminalProvider {
  getTerminal() {
    return injectValue(InjectKeyTerminal)
  }
}
