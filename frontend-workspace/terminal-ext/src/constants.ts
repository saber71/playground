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
