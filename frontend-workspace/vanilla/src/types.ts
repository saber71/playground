import type { Value } from "./utils"

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

export type PropertyKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

export type Class<T> = new (...args: any[]) => T

export type Watcher = () => void
export type StopWatcher = () => void

export type PositionType = "absolute" | "fixed" | "relative" | "static" | "sticky"

export type CssLength =
  | number
  | `${number}px`
  | `${number}%`
  | `${number}vw`
  | `${number}vh`
  | string

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

export type PartialCssStyles = Partial<Record<keyof CSSStyleDeclaration, string | Value<string>>> &
  Partial<{
    display: DisplayType | Value<DisplayType>
    position: PositionType | Value<PositionType>
    left: CssLength | Value<CssLength>
    top: CssLength | Value<CssLength>
    right: CssLength | Value<CssLength>
    bottom: CssLength | Value<CssLength>
    width: CssLength | Value<CssLength>
    height: CssLength | Value<CssLength>
    justifyContent: FlexPositionType | Value<FlexPositionType>
    alignItems: FlexPositionType | Value<FlexPositionType>
    whiteSpace: WhiteSpaceType | Value<WhiteSpaceType>
    flexDirection: FlexDirectionType | Value<FlexDirectionType>
    boxSizing: BoxSizing | Value<BoxSizing>
    overflow: OverflowType | Value<OverflowType>
    cursor: CursorType | Value<CursorType>
    fontStyle: FontStyleType | Value<FontStyleType>
    fontWeight: FontWeightType | Value<FontWeightType>
  }>
