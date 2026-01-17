import { Injectable } from "@nestjs/common";
import { GameApiClient } from "../client/game-api.client";
import { User } from "../model/user.entity";

@Injectable()
export class UserService {
  constructor(readonly client: GameApiClient) {}

  info() {
    return this.client.get<User>("/user/info");
  }
}
