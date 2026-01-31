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
  bottom(n?: number): Promise<void>

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

/**
 * 检查对象是否为ICursorManager类型的实例
 *
 * @param obj - 待检查的对象，可选参数
 * @returns 返回布尔值，如果对象是ICursorManager类型则返回true，否则返回false
 */
export function isCursorManager(obj?: any): obj is ICursorManager {
  return obj?.isCursorManager
}
