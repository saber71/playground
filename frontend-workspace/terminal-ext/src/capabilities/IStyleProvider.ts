import { TerminalStyle } from "../TerminalStyle.ts"

export interface IStyleProvider {
  getTerminalStyle(): TerminalStyle
}

export class StyleProvider implements IStyleProvider {
  private _style?: TerminalStyle

  getTerminalStyle(): TerminalStyle {
    if (!this._style) this._style = new TerminalStyle()
    return this._style
  }
}
