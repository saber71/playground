/**
 * 等待指定时间后 resolves 的异步函数
 * @param ms - 要等待的时间（毫秒）
 * @returns 一个 Promise，在指定时间后 resolve
 */
export function waitTime(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
