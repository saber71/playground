import type { SlMenuItem } from "@shoelace-style/shoelace"
import { El } from "./el.decorator.ts"
import { HTMLComponent } from "./HTMLComponent.ts"

@El("menuItem")
export class MenuItemComponent extends HTMLComponent<SlMenuItem> {
  constructor() {
    super(document.createElement("sl-menu-item"))
  }
}
