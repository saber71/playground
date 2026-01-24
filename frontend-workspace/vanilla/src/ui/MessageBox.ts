import type { StyledString } from "../utils"
import { CLASS_NO_SCROLLBAR, waitTime } from "../utils"
import { BlockComponent, TextComponent } from "./core"

export class MessageBox extends BlockComponent {
  constructor() {
    super()
    this.styles({
      boxSizing: "border-box",
      background: "white",
      padding: "8px 14px",
      lineHeight: "27px",
      border: "2px solid black",
    }).addChild(
      new BlockComponent()
        .class(CLASS_NO_SCROLLBAR)
        .styles({
          height: "100%",
          overflow: "hidden",
        })
        .addChild(new TextComponent().styles({ whiteSpace: "pre" })),
    )
  }

  get wrapper(): BlockComponent {
    return this.getChild(0)
  }

  get text(): TextComponent {
    return this.wrapper.getChild(0)
  }

  async typing(content: Array<string | StyledString>, interval: number = 50, abort?: AbortSignal) {
    let aborted = false
    abort?.addEventListener(
      "abort",
      () => {
        aborted = true
        this.text.setValue(
          content.map((i) => (typeof i === "string" ? i : i.toHTMLString())).join(""),
        )
        this._scrollToBottom()
      },
      { once: true },
    )
    let acc = ""
    for (let i = 0; i < content.length && !aborted; i++) {
      const text = content[i]
      const length = text.length
      for (let i = 1; i < length && !aborted; i++) {
        this.text.setValue(acc + text.slice(0, i))
        await waitTime(interval)
        this._scrollToBottom()
      }
      if (!aborted && i + 1 <= content.length)
        acc += typeof text === "string" ? text : text.toHTMLString()
    }
  }

  private _scrollToBottom() {
    const wrapper = this.wrapper
    wrapper.getElement().scrollTo({
      behavior: "smooth",
      top: wrapper.getElement().scrollHeight,
    })
  }
}
