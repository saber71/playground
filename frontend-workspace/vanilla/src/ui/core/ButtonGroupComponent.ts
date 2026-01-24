import type { SlButtonGroup } from "@shoelace-style/shoelace"
import { El } from "./el.decorator.ts"
import { HTMLComponent } from "./HTMLComponent.ts"

@El("button-group")
export class ButtonGroupComponent extends HTMLComponent<SlButtonGroup> {
  constructor() {
    super(document.createElement("sl-button-group"))
  }
}
