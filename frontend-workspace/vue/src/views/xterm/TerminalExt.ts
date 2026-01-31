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

  readline() {
    return new Promise<string>((resolve) => {
      let input = ""
      const listener = (str: string) => {
        if (str === "\n" || str === "\r") {
          this.term.write("\n")
          console.log("resolve", input)
          resolve(input)
          disposable.dispose()
        } else {
          input += str
          this.term.write(str)
        }
      }
      const disposable = this.term.onData(listener)
    })
  }

  write(data: any) {
    return new Promise<void>((resolve) => {
      if (typeof data === "object" && data) data = data.toString()
      else data = String(data)
      this.term.write(data, resolve)
    })
  }

  writeln(data: any) {
    return new Promise<void>((resolve) => {
      if (typeof data === "object" && data) data = data.toString()
      else data = String(data)
      this.term.writeln(data, resolve)
    })
  }

  getCursorPosition() {
    return new Promise<[number, number]>((resolve) => {
      const stop = this.term.onData((str) => {
        const pos = str.replace("\x1B[", "").replace("R", "")
        stop.dispose()
        resolve(pos.split(";").map(Number) as any)
      })
      this.term.write("\x1B[6n")
    })
  }

  saveCursorPosition() {
    return this.write("\x1b[s")
  }

  restoreCursorPosition() {
    return this.write("\x1b[u")
  }

  cursorTop(n = 1) {
    return this.write(`\x1b[${n}A`)
  }

  cursorDown(n = 1) {
    return this.write(`\x1b[${n}B`)
  }

  cursorRight(n = 1) {
    return this.write(`\x1b[${n}C`)
  }

  cursorLeft(n = 1) {
    return this.write(`\x1b[${n}D`)
  }

  async setCursor(pos: { row?: number; col?: number }) {
    if (typeof pos.row !== "number" || typeof pos.col !== "number") {
      const curPos = await this.getCursorPosition()
      if (typeof pos.row !== "number") pos.row = curPos[0]
      if (typeof pos.col !== "number") pos.col = curPos[1]
    }
    return this.write(`\x1b[${pos.row};${pos.col}H`)
  }

  hideCursor() {
    return this.write("\x1b[?25l")
  }

  showCursor() {
    return this.write("\x1b[?25h")
  }

  cursorAutoWrap(val: boolean) {
    return this.write(val ? "\x1b[?7h" : "\x1b[?7l")
  }

  // 清除整个屏幕，并将光标移至左上角（1,1）
  clear() {
    return this.write("\x1b[2J")
  }

  // 清除从当前光标位置到屏幕末尾的所有内容（含当前字符）
  clearBottom() {
    return this.write("\x1b[J")
  }

  // 清除从屏幕开头到当前光标位置的所有内容（含当前字符）
  clearTop() {
    return this.write("\x1b[1J")
  }

  // 清除整个屏幕并清除滚动缓冲区
  clearScrollbackBuffer() {
    return this.write("\x1b[3J")
  }

  // 清除从光标位置到行尾的内容
  clearEnd() {
    return this.write("\x1b[K")
  }

  // 清除从行首到光标位置的内容
  clearHome() {
    return this.write("\x1b[1K")
  }

  // 清除整行（无论光标在哪）
  clearLine() {
    return this.write("\x1b[2K")
  }
}
