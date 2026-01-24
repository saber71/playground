import { El } from "./el.decorator.ts"
import { HTMLComponent } from "./HTMLComponent.ts"

@El("text")
export class TextComponent extends HTMLComponent<HTMLSpanElement> {
  constructor() {
    super(document.createElement("span"))
  }

  setContent(str: string) {
    this.getElement().innerHTML = str
    return this
  }
}
