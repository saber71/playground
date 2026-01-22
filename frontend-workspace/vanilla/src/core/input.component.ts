import type { SlInput } from "@shoelace-style/shoelace"
import { BaseComponent } from "./base.component.ts"
import { El } from "./el.decorator.ts"

@El("input")
export class InputComponent extends BaseComponent<SlInput> {
  constructor() {
    super(document.createElement("sl-input"))
  }
}
