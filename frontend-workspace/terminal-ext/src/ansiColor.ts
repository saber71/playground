import colorNames from "color-name"
import parse from "parse-color"

export function ansiColor(value: string | number): string {
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
