import { type Reactive, reactive } from 'vue'

export class DynamicComponent<
  ComponentRef = any,
  Props extends Record<string, any> = any,
  Events extends Record<string, (...args: any) => void> = Record<string, (...args: any) => void>,
> {
  private readonly _props: Reactive<Props>
  private _componentRef: ComponentRef = null as any
  private readonly _children: Array<string | number | DynamicComponent> = []

  constructor(
    readonly component: any,
    props: Props = {} as any,
    readonly events: Events = {} as any,
  ) {
    this._props = reactive<Props>(props)
  }

  get ref() {
    return this._componentRef
  }

  prop<Key extends keyof Props>(name: Key, value: Props[Key]) {
    ;(this._props as any)[name] = value
    return this
  }

  event<Key extends keyof Events>(name: Key, value: Events[Key]) {
    ;(this.events as any)[name] = value
    return this
  }

  child(val: string | number | DynamicComponent) {
    this._children.push(val)
    return this
  }

  getProps() {
    return this._props
  }

  getChildren() {
    return this._children
  }

  mount(el: any) {
    this._componentRef = el
  }
}
