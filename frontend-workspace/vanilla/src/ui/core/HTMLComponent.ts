import type { PartialCssStyles } from "../../types.ts"
import { Value } from "../../utils"
import { ScopedWatcher } from "../../utils/ScopedWatcher.ts"
import { AbstractComponent } from "./AbstractComponent.ts"
import type { Styleable } from "./styleable.interface.ts"

export class HTMLComponent<E extends HTMLElement>
  extends AbstractComponent<E>
  implements Styleable
{
  style(name: keyof CSSStyleDeclaration, value: string | Value<string>) {
    if (value instanceof Value) {
      //@ts-ignore
      this._element.style[name] = value.get()
      ScopedWatcher.current(this._scopedWatcher)
      //@ts-ignore
      value.register(() => (this._element.style[name] = value.get()))
    } else {
      //@ts-ignore
      this._element.style[name] = value
    }
    return this
  }

  styles(record: PartialCssStyles): this {
    for (let [key, val] of Object.entries(record)) {
      this.style(key as any, val as any)
    }
    return this
  }

  styleProperty(name: string, value: string | Value<string>) {
    if (value instanceof Value) {
      this.getElement().style.setProperty(name, value.get())
      ScopedWatcher.current(this._scopedWatcher)
      value.register(() => this.getElement().style.setProperty(name, value.get()))
    } else {
      this.getElement().style.setProperty(name, value)
    }
    return this
  }
}
