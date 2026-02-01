import type { Class } from "shared"
import { InjectKeyTerminal } from "./inject-key.ts"
import { injectValue } from "./provider-inject.ts"

/**
 * 光标位置接口，定义了光标的行和列坐标
 */
export interface CursorPosition {
  row: number
  col: number
}

/**
 * 光标管理器接口，提供光标位置操作的各种方法
 */
export interface ICursorManager {
  readonly isCursorManager: true

  /**
   * 设置光标是否自动换行
   */
  autoWrap(val: boolean): Promise<void>

  /**
   * 获取当前光标位置
   * @returns Promise<CursorPosition> 返回包含行和列的光标位置对象
   */
  getPosition(): Promise<CursorPosition>

  /**
   * 保存当前光标位置到内部状态
   * @returns Promise<void> 异步操作完成的Promise
   */
  savePosition(): Promise<void>

  /**
   * 恢复之前保存的光标位置
   * @returns Promise<void> 异步操作完成的Promise
   */
  restorePosition(): Promise<void>

  /**
   * 将光标移动到指定行或当前行的顶部
   * @param n 可选的行号，如果未提供则移动到当前行顶部
   * @returns Promise<void> 异步操作完成的Promise
   */
  top(n?: number): Promise<void>

  /**
   * 将光标移动到指定行或当前行的底部
   * @param n 可选的行号，如果未提供则移动到当前行底部
   * @returns Promise<void> 异步操作完成的Promise
   */
  down(n?: number): Promise<void>

  /**
   * 将光标向左移动指定的列数
   * @param n 可选的移动列数，默认为1
   * @returns Promise<void> 异步操作完成的Promise
   */
  left(n?: number): Promise<void>

  /**
   * 将光标向右移动指定的列数
   * @param n 可选的移动列数，默认为1
   * @returns Promise<void> 异步操作完成的Promise
   */
  right(n?: number): Promise<void>

  /**
   * 设置光标到指定位置
   * @param pos 部分光标位置对象，可以只设置行或列中的一个或两个都设置
   * @returns Promise<void> 异步操作完成的Promise
   */
  setPosition(pos: Partial<CursorPosition>): Promise<void>

  /**
   * 显示光标
   * @returns Promise<void> 异步操作完成的Promise
   */
  show(): Promise<void>

  /**
   * 隐藏光标
   * @returns Promise<void> 异步操作完成的Promise
   */
  hide(): Promise<void>
}

export function CursorManager<Base extends Class<Object>>(
  base: Base,
): Class<ICursorManager> & Base {
  return class extends base implements ICursorManager {
    readonly isCursorManager = true
    readonly term = injectValue(InjectKeyTerminal)

    down(n: number = 1): Promise<void> {
      return this.term.write(`\x1b[${n}B`)
    }

    getPosition(): Promise<CursorPosition> {
      return new Promise<CursorPosition>((resolve) => {
        this.term.onData((str) => {
          const pos = str.replace("\x1B[", "").replace("R", "")
          const array = pos.split(";").map(Number)
          resolve({ row: array[0], col: array[1] })
        }, true)
        this.term.write("\x1B[6n")
      })
    }

    hide(): Promise<void> {
      return this.term.write("\x1b[?25l")
    }

    left(n: number = 1): Promise<void> {
      return this.term.write(`\x1b[${n}D`)
    }

    restorePosition(): Promise<void> {
      return this.term.write("\x1b[u")
    }

    right(n: number = 1): Promise<void> {
      return this.term.write(`\x1b[${n}C`)
    }

    savePosition(): Promise<void> {
      return this.term.write("\x1b[s")
    }

    async setPosition(pos: Partial<CursorPosition>): Promise<void> {
      if (typeof pos.row !== "number" || typeof pos.col !== "number") {
        const curPos = await this.getPosition()
        if (typeof pos.row !== "number") pos.row = curPos.row
        if (typeof pos.col !== "number") pos.col = curPos.col
      }
      return this.term.write(`\x1b[${pos.row};${pos.col}H`)
    }

    show(): Promise<void> {
      return this.term.write("\x1b[?25h")
    }

    top(n: number = 1): Promise<void> {
      return this.term.write(`\x1b[${n}A`)
    }

    autoWrap(val: boolean) {
      return this.term.write(val ? "\x1b[?7h" : "\x1b[?7l")
    }
  }
}
