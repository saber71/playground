import type { SlMenu } from "@shoelace-style/shoelace"
import { El } from "./el.decorator.ts"
import { HTMLComponent } from "./HTMLComponent.ts"
import { MenuItemComponent } from "./MenuItemComponent.ts"
import { TextComponent } from "./TextComponent.ts"

export interface MenuItemOption {
  label: string
  disabled?: boolean
  callback?: () => void | Promise<void>
  submenu?: MenuItemOption[]
  key?: string
}

@El("menu")
export class MenuComponent extends HTMLComponent<SlMenu> {
  constructor() {
    super(document.createElement("sl-menu"))
  }

  focus() {
    const item = this.getChild(0) as MenuItemComponent
    item.getElement().focus()
  }

  setItems(options: MenuItemOption[]) {
    const optionMap: Record<string, MenuItemOption> = {}

    const recursive = (opt: MenuItemOption) => {
      if (!opt.key) opt.key = window.crypto.randomUUID()
      optionMap[opt.key] = opt
      opt.submenu?.forEach(recursive)
    }
    options.forEach(recursive)

    const menuItems = options.map((option) => {
      const menuItem = new MenuItemComponent()
        .addChildren(new TextComponent().setContent(option.label))
        .set("value", option.key!)
      if (option.disabled) menuItem.set("disabled", true)
      if (option.submenu) {
        const menu = new MenuComponent().slot("submenu")
        menu.setItems(option.submenu)
        menuItem.addChildren(menu)
      } else if (!option.callback) menuItem.set("disabled", true)
      return menuItem
    })
    this.off("sl-select", { key: this })
    this.removeAll().addChildren(...menuItems)
    return new Promise<void>((resolve) => {
      this.on(
        "sl-select",
        async ({ detail }) => {
          const key = detail.item.value
          const option = optionMap[key]
          if (option?.callback) {
            await option.callback()
          }
          this.off("sl-select", { key: this })
          resolve()
        },
        { key: this },
      )
    })
  }
}
