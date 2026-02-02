function applyMixins(...constructors) {
  const derivedCtor = class {}
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      )
    })
  })
  return derivedCtor
}

class Jumpable {
  get jumpName() {
    return "kkk"
  }

  jump() {
    console.log(this.jumpName)
    return this
  }
}

class Duckable {
  _duckName = 2

  get duckName() {
    return this._duckName
  }

  set duckName(value) {
    this._duckName = value
  }

  duck() {
    console.log(this._duckName)
  }
}

class Sprite extends applyMixins(Jumpable, Duckable) {
  name = "20" + 30
}

const sprite = new Sprite()
sprite.duckName = "123"
console.log(
  sprite.duck(),
  sprite.jump(),
  sprite,
  sprite.jumpName,
  sprite.duckName,
  sprite._duckName,
)
