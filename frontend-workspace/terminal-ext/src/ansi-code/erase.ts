export enum AnsiErase {
  ALL = "\x1b[3J",
  TO_BOTTOM = "\x1b[J",
  LINE = "\x1b[2K",
  SCREEN = "\x1b[2J",
  TO_END = "\x1b[K",
  TO_HOME = "\x1b[1K",
  TO_TOP = "\x1b[1J",
}
