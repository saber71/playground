import type { CursorPosition } from "./types.ts"

export enum AnsiStyle {
  BOLD = 1,
  ITALIC = 3,
  UNDERLINE = 4,
  INVERSE = 7,
  STRIKE_THROUGH = 9,
}

export const AnsiFore = "38;2"
export const AnsiBack = "48;2"
export const AnsiReset = "\x1B[0m"

export enum AnsiErase {
  ALL = "\x1b[3J",
  TO_BOTTOM = "\x1b[J",
  LINE = "\x1b[2K",
  SCREEN = "\x1b[2J",
  TO_END = "\x1b[K",
  TO_HOME = "\x1b[1K",
  TO_TOP = "\x1b[1J",
}

export class AnsiCursor {
  static readonly HIDE = "\x1b[?25l"
  static readonly SHOW = "\x1b[?25h"
  static readonly REQUEST_POSITION = "\x1B[6n"
  static readonly RESTORE_POSITION = "\x1b[u"
  static readonly SAVE_POSITION = "\x1b[s"
  static readonly ENABLE_AUTOWRAP = "\x1b[?7h"
  static readonly DISABLE_AUTOWRAP = "\x1b[?7l"

  static SET_POSITION(row: number, col: number) {
    return `\x1b[${row};${col}H`
  }

  static DOWN(n: number = 1) {
    return `\x1b[${n}B`
  }

  static LEFT(n: number = 1) {
    return `\x1b[${n}D`
  }

  static RIGHT(n: number = 1) {
    return `\x1b[${n}C`
  }

  static TOP(n: number = 1) {
    return `\x1b[${n}A`
  }
}

export enum AnsiScreenBuffer {
  MAIN = "\x1b[?1049l",
  BACKUP = "\x1b[?1049h",
}

export enum AnsiKey {
  UP = "\x1b[A",
  DOWN = "\x1b[B",
  RIGHT = "\x1b[C",
  LEFT = "\x1b[D",
  HOME = "\x1b[H",
  END = "\x1b[F",
  INSERT = "\x1b[2~",
  DELETE = "\x1b[3~",
  PAGE_UP = "\x1b[5~",
  PAGE_DOWN = "\x1b[6~",
  ESC = "\x1b",
  F1 = "\x1b[11~",
  F2 = "\x1b[12~",
  F3 = "\x1b[13~",
  F4 = "\x1b[14~",
  F5 = "\x1b[15~",
  F6 = "\x1b[17~",
  F7 = "\x1b[18~",
  F8 = "\x1b[19~",
  F9 = "\x1b[20~",
  F10 = "\x1b[21~",
  F11 = "\x1b[23~",
  F12 = "\x1b[24~",
}

export function parseAnsiCursorPosition(value?: string): CursorPosition | undefined {
  if (!value) return
  const result = value.match(/^\x1b\[(\d+);(\d+)R$/)
  if (result) {
    return { row: Number(result[1]), col: Number(result[2]) }
  }
  return
}

export function hasAnsiCode(str: string) {
  return /\x1b\[[^A-Za-z]*[A-Za-z]/.test(str)
}
