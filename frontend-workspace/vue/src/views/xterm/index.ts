import { ClipboardAddon } from "@xterm/addon-clipboard"
import { FitAddon } from "@xterm/addon-fit"
import { ImageAddon } from "@xterm/addon-image"
import { Unicode11Addon } from "@xterm/addon-unicode11"
import { Terminal } from "@xterm/xterm"

export class TerminalExt {
  readonly term: Terminal

  constructor(readonly container: HTMLElement) {
    const term = new Terminal({
      allowProposedApi: true,
      allowTransparency: true,
      fontFamily: "monospace",
      convertEol: true,
    })
    const fitAddon = new FitAddon()
    term.loadAddon(new ClipboardAddon())
    term.loadAddon(new ImageAddon())
    term.loadAddon(fitAddon)
    term.loadAddon(new Unicode11Addon())
    term.unicode.activeVersion = "11"
    term.open(container)
    fitAddon.fit()
    this.term = term
  }
}
