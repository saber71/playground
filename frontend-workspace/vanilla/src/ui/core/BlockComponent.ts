import { HTMLContainerComponent } from "./HTMLContainerComponent.ts"

export class BlockComponent extends HTMLContainerComponent<HTMLDivElement> {
  constructor() {
    super(document.createElement("div"))
  }
}
