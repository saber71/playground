import type { AddEventListenerOptions } from "rxjs/internal/observable/fromEvent"
import type { PartialCssStyles, PropertyKeys } from "shared"
import { BaseCustomElement } from "./BaseCustomElement.ts"

export type ElementExt<E extends HTMLElement> = E & Ext<E>

export type ElementExtArray<E extends HTMLElement = HTMLElement> = Array<
  ElementExt<E> | null | undefined | ElementExtArray<E>
>

/**
 * Ext 接口定义了扩展HTML元素的功能集合
 * 提供了DOM操作、样式设置、元素查询等便捷方法
 */
export interface Ext<E extends HTMLElement> {
  readonly isExt: true

  /**
   * 获取当前元素的所有祖先元素
   *
   * @template E 继承自HTMLElement的元素类型
   * @returns {Array<E & HTMLElement>} 返回一个包含所有祖先元素的数组，每个元素都是E与Ext的交集类型
   */
  getAncestor<E extends HTMLElement>(): Array<E & HTMLElement>

  /**
   * 获取当前元素的父元素
   *
   * @template E - 指定要获取的父元素的HTML元素类型
   * @returns {E & Ext | null} 返回指定类型的父元素，如果不存在则返回null
   */
  getParent<E extends HTMLElement>(): ElementExt<E> | null

  /**
   * 添加子元素到当前元素
   * @param children 要添加的HTML元素列表
   * @returns 返回当前实例以支持链式调用
   */
  addChildren(...children: ElementExtArray): this

  /**
   * 在指定索引位置插入子元素
   * @param child 要插入的HTML元素
   * @param index 插入位置的索引
   * @returns 返回当前实例以支持链式调用
   */
  addChildAt(child: HTMLElement, index: number): this

  /**
   * 从当前元素中移除指定的子元素
   * @param children 要移除的HTML元素列表
   * @returns 返回当前实例以支持链式调用
   */
  removeChildren(...children: HTMLElement[]): this

  /**
   * 根据索引获取子元素并扩展其功能
   * @param index 子元素的索引位置
   * @returns 返回指定位置的子元素，并扩展了Ext功能
   */
  getChild<E extends HTMLElement>(index: number): ElementExt<E>

  /**
   * 为元素应用CSS样式
   * @param part 要应用的部分CSS样式对象
   * @returns 返回当前实例以支持链式调用
   */
  styles(part: PartialCssStyles): this

  styleProperties(part: Record<string, any>): this

  /**
   * 根据类名查询元素
   * @param className 要查询的CSS类名
   * @returns 返回匹配类名的元素数组，每个元素都扩展了Ext功能
   */
  queryByClassName<El extends HTMLElement>(className: string): Array<ElementExt<El>>

  /**
   * 根据CSS选择器查询单个元素
   * @param selector CSS选择器字符串
   * @returns 返回第一个匹配的选择器元素，如果未找到则返回null
   */
  queryBySelector<El extends HTMLElement>(selector: string): ElementExt<El> | null

  /**
   * 根据CSS选择器查询所有匹配的元素
   * @param selector CSS选择器字符串
   * @returns 返回所有匹配选择器的元素数组
   */
  queryAllBySelector<El extends HTMLElement>(selector: string): Array<ElementExt<El>>

  /**
   * 设置元素的id属性
   * @param val 要设置的id值
   * @returns 返回当前实例以支持链式调用
   */
  setId(val: string): this

  /**
   * 设置元素的class属性
   * @param val 要设置的一个或多个CSS类名
   * @returns 返回当前实例以支持链式调用
   */
  setClassName(...val: string[]): this

  setSlot(val: string): this

  /**
   * 设置元素的属性
   * @param name 属性名称
   * @param value 属性值
   * @returns 返回当前实例以支持链式调用
   */
  attr<Key extends PropertyKeys<E>>(name: Key, value: E[Key]): this

  /**
   * 添加事件监听器
   * @template Key - 事件名称的类型，必须是GlobalEventHandlersEventMap的键名
   * @param name - 事件名称
   * @param callback - 事件回调函数，接收对应事件类型的事件对象作为参数
   * @param options - 可选的事件监听选项，包含AddEventListenerOptions和自定义key属性
   * @returns 返回当前实例，支持链式调用
   */
  on<Key extends keyof GlobalEventHandlersEventMap>(
    name: Key,
    callback: (evt: GlobalEventHandlersEventMap[Key]) => void,
    options?: AddEventListenerOptions & { key?: any },
  ): this

