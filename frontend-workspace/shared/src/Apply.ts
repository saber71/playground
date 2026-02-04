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
    // 递归遍历原型链，获取所有祖先类的成员
    let proto = baseCtor.prototype
    while (proto && proto !== Object.prototype) {
      Object.getOwnPropertyNames(proto).forEach((name) => {
        if (name === "constructor") return
        if (!Base.prototype.hasOwnProperty(name)) {
          Object.defineProperty(
            Base.prototype,
            name,
            Object.getOwnPropertyDescriptor(proto, name) || Object.create(null),
          )
        }
      })
      proto = Object.getPrototypeOf(proto) // 向上查找原型链
    }
  })

  return Base as any
}
