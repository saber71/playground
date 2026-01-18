import { Injectable } from "@nestjs/common";
import JSEncrypt from "jsencrypt";
import { ApiService } from "../../api/api.service";

@Injectable()
export class EncryptService {
  private readonly _encoder: JSEncrypt = new JSEncrypt();
  private _inited = false;

  constructor(readonly api: ApiService) {}

  async encrypt(str: string) {
    await this._init();
    return this._encoder.encrypt(str);
  }

  private async _init() {
    if (this._inited) return;
    this._inited = true;
    this._encoder.setPublicKey(await this.api.auth.publicKey());
  }
}
