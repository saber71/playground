import { HTMLComponent } from "./HTMLComponent.ts"

export class BlockComponent extends HTMLComponent<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"))
  }
}
