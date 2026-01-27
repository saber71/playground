export type Class<T> = new (...args: any[]) => T

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

export type PropertyKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

export type PositionType = "absolute" | "fixed" | "relative" | "static" | "sticky"

export type CssLength = number | `${number}px` | `${number}%` | `${number}vw` | `${number}vh`

export type BoxSizing = "border-box" | "content-box"

export type OverflowType = "auto" | "hidden" | "visible"

export type DisplayType =
  | "block"
  | "inline-block"
  | "inline"
  | "flex"
  | "inline-flex"
  | "inline-grid"
  | "grid"
  | "none"

export type WhiteSpaceType = "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line"

export type FlexPositionType =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly"

export type FlexDirectionType = "row" | "column"

export type CursorType = "pointer" | "default"

export type FontStyleType = "normal" | "italic"

export type FontWeightType = "normal" | "bold" | "lighter" | "bolder"

export type PartialCssStyles = Partial<Record<keyof CSSStyleDeclaration, string>> &
  Partial<{
    display: DisplayType
    position: PositionType
    left: CssLength
    top: CssLength
    right: CssLength
    bottom: CssLength
    width: CssLength
    height: CssLength
    justifyContent: FlexPositionType
    alignItems: FlexPositionType
    whiteSpace: WhiteSpaceType
    flexDirection: FlexDirectionType
    boxSizing: BoxSizing
    overflow: OverflowType
    cursor: CursorType
    fontStyle: FontStyleType
    fontWeight: FontWeightType
  }>
