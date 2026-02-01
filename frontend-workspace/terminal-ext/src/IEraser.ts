import type { Class } from "shared"
import { InjectKeyTerminal } from "./inject-key.ts"
import { injectValue } from "./provider-inject.ts"

/**
 * 终端可清除内容的操作接口
 * 定义了终端中各种清除操作的方法
 */
export interface IEraser {
  readonly isEraser: true

  /**
   * 清除整个屏幕
   * @returns Promise<void> 异步操作完成的Promise
   */
  screen(): Promise<void>

  /**
   * 清除整个屏幕和终端的滚动缓冲区内容
   * @returns Promise<void> 异步操作完成的Promise
   */
  all(): Promise<void>

  /**
   * 清除从光标当前位置到行末尾的所有内容
   * @returns Promise<void> 异步操作完成的Promise
   */
  toEnd(): Promise<void>

  /**
   * 清除从行开头到光标当前位置的所有内容
   * @returns Promise<void> 异步操作完成的Promise
   */
  toHome(): Promise<void>

  /**
   * 清除光标所在行的内容
   * @returns Promise<void> 异步操作完成的Promise
   */
  line(): Promise<void>

  /**
   * 清除从光标当前位置到当前屏幕顶部的内容
   * @returns Promise<void> 异步操作完成的Promise
   */
  top(): Promise<void>

  /**
   * 清除从光标当前位置到当前屏幕底部的内容
   * @returns Promise<void> 异步操作完成的Promise
   */
  bottom(): Promise<void>
}

export function Eraser<Base extends Class<Object>>(base: Base): Base & Class<IEraser> {
  return class extends base implements IEraser {
    readonly isEraser = true
    readonly term = injectValue(InjectKeyTerminal)

    all(): Promise<void> {
      return this.term.write("\x1b[3J")
    }

    bottom(): Promise<void> {
      return this.term.write("\x1b[J")
    }

    line(): Promise<void> {
      return this.term.write("\x1b[2K")
    }

    screen(): Promise<void> {
      return this.term.write("\x1b[2J")
    }

    toEnd(): Promise<void> {
      return this.term.write("\x1b[K")
    }

    toHome(): Promise<void> {
      return this.term.write("\x1b[1K")
    }

    top(): Promise<void> {
      return this.term.write("\x1b[1J")
    }
  }
}
