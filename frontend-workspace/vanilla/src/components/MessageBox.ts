import { BlockComponent, TextComponent } from "../core"
import { waitTime } from "../utils"

export class MessageBox extends BlockComponent {
  private readonly _wrapper: BlockComponent
  private readonly _text: TextComponent

  constructor() {
    super()
    this.setStyle("position", "fixed")
      .setStyle("left", "0")
      .setStyle("bottom", "0")
      .setStyle("background", "white")
      .setStyle("boxSizing", "border-box")
      .setStyle("border", "2px solid black")
      .setStyle("height", "100px")
      .setStyle("lineHeight", "24px")
      .setStyle("width", "100%")
      .setStyle("padding", "12px 20px")
      .addChild(
        (this._wrapper = new BlockComponent())
          .setStyle("height", "100%")
          .setStyle("overflow", "auto")
          .addChild((this._text = new TextComponent()).setStyle("whiteSpace", "pre")),
      )
  }

  async typing(text: string, interval: number = 50) {
    for (let i = 1; i < text.length; i++) {
      this._text.setValue(text.slice(0, i))
      await waitTime(interval)
      this._wrapper.getHTMLElement().scrollTo({
        behavior: "smooth",
        top: this._wrapper.getHTMLElement().scrollHeight,
      })
    }
  }
}
