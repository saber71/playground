import "./style.css"
import "@xterm/xterm/css/xterm.css"
import { ClipboardAddon } from "@xterm/addon-clipboard"
import { FitAddon } from "@xterm/addon-fit"
import { ImageAddon } from "@xterm/addon-image"
import { Unicode11Addon } from "@xterm/addon-unicode11"
import { Terminal as XTerm } from "@xterm/xterm"
import { type ITerminal, type StopListener, StyledText, TerminalExt, TextView } from "./src"

class Terminal implements ITerminal {
  readonly xterm = new XTerm({
    allowProposedApi: true,
    allowTransparency: true,
    fontFamily: "monospace",
    convertEol: true,
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
termExt.screen.erase(termExt.screen, termExt).then(async () => {
  const textView = new TextView([
    new StyledText("的雾气大窘12撒大家撒都期待无期132\n1321"),
    new StyledText("\n"),
    new StyledText("123ada", { bold: true, strikeThrough: true }),
  ])
    .setMaxWidth(11)
    .update()
  const renderArea = termExt.screen.create({
    bold: true,
    inverse: true,
    backcolor: "red",
    italic: true,
  })
  renderArea.setStartPosition({ row: 10, col: 10 }).setEndPosition({ row: 13, col: 20 })
  await renderArea.erase(renderArea, renderArea)
  termExt.screen.write(
    textView.getViewport({ startRow: 0, endRow: 4, startIndex: 0, maxWidth: 8 }),
    renderArea,
    renderArea,
    { align: "left" },
  )
})
