import { toKebabCase } from "shared"

export function CustomElement(name?: string) {
  return (...args: any[]) => {
    const cls = args[0]
    customElements.define(name || toKebabCase(cls.name), cls)
  }
}

export interface ICustomElement {
  connectedCallback?(): void

  disconnectedCallback?(): void

  adoptedCallback?(): void

  attributeChangedCallback?(name: string, oldValue: any, newValue: any): void

  render(): void
}
