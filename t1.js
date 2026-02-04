function applyMixins(...constructors) {
  const derivedCtor = class {}

  constructors.forEach((baseCtor) => {
    // 递归遍历原型链，获取所有祖先类的成员
    let proto = baseCtor.prototype
    while (proto && proto !== Object.prototype) {
      Object.getOwnPropertyNames(proto).forEach((name) => {
        if (name === "constructor") return
        if (!derivedCtor.prototype.hasOwnProperty(name)) {
          Object.defineProperty(
            derivedCtor.prototype,
            name,
            Object.getOwnPropertyDescriptor(proto, name) || Object.create(null),
          )
        }
      })
      proto = Object.getPrototypeOf(proto) // 向上查找原型链
    }
  })

  return derivedCtor
}

class A {
  get propA() {
    return "prop:A"
  }

  a() {
    return "A:a()"
  }
}

class B extends applyMixins(A) {
  b() {
    return ["B:b()", this.a(), this.propA]
  }
}
console.log(B.prototype)
// const b = new B()
// console.log(b.b, b.a, b.propA)
//
class C extends applyMixins(B) {
  c() {
    return ["C:c()", this.b()]
  }
}

console.log(new C().c())
