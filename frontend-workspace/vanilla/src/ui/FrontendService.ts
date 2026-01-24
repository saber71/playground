import { inject } from "injection-js"
import type { PartialCssStyles } from "../types.ts"
import { FLEX_CENTER, Service } from "../utils"
import { BlockComponent, DropdownComponent, type MenuItemOption, TextComponent } from "./core"
import { HTMLComponent } from "./core/HTMLComponent.ts"
import { MessageBox } from "./MessageBox.ts"
import { Table } from "./Table.ts"

@Service()
export class FrontendService extends HTMLComponent<HTMLDivElement> {
  private readonly _dropdown = new DropdownComponent()

  constructor(
    readonly messageBox = inject(MessageBox),
    readonly table = inject(Table),
  ) {
    super(document.getElementById("app") as any)
    const padding: PartialCssStyles = {
      padding: "2px",
      boxSizing: "border-box",
    }
    this.styles({
      ...padding,
      display: "flex",
      flexDirection: "column",
    }).addChildren(
      new BlockComponent().addChildren(table).styles({
        ...FLEX_CENTER,
        ...padding,
        flexGrow: "1",
        position: "relative",
      }),
      messageBox,
    )
    this.body.addChild(
      this._dropdown
        .styles({
          position: "absolute",
          right: "0",
          bottom: "0",
        })
        .set("placement", "top-end"),
    )
  }

  get body(): BlockComponent {
    return this.getChild(0)
  }

  menuList(options: MenuItemOption[]) {
    return this._dropdown.setContent(new TextComponent().slot("trigger"), options)
  }
}
