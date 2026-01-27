import type { ICustomElement } from "../custom-element.decorator.ts"

export abstract class BaseElement extends HTMLElement implements ICustomElement {
  constructor() {
    super()
    this.render()
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any): void {
    if (oldValue !== newValue) this.render()
  }

  abstract render(): void
}
