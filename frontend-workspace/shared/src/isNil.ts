/**
 * 检查传入的参数是否为 null 或 undefined
 * @param arg - 待检查的参数，可以是任意类型
 * @returns 如果参数为 null 或 undefined 则返回 true，否则返回 false
 */
export function isNil(arg?: any): arg is null | undefined {
  return arg === null || arg === undefined
}
