import { Injectable } from "@nestjs/common"
import { GameApiClient } from "../client/game-api.client"
import { CreateUserDto } from "../model/create-user.dto"
import { PageVo } from "../model/page.vo"
import { UserSearchDto } from "../model/user-search.dto"
import { User } from "../model/user.entity"

@Injectable()
export class UserService {
  constructor(readonly client: GameApiClient) {}

  info() {
    return this.client.get<User>("/user/info")
  }

  save(dto: CreateUserDto) {
    return this.client.post<User>("/user/save", dto)
  }

  search(param: UserSearchDto) {
    return this.client.get<PageVo<User>>("/user/search", param)
  }

  delete(ids: string) {
    return this.client.delete<string>("/user/ids", { ids })
  }
}
