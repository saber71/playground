import { toKebabCase } from "shared"

const attributeMap = new Map()
let attributes: string[] = []
let curCls: any

export function CustomElement(option?: { name?: string; observedAttributes?: string[] }) {
  return (...args: any[]) => {
    const cls = args[0]
    cls.observedAttributes = attributes.slice()
    if (option?.observedAttributes) cls.observedAttributes.push(...option.observedAttributes)
    let parent = Object.getPrototypeOf(cls)
    while (parent && parent !== HTMLElement) {
      const array = attributeMap.get(parent)
      if (array) cls.observedAttributes.push(...array)
      parent = Object.getPrototypeOf(parent)
    }
    attributes = []
    cls.observedAttributes = [...new Set(cls.observedAttributes)]
    customElements.define(option?.name || toKebabCase(cls.name), cls)
  }
}

export function Attribute() {
  return (...args: any[]) => {
    const cls = args[0].constructor
    const array = attributeMap.get(cls) || []
    array.push(args[1])
    attributeMap.set(cls, array)
    if (curCls !== cls) attributes = []
    attributes.push(args[1])
    curCls = cls
  }
}

export interface ICustomElement {
  connectedCallback?(): void

  disconnectedCallback?(): void

  adoptedCallback?(): void

  attributeChangedCallback?(name: string, oldValue: any, newValue: any): void

  render(): void
}