  /**
   * 移除事件监听器
   * @template Key - 事件名称的类型，必须是GlobalEventHandlersEventMap的键名
   * @param name - 事件名称
   * @param options - 事件移除选项，包含AddEventListenerOptions、可选的key和回调函数
   * @returns 返回当前实例，支持链式调用
   */
  off<Key extends keyof GlobalEventHandlersEventMap>(
    name: Key,
    options: AddEventListenerOptions & {
      key?: any
      callback?: (evt: GlobalEventHandlersEventMap[Key]) => void
    },
  ): this
}

/**
 * 检查对象是否为扩展的HTML元素类型
 *
 * @param obj - 待检查的对象
 * @returns 如果对象是HTMLElement的扩展类型则返回true，否则返回false
 */
export function isHTMLElementExt(obj: any): obj is ElementExt<HTMLElement> {
  return obj.isExt && obj instanceof HTMLElement
}

/**
 * 扩展HTML元素功能，为其添加额外的方法和属性
 * @param element 需要扩展的HTML元素
 * @returns 返回扩展后的元素，包含原始元素的所有属性和方法以及扩展的功能
 */
export function HTMLElementExt<El extends HTMLElement>(element: El): ElementExt<El> {
  if (isHTMLElementExt(element)) return element

  const keyCallbackMap = new Map()

  // 创建扩展对象，包含各种实用方法
  const ext: Ext<El> = {
    isExt: true,

    /**
     * 获取当前元素的所有祖先元素
     *
     * @template E 继承自HTMLElement的元素类型
     * @returns 返回一个包含所有祖先元素的数组，每个元素都是E与Ext的交集类型
     */
    getAncestor() {
      const array: any[] = []
      let parent = this.getParent()
      while (parent) {
        array.push(parent)
        parent = parent.getParent()
      }
      return array
    },

    /**
     * 获取当前元素的父元素
     *
     * @template E - 指定要获取的父元素的HTML元素类型
     * @returns {E & Ext | null} 返回指定类型的父元素，如果不存在则返回null
     */
    getParent(): any {
      return element.parentElement ? HTMLElementExt(element.parentElement) : null
    },

    /**
     * 添加子元素到当前元素
     * @param children 要添加的子元素列表
     * @returns 返回当前扩展对象以支持链式调用
     */
    addChildren(...children) {
      element.append(...(children.flat().filter((i) => !!i) as any))
      return this
    },

    /**
     * 在指定索引位置插入子元素
     * @param child 要插入的子元素
     * @param index 插入位置的索引
     * @returns 返回当前扩展对象以支持链式调用
     */
    addChildAt(child, index) {
      if (index >= element.children.length) element.appendChild(child)
      else {
        const old = element.children.item(index)
        element.insertBefore(child, old)
      }
      return this
    },

    /**
     * 获取指定索引位置的子元素
     * @param index 子元素的索引位置
     * @returns 返回扩展后的子元素
     */
    getChild(index: number) {
      return HTMLElementExt(element.children.item(index) as any) as any
    },

    /**
     * 从当前元素中移除指定的子元素
     * @param children 要移除的子元素列表
     * @returns 返回当前扩展对象以支持链式调用
     */
    removeChildren(...children) {
      for (let child of children) {
        element.removeChild(child)
      }
      return this
    },

    /**
     * 为元素设置样式
     * @param part 样式对象
     * @returns 返回当前扩展对象以支持链式调用
     */
    styles(part) {
      Object.assign(element.style, part)
      return this
    },

    styleProperties(part: Record<string, any>) {
      for (let [key, value] of Object.entries(part)) {
        element.style.setProperty(key, value)
      }
      return this
    },

    /**
     * 根据类名查询子元素
     * @param className 要查询的类名
     * @returns 返回匹配的扩展元素数组
     */
    queryByClassName<El extends HTMLElement>(className: string): Array<ElementExt<El>> {
      const queryResult = element.getElementsByClassName(className)
      return Array.from(queryResult).map(HTMLElementExt as any)
    },

    /**
     * 根据CSS选择器查询所有匹配的子元素
     * @param selector CSS选择器
     * @returns 返回匹配的扩展元素数组
     */
    queryAllBySelector<El extends HTMLElement>(selector: string): Array<ElementExt<El>> {
      const queryResult = element.querySelectorAll(selector)
      return Array.from(queryResult).map(HTMLElementExt as any)
    },

    /**
     * 根据CSS选择器查询第一个匹配的子元素
     * @param selector CSS选择器
     * @returns 返回匹配的扩展元素或null
     */
    queryBySelector<El extends HTMLElement>(selector: string): ElementExt<El> | null {
      const result = element.querySelector(selector)
      return result ? HTMLElementExt(result as any) : null
    },

    /**
     * 设置元素的class名称
     * @param val 类名字符串数组
     * @returns 返回当前扩展对象以支持链式调用
     */
    setClassName(...val: string[]) {
      element.className = val.join(" ")
      return this
    },

    /**
     * 设置元素的id属性
     * @param val id值
     * @returns 返回当前扩展对象以支持链式调用
     */
    setId(val: string) {
      element.id = val
      return this
    },

    setSlot(val: string) {
      element.slot = val
      return this
    },

    /**
     * 设置元素的属性
     * @param name 属性名称
     * @param value 属性值
     * @returns 返回当前实例以支持链式调用
     */
    attr(name: any, value: any) {
      //@ts-ignore
      element[name] = value
      return this
    },

    /**
     * 移除事件监听器
     * @template Key - 事件名称的类型，必须是GlobalEventHandlersEventMap的键名
     * @param name - 事件名称
     * @param options - 事件移除选项，包含AddEventListenerOptions、可选的key和回调函数
     * @returns 返回当前实例，支持链式调用
     */
    off<Key extends keyof GlobalEventHandlersEventMap>(
      name: Key,
      options: AddEventListenerOptions & {
        key?: any
        callback?: (evt: GlobalEventHandlersEventMap[Key]) => void
      },
    ) {
      let callback = options.callback
      if (options.key && !callback) callback = keyCallbackMap.get(options.key)
      if (callback) {
        element.removeEventListener(name, callback)
        keyCallbackMap.delete(options.key)
      }
      return this
    },

    /**
     * 添加事件监听器
     * @template Key - 事件名称的类型，必须是GlobalEventHandlersEventMap的键名
     * @param name - 事件名称
     * @param callback - 事件回调函数，接收对应事件类型的事件对象作为参数
     * @param options - 可选的事件监听选项，包含AddEventListenerOptions和自定义key属性
     * @returns 返回当前实例，支持链式调用
     */
    on<Key extends keyof GlobalEventHandlersEventMap>(
      name: Key,
      callback: (evt: GlobalEventHandlersEventMap[Key]) => void,
      options?: AddEventListenerOptions & {
        key?: any
      },
    ) {
      if (options?.key) keyCallbackMap.set(options.key, callback)
      element.addEventListener(name, callback, options)
      return this
    },
  }

  // 监听自定义元素的属性变化
  observeAttribute(element)

  return Object.assign(element, ext)
}

/**
 * 观察元素的属性变化并自动调用attributeChangedCallback方法
 * 该函数会遍历元素构造函数中定义的observedAttributes数组，并为每个属性创建getter/setter
 * 当属性值发生变化时，会触发自定义元素的attributeChangedCallback回调
 *
 * @param el - 需要观察属性变化的HTML元素
 * @returns void
 */
export function observeAttribute(el: any) {
  //@ts-ignore
  // 如果不是自定义元素不监听属性变化
  if (!(e instanceof BaseCustomElement)) return

  // 获取元素构造函数中定义的被观察属性列表
  const observedAttributes = (el.constructor as any).observedAttributes
  if (observedAttributes) {
    for (let attr of observedAttributes) {
      //@ts-ignore
      let value = el[attr]
      // 为属性重新定义getter/setter以拦截属性访问和修改
      Object.defineProperty(el, attr, {
        get(): any {
          return value
        },
        set(v: any) {
          if (v === value) return
          const oldValue = value
          value = v
          //@ts-ignore
          el.attributeChangedCallback(attr, oldValue, v)
        },
      })
    }
  }
}
