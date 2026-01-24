import type { SlMenu } from "@shoelace-style/shoelace"
import { BaseComponent } from "./base.component.ts"

export class MenuComponent extends BaseComponent<SlMenu> {
  constructor() {
    super(document.createElement("sl-menu"))
    this.getHTMLElement().innerHTML = `
  <sl-menu-item value="undo" tabindex="2">Undo</sl-menu-item>
  <sl-menu-item value="redo">Redo</sl-menu-item>`
  }
}
