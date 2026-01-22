import { BaseComponent } from "./base.component.ts"
import { El } from "./el.decorator.ts"

@El("block")
export class BlockComponent extends BaseComponent<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"))
  }
}
