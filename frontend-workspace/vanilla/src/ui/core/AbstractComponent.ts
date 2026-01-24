import type { FunctionKeys, PropertyKeys } from "../../types.ts"
import { Value } from "../../utils"
import { ScopedWatcher } from "../../utils/ScopedWatcher.ts"

export class AbstractComponent<El extends Element = Element, Events = GlobalEventHandlersEventMap> {
  private _children: AbstractComponent[] = []
  private _parent: AbstractComponent | undefined
  protected readonly _scopedWatcher = new ScopedWatcher()
  private readonly _keyMapListener: Map<any, any> = new Map()

  constructor(private readonly _element: El) {}

  getParent() {
    return this._parent
  }

  getElement() {
    return this._element
  }

  getChild<E extends AbstractComponent>(index: number): E {
    return this._children[index] as E
  }

  addChildren(...children: AbstractComponent[]) {
    for (let child of children) {
      this.addChild(child)
    }
    return this
  }

  addChild(child: AbstractComponent) {
    const index = this._children.indexOf(child)
    if (index >= 0) this.removeChild(child, index)
    this._children.push(child)
    this._element.appendChild(child._element)
    //@ts-ignore
    child._parent = this
    return this
  }

  addChildAt(child: AbstractComponent, index: number) {
    const oldIndex = this._children.indexOf(child)
    if (oldIndex !== index) {
      if (oldIndex >= 0) this.removeChild(child, oldIndex)
      if (index < this._children.length) {
        const n = this._children[index]
        this._element.insertBefore(child.getElement(), n.getElement())
        this._children = [...this._children.slice(0, index), child, ...this._children.slice(index)]
        //@ts-ignore
        child._parent = this
      } else {
        this.addChild(child)
      }
    }
  }

  removeChildren(...children: AbstractComponent[]) {
    for (let child of children) {
      this.removeChild(child)
    }
    return this
  }

  removeChild(child: AbstractComponent, index: number = this._children.indexOf(child)) {
    if (index >= 0) {
      this._children.splice(index, 1)
      child._element.remove()
      child._parent = undefined
    }
    return this
  }

  //@ts-ignore
  set<Key extends PropertyKeys<El>>(key: Key, value: El[Key] | Value<El[Key]>) {
    if (value instanceof Value) {
      this._element[key] = value.get()
      ScopedWatcher.current(this._scopedWatcher)
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
    for (let child of this._children) {
      child.destroy()
    }
    this._scopedWatcher.destroy()
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
