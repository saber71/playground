import { SlDropdown } from "@shoelace-style/shoelace"
import type { AbstractComponent } from "./AbstractComponent.ts"
import { HTMLComponent } from "./HTMLComponent.ts"
import { MenuComponent, type MenuItemOption } from "./MenuComponent.ts"

export class DropdownComponent extends HTMLComponent<SlDropdown> {
  constructor() {
    super(document.createElement("sl-dropdown"))
  }

  get menu(): MenuComponent | undefined {
    return this.findChild((i) => i instanceof MenuComponent)
  }

  async show() {
    await this.invoke("show")
    this.menu?.focus()
  }

  setContent(trigger: AbstractComponent, itemOptions: MenuItemOption[]) {
    this.removeAll().addChildren(trigger)
    const menu = new MenuComponent()
    this.addChildren(menu)
    return Promise.all([menu.setItems(itemOptions).then(() => this.invoke("hide")), this.show()])
  }
}
