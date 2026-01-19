import { Injectable } from "@nestjs/common"
import JSEncrypt from "jsencrypt"
import { ApiService } from "../../api/api.service"

@Injectable()
export class EncryptService {
  private readonly _encoder: JSEncrypt = new JSEncrypt()
  private _inited = false

  constructor(readonly api: ApiService) {}

  async encrypt(str: string) {
    await this._init()
    const result = this._encoder.encrypt(str)
    if (result === false) throw new Error("encrypt failed")
    return result
  }

  private async _init() {
    if (this._inited) return
    this._inited = true
    this._encoder.setPublicKey(await this.api.auth.publicKey())
  }
}
