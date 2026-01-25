import type { SlMenuItem } from "@shoelace-style/shoelace"
import { HTMLContainerComponent } from "./HTMLContainerComponent.ts"

export class MenuItemComponent extends HTMLContainerComponent<SlMenuItem> {
  constructor() {
    super(document.createElement("sl-menu-item"))
  }
}
