import { BaseComponent } from "./base.component.ts"
import { El } from "./el.decorator.ts"

@El("text")
export class TextComponent extends BaseComponent<HTMLSpanElement> {
  constructor() {
    super(document.createElement("span"))
  }

  setValue(str: string) {
    this.getHTMLElement().innerHTML = str
    return this
  }
}
