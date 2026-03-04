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
  F1 = "\x1b[P",
  F2 = "\x1b[Q",
  F3 = "\x1b[R",
  F4 = "\x1bOS",
  F5 = "\x1b[15~",
  F6 = "\x1b[17~",
  F7 = "\x1b[18~",
  F8 = "\x1b[19~",
  F9 = "\x1b[20~",
  F10 = "\x1b[21~",
  F11 = "\x1b[23~",
  F12 = "\x1b[24~",
}

export interface IKey {
  char: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
}

const seqMap: Record<string, IKey> = {
  "\x1b\x7f": { alt: true, char: "\b" },
}

const modMap: Record<number, any> = {
  1: {},
  2: { shift: true },
  3: { alt: true },
  4: { alt: true, shift: true },
  5: { ctrl: true },
  6: { ctrl: true, shift: true },
  7: { ctrl: true, alt: true },
  8: { ctrl: true, alt: true, shift: true },
}
for (let i = 2; i <= 8; i++) {
  const map: Record<string, IKey> = {
    "\x1b[2;$~": { char: AnsiKey.INSERT },
    "\x1b[3;$~": { char: AnsiKey.DELETE },
    "\x1b[5;$~": { char: AnsiKey.PAGE_UP },
    "\x1b[6;$~": { char: AnsiKey.PAGE_DOWN },
    "\x1b[11;$~": { char: AnsiKey.F1 },
    "\x1b[12;$~": { char: AnsiKey.F2 },
    "\x1b[13;$~": { char: AnsiKey.F3 },
    "\x1b[14;$~": { char: AnsiKey.F4 },
    "\x1b[15;$~": { char: AnsiKey.F5 },
    "\x1b[17;$~": { char: AnsiKey.F6 },
    "\x1b[18;$~": { char: AnsiKey.F7 },
    "\x1b[19;$~": { char: AnsiKey.F8 },
    "\x1b[20;$~": { char: AnsiKey.F9 },
    "\x1b[21;$~": { char: AnsiKey.F10 },
    "\x1b[23;$~": { char: AnsiKey.F11 },
    "\x1b[24;$~": { char: AnsiKey.F12 },
  }
  for (let [seq, key] of Object.entries(map)) {
    seqMap[seq.replace("$", i + "")] = Object.assign({}, modMap[i], key)
  }
}

for (let i = 1; i <= 26; i++) {
  seqMap[String.fromCharCode(i)] = {
    ctrl: true,
    char: String.fromCharCode(65 + i - 1),
  }
  seqMap["\x1b" + String.fromCharCode(97 + i - 1)] = {
    alt: true,
    char: String.fromCharCode(65 + i - 1),
  }
}

export function parseKey(seq: string): IKey {
  if (seq in seqMap) return Object.assign({}, seqMap[seq])
  for (let i = 1; i <= 26; i++) {
    if (String.fromCharCode(i) === seq) {
      return {
        ctrl: true,
        char: String.fromCharCode(65 + i - 1),
      }
    }
  }
  let shift = false,
    alt = false,
    ctrl = false,
    char = seq
  const match = seq.match(/^\x1b\[1;(\d+)([A-Za-z~]+)$/)
  if (match) {
    const mod = parseInt(match[1])
    const key = match[2]
    if (mod === 2) shift = true
    else if (mod === 3) alt = true
    else if (mod === 4) shift = alt = true
    else if (mod === 5) ctrl = true
    else if (mod === 6) shift = ctrl = true
    else if (mod === 7) alt = ctrl = true
    else if (mod === 8) alt = ctrl = shift = true
    char = "\x1b[" + key
  }
  return { shift, alt, ctrl, char }
}
