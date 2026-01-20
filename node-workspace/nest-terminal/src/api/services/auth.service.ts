import { Injectable } from "@nestjs/common"
import { GameApiClient } from "../client/game-api.client"
import { LoginDto } from "../model/login.dto"

@Injectable()
export class AuthService {
  constructor(readonly client: GameApiClient) {}

  login(dto: LoginDto) {
    return this.client.post<string>("/auth/login", dto)
  }

  logout() {
    return this.client.post<boolean>("/auth/logout")
  }

  publicKey() {
    return this.client.get<string>("/auth/public-key")
  }
}
