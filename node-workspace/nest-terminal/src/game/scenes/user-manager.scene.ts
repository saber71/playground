import { Injectable } from "@nestjs/common"
import { ApiService } from "../../api/api.service"
import { PageVo } from "../../api/model/page.vo"
import { UserSearchDto } from "../../api/model/user-search.dto"
import { User } from "../../api/model/user.entity"
import { UIService } from "../../ui/ui.service"
import { GameStateService } from "../game-state.service"
import { Scene } from "./decorators"
import { ForWhile, IRouter, IScene } from "./scene.interface"

@Injectable()
@Scene("user-manager")
export class UserManagerScene implements IScene {
  constructor(
    readonly ui: UIService,
    readonly api: ApiService,
    readonly state: GameStateService,
  ) {}

  enter(router: IRouter, forWhile: ForWhile): Promise<void> | void {
    const param: UserSearchDto = {
      page: 1,
      size: 10,
      name: "",
    }
    let tableData: PageVo<User>
    return forWhile(async (breakWhile, commonCatch) => {
      this.ui.message.clearScreen()
      tableData = await this.api.user.search(param)
      await this.ui.tableRender
        .renderObjectList(tableData.content, ["id", "name", "displayName"])
        .catch(commonCatch)
      this.ui.message.info(
        `[${param.page} / ${tableData.page.totalPages}]  ${param.size}/页  名字(${param.name})`,
      )
      await this.ui.prompt.menuList(this.state.menuPrompt(), [
        {
          name: "下一页",
          callback: () => {
            param.page++
          },
          isDisabled: () => param.page >= tableData.page.totalPages,
        },
        {
          name: "上一页",
          callback: () => {
            param.page--
          },
          isDisabled: () => param.page <= 1,
        },
        {
          name: "过滤【名字】",
          callback: async () => {
            param.name = await this.ui.prompt.input("名字")
          },
        },
        {
          name: "返回",
          callback: () => {
            breakWhile()
            router.back()
          },
        },
      ])
    })
  }
}
