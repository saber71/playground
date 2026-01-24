import type { SlMenuItem } from "@shoelace-style/shoelace"
import { HTMLComponent } from "./HTMLComponent.ts"

export class MenuItemComponent extends HTMLComponent<SlMenuItem> {
  constructor() {
    super(document.createElement("sl-menu-item"))
  }
}
