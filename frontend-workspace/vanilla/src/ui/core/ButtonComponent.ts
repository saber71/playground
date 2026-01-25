import type { SlButton } from "@shoelace-style/shoelace"
import { HTMLComponent } from "./HTMLComponent.ts"

export class ButtonComponent extends HTMLComponent<SlButton> {
  constructor() {
    super(document.createElement("sl-button"))
  }

  setContent(str: string) {
    this.set("textContent", str)
  }
}
