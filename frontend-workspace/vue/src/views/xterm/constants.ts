import colorNames from "color-name"
import parse from "parse-color"

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

export function AnsiColor(value: string | number): string {
  if (typeof value === "number") {
    return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff].join(";")
  } else if (value in colorNames) {
    //@ts-ignore
    return colorNames[value].join(";")
  } else {
    const result = parse(value)
    return result.rgb.join(";")
  }
}
