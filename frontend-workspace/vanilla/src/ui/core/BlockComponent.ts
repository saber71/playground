import { El } from "./el.decorator.ts"
import { HTMLComponent } from "./HTMLComponent.ts"

@El("block")
export class BlockComponent extends HTMLComponent<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"))
  }
}
