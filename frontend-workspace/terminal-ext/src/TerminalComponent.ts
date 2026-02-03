import type { ITerminal } from "./capabilities/ITerminal.ts"

export class TerminalComponent {
  constructor(readonly term: ITerminal) {}
}
