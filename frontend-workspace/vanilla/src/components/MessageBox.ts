import { BlockComponent, TextComponent } from "../core"
import type { StyledString } from "../utils"
import { CLASS_NO_SCROLLBAR, waitTime } from "../utils"

export class MessageBox extends BlockComponent {
  private readonly _wrapper: BlockComponent
  private readonly _text: TextComponent

  constructor() {
    super()
    this.styles({
      boxSizing: "border-box",
      background: "white",
      padding: "8px 14px",
      lineHeight: "27px",
      border: "2px solid black",
    }).addChild(
      (this._wrapper = new BlockComponent().class(CLASS_NO_SCROLLBAR).styles({
        height: "100%",
        overflow: "hidden",
      })).addChild((this._text = new TextComponent()).whiteSpace("pre")),
    )
  }

  async typing(content: Array<string | StyledString>, interval: number = 50, abort?: AbortSignal) {
    let aborted = false
    abort?.addEventListener(
      "abort",
      () => {
        aborted = true
        this._text.setValue(
          content.map((i) => (typeof i === "string" ? i : i.toHTMLString())).join(""),
        )
        this._wrapper.getHTMLElement().scrollTo({
          behavior: "smooth",
          top: this._wrapper.getHTMLElement().scrollHeight,
        })
      },
      { once: true },
    )
    let acc = ""
    for (let i = 0; i < content.length && !aborted; i++) {
      const text = content[i]
      const length = text.length
      for (let i = 1; i < length && !aborted; i++) {
        this._text.setValue(acc + text.slice(0, i))
        await waitTime(interval)
        this._wrapper.getHTMLElement().scrollTo({
          behavior: "smooth",
          top: this._wrapper.getHTMLElement().scrollHeight,
        })
      }
      if (!aborted && i + 1 <= content.length)
        acc += typeof text === "string" ? text : text.toHTMLString()
    }
  }
}
