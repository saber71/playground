import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import path from "node:path";

export interface IConfig {
  baseBackendUrl: string;
}

const tokenPath = path.resolve(".", "token");

@Injectable()
export class LocalConfigService {
  private readonly _config: IConfig;
  private _token: string = "";

  constructor() {
    const configContent = fs.readFileSync(
      path.resolve(".", "config.json"),
      "utf-8",
    );
    this._config = JSON.parse(configContent);
    if (fs.existsSync(tokenPath))
      this._token = fs.readFileSync(tokenPath, "utf-8");
  }

  getToken() {
    return this._token;
  }

  setToken(token: string) {
    if (token !== this._token) {
      this._token = token;
      fs.writeFileSync(tokenPath, token);
    }
  }

  getBaseBackendUrl() {
    return this._config["baseBackendUrl"];
  }
}
