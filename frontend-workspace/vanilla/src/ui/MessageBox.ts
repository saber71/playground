import { inject } from "injection-js"
import { BORDER, CLASS_NO_SCROLLBAR, Service, type StyledString, waitTime } from "../utils"
import { BlockComponent, ComponentFactory, TextComponent } from "./core"

@Service()
export class MessageBox extends BlockComponent {
  constructor(readonly componentFactory = inject(ComponentFactory)) {
    super()
    this.styles({
      boxSizing: "border-box",
      background: "white",
      padding: "8px 14px",
      lineHeight: "27px",
      border: BORDER,
      width: "100%",
      height: "100px",
      flexShrink: "0",
    }).addChild(
      componentFactory
        .create("block")
        .class(CLASS_NO_SCROLLBAR)
        .styles({
          height: "100%",
          overflow: "hidden",
        })
        .addChild(componentFactory.create("text").styles({ whiteSpace: "pre" })),
    )
  }

  get wrapper(): BlockComponent {
    return this.getChild(0)
  }

  get text(): TextComponent {
    return this.wrapper.getChild(0)
  }

  setContent() {
    this.text.setContent("")
  }

  async typing(content: Array<string | StyledString>, interval: number = 50, abort?: AbortSignal) {
    let aborted = false
    abort?.addEventListener(
      "abort",
      () => {
        aborted = true
        this.text.setContent(
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
        this.text.setContent(acc + text.slice(0, i))
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
