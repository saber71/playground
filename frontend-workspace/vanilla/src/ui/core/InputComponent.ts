import type { SlInput } from "@shoelace-style/shoelace"
import { HTMLComponent } from "./HTMLComponent.ts"

//@ts-ignore
export class InputComponent extends HTMLComponent<SlInput> {
  constructor() {
    super(document.createElement("sl-input"))
  }
}
