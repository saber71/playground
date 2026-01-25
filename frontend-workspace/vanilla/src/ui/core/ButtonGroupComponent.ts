import type { SlButtonGroup } from "@shoelace-style/shoelace"
import type { ButtonComponent } from "./ButtonComponent.ts"
import { HTMLContainerComponent } from "./HTMLContainerComponent.ts"

export class ButtonGroupComponent extends HTMLContainerComponent<SlButtonGroup, ButtonComponent> {
  constructor() {
    super(document.createElement("sl-button-group"))
  }
}
