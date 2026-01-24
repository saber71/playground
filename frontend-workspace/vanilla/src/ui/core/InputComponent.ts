import type { SlInput } from "@shoelace-style/shoelace"
import { El } from "./el.decorator.ts"
import { HTMLComponent } from "./HTMLComponent.ts"

@El("input")
//@ts-ignore
export class InputComponent extends HTMLComponent<SlInput> {
  constructor() {
    super(document.createElement("sl-input"))
  }
}
