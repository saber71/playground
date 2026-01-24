import type { SlMenu } from "@shoelace-style/shoelace"
import { HTMLComponent } from "./HTMLComponent.ts"

export class MenuComponent extends HTMLComponent<SlMenu> {
  constructor() {
    super(document.createElement("sl-menu"))
    this.getElement().innerHTML = `
  <sl-menu-item value="undo" tabindex="2">Undo</sl-menu-item>
  <sl-menu-item value="redo">Redo</sl-menu-item>`
  }
}
