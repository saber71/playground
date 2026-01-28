import type { FlexPositionType } from "shared"
import { Attribute } from "../custom-element.decorator.ts"
import { HTMLElementExt } from "./HTMLElementExt.ts"
import { Positional } from "./Positional.ts"

export abstract class FlexPositionable extends Positional {
  @Attribute()
  justifyContent: FlexPositionType = "flex-start"

  @Attribute()
  alignItems: FlexPositionType = "flex-start"

  @Attribute()
  inline: boolean = false

  @Attribute()
  gap: string | number = ""

  center() {
    this.justifyContent = "center"
    this.alignItems = "center"
    return this
  }

  render() {
    super.render()
    HTMLElementExt(this).styles({
      justifyContent: this.justifyContent,
      alignItems: this.alignItems,
      gap: FlexPositionable.toString(this.gap),
    })
  }
}
