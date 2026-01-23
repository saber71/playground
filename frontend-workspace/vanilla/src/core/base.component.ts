import type { AddEventListenerOptions } from "rxjs/internal/observable/fromEvent"
import type {
  BoxSizing,
  CssLength,
  CursorType,
  DisplayType,
  FlexDirectionType,
  FlexPositionType,
  FunctionKeys,
  OverflowType,
  PartialCssStyles,
  PositionType,
  PropertyKeys,
  WhiteSpaceType,
} from "../types.ts"
import { Value } from "../utils"
import { ScopedWatcher } from "../utils/ScopedWatcher.ts"
import type { Styleable } from "./styleable.interface.ts"

export class BaseComponent<
  El extends HTMLElement = HTMLElement,
  Events = GlobalEventHandlersEventMap,
> implements Styleable {
  private _children: BaseComponent[] = []
  private _parent: BaseComponent | undefined
  private readonly _scopedWatcher = new ScopedWatcher()
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
      ScopedWatcher.current(this._scopedWatcher)
      value.register(() => (this._htmlElement[key] = value.get()))
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
    this._scopedWatcher.destroy()
    this._children.length = 0
    this._htmlElement.remove()
  }

  id(val: string) {
    this._htmlElement.id = val
    return this
  }

  class(name: string) {
    this._htmlElement.className = name
    return this
  }

  style(name: keyof CSSStyleDeclaration, value: string | Value<string>) {
    if (value instanceof Value) {
      //@ts-ignore
      this._htmlElement.style[name] = value.get()
      ScopedWatcher.current(this._scopedWatcher)
      //@ts-ignore
      value.register(() => (this._htmlElement.style[name] = value.get()))
    } else {
      //@ts-ignore
      this._htmlElement.style[name] = value
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
      this._htmlElement.style.setProperty(name, value.get())
      ScopedWatcher.current(this._scopedWatcher)
      value.register(() => this._htmlElement.style.setProperty(name, value.get()))
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

  absolute(): this {
    return this.style("position", "absolute")
  }

  background(val: string | Value<string>): this {
    return this.style("background", val)
  }

  color(val: string | Value<string>): this {
    return this.style("color", val)
  }

  borderBox(): this {
    return this.style("boxSizing", "border-box")
  }

  bottom(val: CssLength | Value<CssLength>): this {
    return this.style("bottom", val)
  }

  boxSizing(val: BoxSizing | Value<BoxSizing>): this {
    return this.style("boxSizing", val)
  }

  display(val: DisplayType | Value<DisplayType>): this {
    return this.style("display", val)
  }

  fixed(): this {
    return this.style("position", "fixed")
  }

  flex(): this {
    return this.style("display", "flex")
  }

  grid(): this {
    return this.style("display", "grid")
  }

  height(val: CssLength | Value<CssLength>): this {
    return this.style("height", val)
  }

  left(val: CssLength | Value<CssLength>): this {
    return this.style("left", val)
  }

  lineHeight(val: CssLength | Value<CssLength>): this {
    return this.style("lineHeight", val)
  }

  margin(...val: CssLength[]): this {
    return this.style("margin", val.join(" "))
  }

  overflow(val: OverflowType | Value<OverflowType>): this {
    return this.style("overflow", val)
  }

  padding(...val: CssLength[]): this {
    return this.style("padding", val.join(" "))
  }

  position(val: PositionType | Value<PositionType>): this {
    return this.style("position", val)
  }

  relative(): this {
    return this.position("relative")
  }

  right(val: CssLength | Value<CssLength>): this {
    return this.style("right", val)
  }

  sticky(): this {
    return this.position("sticky")
  }

  top(val: CssLength | Value<CssLength>): this {
    return this.style("top", val)
  }

  whiteSpace(val: WhiteSpaceType | Value<WhiteSpaceType>): this {
    return this.style("whiteSpace", val)
  }

  width(val: CssLength | Value<CssLength>): this {
    return this.style("width", val)
  }

  alignItems(val: FlexPositionType | Value<FlexPositionType>): this {
    return this.style("alignItems", val)
  }

  justifyContent(val: FlexPositionType | Value<FlexPositionType>): this {
    return this.style("justifyContent", val)
  }

  flexGrow(val: number | Value<number>): this {
    return this.style("flexGrow", val as any)
  }

  flexShrink(val: number | Value<number>): this {
    return this.style("flexShrink", val as any)
  }

  flexDirection(val: FlexDirectionType | Value<FlexDirectionType>): this {
    return this.style("flexDirection", val)
  }

  gap(val: CssLength | Value<CssLength>): this {
    return this.style("gap", val)
  }

  gridTemplateColumns(val: string | Value<string>): this {
    return this.style("gridTemplateColumns", val)
  }

  gridTemplateRows(val: string | Value<string>): this {
    return this.style("gridTemplateRows", val)
  }

  cursor(val: CursorType | Value<CursorType>): this {
    return this.style("cursor", val)
  }
}
