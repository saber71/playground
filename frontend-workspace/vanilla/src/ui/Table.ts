import { inject } from "injection-js"
import { BORDER, FLEX_CENTER, Service } from "../utils"
import { BlockComponent, ComponentFactory } from "./core"

export interface TableColumn<T> {
  label: string
  prop: keyof T
}

@Service()
export class Table extends BlockComponent {
  constructor(readonly componentFactory = inject(ComponentFactory)) {
    super()
  }

  render<T>(columns: TableColumn<T>[], data: T[]) {
    this.removeAll()
    if (!data.length) return this
    const rows: BlockComponent[] = [
      this._renderRow(columns.map((i) => i.label)),
      ...data.map((i) => this._renderRow(columns.map((c) => i[c.prop]))),
    ]
    rows.at(-1)!.styles({ border: BORDER })
    this.addChildren(...rows)
    return this
  }

  private _renderRow(item: any[], border: boolean = true) {
    const row = this.componentFactory.create("block").styles({
      display: "grid",
      gridTemplateColumns: `repeat(${item.length}, 1fr)`,
    })
    const children = item.map((i) =>
      this.componentFactory
        .create("text")
        .setContent(i)
        .styles({
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
