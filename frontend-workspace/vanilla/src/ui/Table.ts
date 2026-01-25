import { BORDER, FLEX_CENTER, isNil } from "../utils"
import { BlockComponent, HTMLComponent, TextComponent } from "./core"

export interface TableColumn<T> {
  label: string
  prop: keyof T
}

export class Table extends HTMLComponent<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"))
  }

  render<T>(columns: TableColumn<T>[], data: T[]) {
    this.removeAll()
    if (!data.length) return this
    const rows: BlockComponent[] = [
      this._renderRow(columns.map((i) => i.label)),
      ...data.map((i) =>
        this._renderRow(columns.map((c) => (isNil(i[c.prop]) ? "--" : i[c.prop]))),
      ),
    ]
    rows.at(-1)!.styles({ border: BORDER })
    this.addChildren(...rows)
    return this
  }

  private _renderRow(item: any[], border: boolean = true) {
    const row = new BlockComponent().styles({
      display: "grid",
      gridTemplateColumns: `repeat(${item.length}, 1fr)`,
    })
    const children = item.map((i) =>
      new TextComponent(i).styles({
        ...FLEX_CENTER,
        wordBreak: "break-all",
        padding: "12px",
        textAlign: "center",
      }),
    )
    row.addChildren(...children)
    if (border) {
      row.styles({
        border: BORDER,
        borderBottom: "none",
      })
      children.slice(1).forEach((i) =>
        i.styles({
          borderLeft: BORDER,
        }),
      )
    }
    return row
  }
}
