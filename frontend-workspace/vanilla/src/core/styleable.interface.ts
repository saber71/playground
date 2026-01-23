import type {
  BoxSizing,
  CssLength,
  CursorType,
  DisplayType,
  FlexDirectionType,
  FlexPositionType,
  OverflowType,
  PartialCssStyles,
  PositionType,
  WhiteSpaceType,
} from "../types.ts"
import { Value } from "../utils"

export interface Styleable {
  style(name: keyof CSSStyleDeclaration, value: string | Value<string>): this

  styles(record: PartialCssStyles): this

  styleProperty(name: string, value: string | Value<string>): this

  position(val: PositionType | Value<PositionType>): this

  absolute(): this

  fixed(): this

  relative(): this

  sticky(): this

  left(val: CssLength | Value<CssLength>): this

  top(val: CssLength | Value<CssLength>): this

  right(val: CssLength | Value<CssLength>): this

  bottom(val: CssLength | Value<CssLength>): this

  width(val: CssLength | Value<CssLength>): this

  height(val: CssLength | Value<CssLength>): this

  boxSizing(val: BoxSizing | Value<BoxSizing>): this

  borderBox(): this

  lineHeight(val: CssLength | Value<CssLength>): this

  background(val: string | Value<string>): this

  color(val: string | Value<string>): this

  padding(...val: CssLength[]): this

  margin(...val: CssLength[]): this

  overflow(val: OverflowType | Value<OverflowType>): this

  display(val: DisplayType | Value<DisplayType>): this

  whiteSpace(val: WhiteSpaceType | Value<WhiteSpaceType>): this

  flex(): this

  grid(): this

  gridTemplateColumns(val: string | Value<string>): this

  gridTemplateRows(val: string | Value<string>): this

  gap(val: CssLength | Value<CssLength>): this

  justifyContent(val: FlexPositionType | Value<FlexPositionType>): this

  alignItems(val: FlexPositionType | Value<FlexPositionType>): this

  flexShrink(val: number | Value<number>): this

  flexGrow(val: number | Value<number>): this

  flexDirection(val: FlexDirectionType | Value<FlexDirectionType>): this

  cursor(val: CursorType | Value<CursorType>): this
}
