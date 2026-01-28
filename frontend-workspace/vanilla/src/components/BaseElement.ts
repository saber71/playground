import type { ICustomElement } from "../custom-element.decorator.ts"

export abstract class BaseElement extends HTMLElement implements ICustomElement {
  connectedCallback() {
    this.render()
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any): void {
    this.render()
  }

  abstract render(): void

  static toString(val: string | number) {
    return typeof val === "number" ? val + "px" : val
  }
}
