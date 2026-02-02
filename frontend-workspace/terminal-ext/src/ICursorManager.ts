import type { Class } from "shared"
import { AnsiCursor, parseAnsiCursorPosition } from "./ansi-code.ts"
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
   * 设置光标到指定位置，1-based
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
      return this.term.write(AnsiCursor.DOWN(n))
    }

    getPosition(): Promise<CursorPosition> {
      return new Promise<CursorPosition>((resolve) => {
        this.term.onData((str, stop) => {
          const pos = parseAnsiCursorPosition(str)
          if (pos) {
            resolve(pos)
            stop()
          }
        })
        this.term.write(AnsiCursor.REQUEST_POSITION)
      })
    }

    hide(): Promise<void> {
      return this.term.write(AnsiCursor.HIDE)
    }

    left(n: number = 1): Promise<void> {
      return this.term.write(AnsiCursor.LEFT(n))
    }

    restorePosition(): Promise<void> {
      return this.term.write(AnsiCursor.RESTORE_POSITION)
    }

    right(n: number = 1): Promise<void> {
      return this.term.write(AnsiCursor.RIGHT(n))
    }

    savePosition(): Promise<void> {
      return this.term.write(AnsiCursor.SAVE_POSITION)
    }

    async setPosition(pos: Partial<CursorPosition>): Promise<void> {
      if (typeof pos.row !== "number" || typeof pos.col !== "number") {
        const curPos = await this.getPosition()
        if (typeof pos.row !== "number") pos.row = curPos.row
        if (typeof pos.col !== "number") pos.col = curPos.col
      }
      return this.term.write(AnsiCursor.SET_POSITION(pos.row, pos.col))
    }

    show(): Promise<void> {
      return this.term.write(AnsiCursor.SHOW)
    }

    top(n: number = 1): Promise<void> {
      return this.term.write(AnsiCursor.TOP(n))
    }

    autoWrap(val: boolean) {
      return this.term.write(val ? AnsiCursor.ENABLE_AUTOWRAP : AnsiCursor.DISABLE_AUTOWRAP)
    }
  }
}
