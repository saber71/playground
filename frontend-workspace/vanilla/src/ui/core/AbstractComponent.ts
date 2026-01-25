import type { FunctionKeys, PropertyKeys } from "../../types.ts"
import { Value } from "../../utils"
import { ScopedWatcher } from "../../utils/ScopedWatcher.ts"

export class AbstractComponent<
  El extends Element = Element,
  Events = GlobalEventHandlersEventMap,
> extends ScopedWatcher {
  private _parent: AbstractComponent | undefined
  private _children: AbstractComponent[] = []
  private readonly _keyMapListener: Map<any, any> = new Map()

  constructor(private readonly _element: El) {
    super()
  }

  protected _getElement() {
    return this._element
  }

  getParent() {
    return this._parent
  }

  setParent(val?: AbstractComponent) {
    this._parent = val
    return this
  }

  protected getChild<E extends AbstractComponent>(index: number): E {
    return this._children[index] as E
  }

  protected findChild<T>(predicate: (child: AbstractComponent) => boolean): T | undefined {
    return this._children.find(predicate) as any
  }

  protected setChildren(...children: AbstractComponent[]) {
    this.removeAll().addChildren(...children)
    return this
  }

  protected addChildren(...children: AbstractComponent[]): this {
    for (let child of children) {
      const index = this._children.indexOf(child)
      if (index >= 0) this.removeChild(child, index)
      this._children.push(child)
      this._getElement().appendChild(child._getElement())
      //@ts-ignore
      child.setParent(this)
    }
    return this
  }

  protected addChildAt(child: AbstractComponent, index: number) {
    const oldIndex = this._children.indexOf(child)
    if (oldIndex !== index) {
      if (oldIndex >= 0) this.removeChild(child, oldIndex)
      if (index < this._children.length) {
        const n = this._children[index]
        this._getElement().insertBefore(child._getElement(), n._getElement())
        this._children = [...this._children.slice(0, index), child, ...this._children.slice(index)]
        //@ts-ignore
        child.setParent(this)
      } else {
        this.addChildren(child)
      }
    }
    return this
  }

  protected removeAll(destroy: boolean = true) {
    for (let child of this._children) {
      //@ts-ignore
      child.setParent(this)
      child._getElement().remove()
      if (destroy) child.destroy()
    }
    this._children.length = 0
    return this
  }

  protected removeChildren(...children: AbstractComponent[]) {
    for (let child of children) {
      this.removeChild(child)
    }
    return this
  }

  protected removeChild(
    child: AbstractComponent,
    index: number = this._children.indexOf(child),
  ): this {
    if (index >= 0) {
      this._children.splice(index, 1)
      child._getElement().remove()
      child.setParent(this as any)
    }
    return this
  }

  //@ts-ignore
  set<Key extends PropertyKeys<El>>(key: Key, value: El[Key] | Value<El[Key]>) {
    if (value instanceof Value) {
      this._element[key] = value.get()
      this.beCurrent()
      value.register(() => (this._element[key] = value.get()))
    } else {
      this._element[key] = value
    }
    return this
  }

  get<Key extends PropertyKeys<El>>(key: Key): El[Key] {
    return this._element[key]
  }

  invoke<Key extends FunctionKeys<El>>(
    fnName: Key,
    //@ts-ignore
    ...args: Parameters<El[Key]>
    //@ts-ignore
  ): ReturnType<El[Key]> {
    const fn = this._element[fnName]
    if (typeof fn === "function") return fn.apply(this._element, args)
    else throw new Error((fnName as any) + " is not a function")
  }

  destroy() {
    super.destroy()
    for (let child of this._children) {
      child.destroy()
    }
    this._children.length = 0
    this._element.remove()
  }

  id(val: string) {
    this._element.id = val
    return this
  }

  class(name: string) {
    this._element.className = name
    return this
  }

  slot(name: string) {
    //@ts-ignore
    return this.set("slot", name)
  }

  on<Name extends keyof Events>(
    name: Name,
    listener: (evt: Events[Name]) => void,
    options?: AddEventListenerOptions & { key?: any },
  ) {
    //@ts-ignore
    this._element.addEventListener(name, listener, options)
    if (options?.key) {
      this._keyMapListener.set(options.key, listener)
    }
    return this
  }

  off<Name extends keyof Events>(
    name: Name,
    options: EventListenerOptions & { key?: any; listener?: (evt: Events[Name]) => void },
  ) {
    let listener: any
    if (options.key) listener = this._keyMapListener.get(options.key)
    else if (options.listener) listener = options.listener
    else return
    //@ts-ignore
    this._element.removeEventListener(name, listener, options)
    this._keyMapListener.delete(options.key)
    return this
  }
}
