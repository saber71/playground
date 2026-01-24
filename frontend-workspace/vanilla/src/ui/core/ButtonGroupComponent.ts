import type { SlButtonGroup } from "@shoelace-style/shoelace"
import { HTMLComponent } from "./HTMLComponent.ts"

export class ButtonGroupComponent extends HTMLComponent<SlButtonGroup> {
  constructor() {
    super(document.createElement("sl-button-group"))
  }
}
