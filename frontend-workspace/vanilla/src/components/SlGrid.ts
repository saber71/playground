import { Attribute, CustomElement } from "../custom-element.decorator.ts"
import { FlexPositionable } from "./FlexPositionable.ts"
import { HTMLElementExt } from "./HTMLElementExt.ts"

@CustomElement()
export class SlGrid extends FlexPositionable {
  @Attribute()
  rowGap: string | number = ""

  @Attribute()
  columnGap: string | number = ""

  render(): void {
    super.render()
    HTMLElementExt(this).styles({
      rowGap: SlGrid.toString(this.rowGap),
      columnGap: SlGrid.toString(this.columnGap),
      display: this.inline ? "inline-grid" : "grid",
    })
  }
}
