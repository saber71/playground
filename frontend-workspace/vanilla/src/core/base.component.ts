import type { FunctionKeys, PropertyKeys, StopWatcher } from "../types.ts"
import { Value } from "../utils"

export class BaseComponent<
  El extends HTMLElement = HTMLElement,
  Events = GlobalEventHandlersEventMap,
> {
  private _children: BaseComponent[] = []
  private _parent: BaseComponent | undefined
  private readonly _stopWatchers: StopWatcher[] = []
  private readonly _keyMapListener: Map<any, any> = new Map()

  constructor(private readonly _htmlElement: El) {}

  getParent() {
    return this._parent
  }

  getHTMLElement() {
    return this._htmlElement
  }

  addChildren(...children: BaseComponent[]) {
    for (let child of children) {
      this.addChild(child)
    }
    return this
  }

  addChild(child: BaseComponent) {
    const index = this._children.indexOf(child)
    if (index >= 0) this.removeChild(child, index)
    this._children.push(child)
    this._htmlElement.appendChild(child._htmlElement)
    //@ts-ignore
    child._parent = this
    return this
  }

  addChildAt(child: BaseComponent, index: number) {
    const oldIndex = this._children.indexOf(child)
    if (oldIndex !== index) {
      if (oldIndex >= 0) this.removeChild(child, oldIndex)
      if (index < this._children.length) {
        const n = this._children[index]
        this._htmlElement.insertBefore(child.getHTMLElement(), n.getHTMLElement())
        this._children = [...this._children.slice(0, index), child, ...this._children.slice(index)]
        //@ts-ignore
        child._parent = this
      } else {
        this.addChild(child)
      }
    }
  }

  removeChildren(...children: BaseComponent[]) {
    for (let child of children) {
      this.removeChild(child)
    }
    return this
  }

  removeChild(child: BaseComponent, index: number = this._children.indexOf(child)) {
    if (index >= 0) {
      this._children.splice(index, 1)
      child._htmlElement.remove()
      child._parent = undefined
    }
    return this
  }

  //@ts-ignore
  set<Key extends PropertyKeys<El>>(key: Key, value: El[Key] | Value<El[Key]>) {
    if (value instanceof Value) {
      this._htmlElement[key] = value.get()
      const stopWatcher = value.register(() => (this._htmlElement[key] = value.get()))
      this._stopWatchers.push(stopWatcher)
    } else {
      this._htmlElement[key] = value
    }
    return this
  }

  get<Key extends PropertyKeys<El>>(key: Key): El[Key] {
    return this._htmlElement[key]
  }

  invoke<Key extends FunctionKeys<El>>(
    fnName: Key,
    //@ts-ignore
    ...args: Parameters<El[Key]>
    //@ts-ignore
  ): ReturnType<El[Key]> {
    const fn = this._htmlElement[fnName]
    if (typeof fn === "function") return fn.apply(this._htmlElement, args)
    else throw new Error((fnName as any) + " is not a function")
  }

  destroy() {
    for (let child of this._children) {
      child.destroy()
    }
    for (let stopWatcher of this._stopWatchers) {
      stopWatcher()
    }
    this._children.length = 0
    this._stopWatchers.length = 0
    this._htmlElement.remove()
  }

  setStyle(name: keyof CSSStyleDeclaration, value: string | Value<string>) {
    if (value instanceof Value) {
      //@ts-ignore
      this._htmlElement.style[name] = value.get()
      //@ts-ignore
      const stopWatcher = value.register(() => (this._htmlElement.style[name] = value.get()))
      this._stopWatchers.push(stopWatcher)
    } else {
      //@ts-ignore
      this._htmlElement.style[name] = value
    }
    return this
  }

  setStyleProperty(name: string, value: string | Value<string>) {
    if (value instanceof Value) {
      this._htmlElement.style.setProperty(name, value.get())
      const stopWatcher = value.register(() =>
        this._htmlElement.style.setProperty(name, value.get()),
      )
      this._stopWatchers.push(stopWatcher)
    } else {
      this._htmlElement.style.setProperty(name, value)
    }
    return this
  }

  on<Name extends keyof Events>(
    name: Name,
    listener: (evt: Events[Name]) => void,
    options?: AddEventListenerOptions & { key?: any },
  ) {
    //@ts-ignore
    this._htmlElement.addEventListener(name, listener, options)
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
    this._htmlElement.removeEventListener(name, listener, options)
    this._keyMapListener.delete(options.key)
    return this
  }
}
