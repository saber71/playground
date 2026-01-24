import type { SlButton } from "@shoelace-style/shoelace"
import { El } from "./el.decorator.ts"
import { HTMLComponent } from "./HTMLComponent.ts"

@El("button")
export class ButtonComponent extends HTMLComponent<SlButton> {
  constructor() {
    super(document.createElement("sl-button"))
  }
}
