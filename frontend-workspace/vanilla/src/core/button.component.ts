import type { SlButton } from "@shoelace-style/shoelace"
import { BaseComponent } from "./base.component.ts"
import { El } from "./el.decorator.ts"

@El("button")
export class ButtonComponent extends BaseComponent<SlButton> {
  constructor() {
    super(document.createElement("sl-button"))
  }
}
