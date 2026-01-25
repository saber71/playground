import { HTMLComponent } from "./HTMLComponent.ts"

export class TextComponent extends HTMLComponent<HTMLSpanElement> {
  constructor(str?: string) {
    super(document.createElement("span"))
    if (str) this.setContent(str)
  }

  setContent(str?: string) {
    this.set("innerHTML", str || "")
    return this
  }
}
