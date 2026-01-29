import type { DisplayType } from "shared"
import { Attribute, type ICustomElement } from "../custom-element.decorator.ts"

export abstract class BaseCustomElement extends HTMLElement implements ICustomElement {
  preferDisplay: DisplayType = "block"

  @Attribute()
  vShow = true

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any): void {
    this.render()
  }

  render(): void {
    this.style.display = this.vShow ? this.preferDisplay : "none"
  }

  static toString(val: string | number) {
    return typeof val === "number" ? val + "px" : val
  }
}
