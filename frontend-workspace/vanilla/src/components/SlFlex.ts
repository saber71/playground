import { CustomElement } from "../custom-element.decorator.ts"
import { FlexPositionable } from "./FlexPositionable.ts"

@CustomElement()
export class SlFlex extends FlexPositionable {
  render() {
    super.render()
    this.style.display = this.inline ? "inline-flex" : "flex"
  }
}
