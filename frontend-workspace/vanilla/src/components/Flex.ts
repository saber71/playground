import type { FlexPositionType } from "shared"
import { CustomElement } from "../custom-element.decorator.ts"
import { BaseElement } from "./BaseElement.ts"

@CustomElement("sl-flex")
export class Flex extends BaseElement {
  static readonly observedAttributes = ["justifyContent", "alignItems", "inline", "gap"]

  justifyContent: FlexPositionType = "flex-start"

  alignItems: FlexPositionType = "flex-start"

  inline: boolean = false

  gap: string | number = 0

  center() {
    this.justifyContent = "center"
    this.alignItems = "center"
    return this
  }

  render() {
    this.style.justifyContent = this.justifyContent
    this.style.alignItems = this.alignItems
    this.style.gap = typeof this.gap === "number" ? this.gap + "px" : this.gap
    this.style.display = this.inline ? "inline-flex" : "flex"
  }
}
