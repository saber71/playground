import "./style.css"
import "@xterm/xterm/css/xterm.css"
import { ClipboardAddon } from "@xterm/addon-clipboard"
import { FitAddon } from "@xterm/addon-fit"
import { ImageAddon } from "@xterm/addon-image"
import { Unicode11Addon } from "@xterm/addon-unicode11"
import { Terminal as XTerm } from "@xterm/xterm"
import { type ITerminal, type StopListener, StyledText, TerminalExt, TextView } from "./src"
import { createRect } from "./src/utils"

class Terminal implements ITerminal {
  readonly xterm = new XTerm({
    allowProposedApi: true,
    allowTransparency: true,
    fontFamily: "monospace",
  })

  constructor(el: HTMLElement) {
    const fitAddon = new FitAddon()
    this.xterm.loadAddon(new ClipboardAddon())
    this.xterm.loadAddon(new ImageAddon())
    this.xterm.loadAddon(fitAddon)
    this.xterm.loadAddon(new Unicode11Addon())
    this.xterm.unicode.activeVersion = "11"
    this.xterm.open(el)
    fitAddon.fit()
  }

  onData(listener: (str: string, stop: StopListener) => void, once?: boolean) {
    if (once) {
      const disposable = this.xterm.onData((str) => {
        listener(str, () => disposable.dispose())
        disposable.dispose()
      })
    } else {
      const disposable = this.xterm.onData((str) => {
        listener(str, () => disposable.dispose())
      })
    }
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
termExt.style.backcolor = "white"
termExt.style.forecolor = "blue"
const textView = new TextView([
  new StyledText("的雾气大窘12撒大家撒都期待无期132\n1321"),
  new StyledText("\n"),
  new StyledText("123ada", { bold: true, strikeThrough: true }),
])
  .setMaxWidth(12)
  .update()
const view = termExt.getScreenBuffer().getScreenBufferView(
  createRect(
    {
      row: 3,
      col: 1,
    },
    {
      row: 5,
      col: 11,
    },
  ),
)
view.getStyle().backcolor = "yellow"
view.getStyle().bold = true
view.getStyle().forecolor = "red"
view.write(textView.getViewport({ startRow: 0, endRow: 4 }), { align: "right" })
termExt.flushBuffer().then(() => {})
