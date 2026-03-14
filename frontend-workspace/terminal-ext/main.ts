import "./style.css"
import "@xterm/xterm/css/xterm.css"
import { ActionChain } from "@saber71/shared"
import { ClipboardAddon } from "@xterm/addon-clipboard"
import { FitAddon } from "@xterm/addon-fit"
import { ImageAddon } from "@xterm/addon-image"
import { Unicode11Addon } from "@xterm/addon-unicode11"
import { Terminal as XTerm } from "@xterm/xterm"
import {
  createRect,
  createTextChar,
  type ITerminal,
  parseKey,
  ScreenBufferTextMatrix,
  ScreenBufferWriter,
  StyledText,
  TerminalExt,
  TextMatrix,
} from "./src"

class Terminal implements ITerminal {
  readonly xterm = new XTerm({
    allowProposedApi: true,
    allowTransparency: true,
    fontFamily: "monospace",
  })
  private readonly _dataActionChain = new ActionChain<string>()

  constructor(el: HTMLElement) {
    const fitAddon = new FitAddon()
    this.xterm.loadAddon(new ClipboardAddon())
    this.xterm.loadAddon(new ImageAddon())
    this.xterm.loadAddon(fitAddon)
    this.xterm.loadAddon(new Unicode11Addon())
    this.xterm.unicode.activeVersion = "11"
    this.xterm.open(el)
    fitAddon.fit()
    this.xterm.onData((seq) => this._dataActionChain.invoke(seq))
  }

  onData() {
    return this._dataActionChain
  }

  write(data: any): Promise<void> {
    return new Promise<void>((resolve) => {
      if (typeof data === "object" && data) data = data.toString()
      else data = String(data)
      this.xterm.write(data, resolve)
    })
  }

  getRows(): number {
    return this.xterm.rows
  }

  getCols(): number {
    return this.xterm.cols
  }
}

const termExt = new TerminalExt(new Terminal(document.body))
termExt.autoFlushBuffer = true
termExt.style.backcolor = "white"
termExt.style.forecolor = "blue"
const view = termExt.getScreenBuffer().getScreenBufferView(
  createRect(
    {
      row: 3,
      col: 1,
    },
    {
      row: 5,
      col: 7,
    },
  ),
)

const textMatrix = new TextMatrix(
  new StyledText("的雾气大窘123撒大家撒都期待无期1321321大大撒").toChars(),
  7,
)
  .remove(1, { deleteCount: 2, flush: false })
  .remove(undefined, { flush: false })
  .append(createTextChar("可"), { flush: false })
  .append([createTextChar("柯"), createTextChar("科")], { at: 4 })
  .replace(2, createTextChar("哈"))
console.log(textMatrix)

const writer = new ScreenBufferWriter(view)
writer.getTerminalStyle().backcolor = "yellow"
// writer.getTerminalStyle().bold = true
writer.getTerminalStyle().italic = true
writer.getTerminalStyle().forecolor = "red"
writer.write(new ScreenBufferTextMatrix(textMatrix, view).setAlign("center").getRows())
termExt
  .getTerminalLines()
  .writeRect(createRect({ row: 10, col: 20 }, { row: 15, col: 40 }), { mode: "heavy" })
termExt
  .getTerminal()
  .onData()
  .bind((str) => {
    console.log(parseKey(str))
  })
