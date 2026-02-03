import type { AbstractClass, Class } from "./types.ts"

/**
 * 应用多个类的原型方法到一个新的基类上，实现多重继承的效果
 * @param array 要应用的类构造函数数组
 * @returns 返回一个继承了所有传入类原型方法的新类
 */
export function Apply<T = any>(...array: (Class<any> | AbstractClass<any>)[]): Class<T> {
  // 创建一个空的基础类作为合并的起点
  const Base = class MultiBase {}

  // 遍历每个要应用的类构造函数
  array.forEach((baseCtor) => {
    // 获取当前类原型上的所有属性名
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      // 将当前类原型上的属性/方法定义到基础类的原型上
      Object.defineProperty(
        Base.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      )
    })
  })
  return Base as any
}
