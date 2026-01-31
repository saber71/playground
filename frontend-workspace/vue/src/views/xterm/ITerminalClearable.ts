/**
 * 终端可清除内容的操作接口
 * 定义了终端中各种清除操作的方法
 */
export interface ITerminalClearable {
  readonly isTerminalClearable: true

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

/**
 * 检查对象是否为可清除的终端类型
 *
 * @param obj - 待检查的对象，可以为任意类型或undefined
 * @returns 返回布尔值，如果对象具有isTerminalClearable属性则返回true，否则返回false
 */
export function isTerminalClearable(obj?: any): obj is ITerminalClearable {
  return obj?.isTerminalClearable
}
