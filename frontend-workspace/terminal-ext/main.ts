import "./style.css"
import "@xterm/xterm/css/xterm.css"
import { ClipboardAddon } from "@xterm/addon-clipboard"
import { FitAddon } from "@xterm/addon-fit"
import { ImageAddon } from "@xterm/addon-image"
import { Unicode11Addon } from "@xterm/addon-unicode11"
import { Terminal as XTerm } from "@xterm/xterm"
import { type ITerminal, type Stop, TerminalExt } from "./src"

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

  onData(listener: (str: string, stop: Stop) => void, once?: boolean) {
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
}

const termExt = new TerminalExt(new Terminal(document.body))
termExt.readline.read("abcccs$ ").then(console.log)
