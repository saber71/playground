import { SlDropdown } from "@shoelace-style/shoelace"
import type { AbstractComponent } from "./AbstractComponent.ts"
import { El } from "./el.decorator.ts"
import { HTMLComponent } from "./HTMLComponent.ts"
import { MenuComponent, type MenuItemOption } from "./MenuComponent.ts"

@El("dropdown")
export class DropdownComponent extends HTMLComponent<SlDropdown> {
  constructor() {
    super(document.createElement("sl-dropdown"))
  }

  get menu(): MenuComponent | undefined {
    return this.findChild((i) => i instanceof MenuComponent)
  }

  async show() {
    await this.getElement().show()
    this.menu?.focus()
  }

  setContent(trigger: AbstractComponent, itemOptions: MenuItemOption[]) {
    this.removeAll().addChild(trigger)
    const menu = new MenuComponent()
    this.addChild(menu)
    return Promise.all([
      menu.setItems(itemOptions).then(() => this.getElement().hide()),
      this.show(),
    ])
  }
}
