import { Injectable } from "@nestjs/common";
import { User } from "../api/model/user.entity";

@Injectable()
export class GameStateService {
  readonly player: User = {
    id: 0,
    createAt: "",
    createBy: 0,
    deleteAt: "",
    updateAt: "",
    deleted: false,
    deleteBy: 0,
    displayName: "",
    name: "",
    builtin: false,
  };

  applyPlayer(user: User) {
    Object.assign(this.player, user);
  }
}
