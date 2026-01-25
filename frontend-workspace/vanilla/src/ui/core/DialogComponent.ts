import { SlDialog } from "@shoelace-style/shoelace"
import { HTMLContainerComponent } from "./HTMLContainerComponent.ts"

export class DialogComponent extends HTMLContainerComponent<SlDialog> {
  constructor() {
    super(document.createElement("sl-dialog"))
  }
}
