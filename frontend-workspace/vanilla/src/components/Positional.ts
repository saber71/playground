import type { PositionType } from "shared"
import { Attribute } from "../custom-element.decorator.ts"
import { BaseElement } from "./BaseElement.ts"
import { HTMLElementExt } from "./HTMLElementExt.ts"

export abstract class Positional extends BaseElement {
  @Attribute()
  position: PositionType = "static"

  @Attribute()
  left: string | number = ""

  @Attribute()
  top: string | number = ""

  @Attribute()
  right: string | number = ""

  @Attribute()
  bottom: string | number = ""

  render() {
    HTMLElementExt(this).styles({
      position: this.position,
      left: Positional.toString(this.left) as any,
      top: Positional.toString(this.top) as any,
      right: Positional.toString(this.right) as any,
      bottom: Positional.toString(this.bottom) as any,
    })
  }
}
