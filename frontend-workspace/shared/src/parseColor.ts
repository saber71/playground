import colorNames from "color-name"
import parse from "parse-color"
import type { Color } from "./types.ts"

export function parseColor(color: string | number | Color): Color {
  if (color instanceof Array) return color
  if (typeof color === "number") {
    return [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff]
  } else if (color in colorNames) {
    //@ts-ignore
    return colorNames[color]
  } else {
    const result = parse(color)
    return result.rgb
  }
}
