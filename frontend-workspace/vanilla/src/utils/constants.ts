import type { PartialCssStyles } from "../types.ts"

export const CLASS_NO_SCROLLBAR = "no-scrollbar"
export const BORDER_COLOR = "var(--sl-input-border-color)"
export const BORDER = `2px solid ${BORDER_COLOR}`
export const FLEX_CENTER: PartialCssStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}
