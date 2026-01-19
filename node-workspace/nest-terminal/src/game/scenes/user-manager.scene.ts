import { Injectable } from "@nestjs/common"
import { ApiService } from "../../api/api.service"
import { CreateUserDto } from "../../api/model/create-user.dto"
import { PageVo } from "../../api/model/page.vo"
import { UserSearchDto } from "../../api/model/user-search.dto"
import { User } from "../../api/model/user.entity"
import { SharedService } from "../../shared/shared.service"
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
    readonly shared: SharedService,
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
        this.shared.common.commonPageableInfo(param, tableData, { name: "名字" }),
      )
      await this.ui.prompt.menuList(this.state.menuPrompt(), [
        this.shared.common.commonPageableMenuItem(this.ui, param, tableData),
        {
          name: "过滤",
          callback: async () => {
            await this.ui.prompt.menuList("", [
              {
                name: `过滤【名字】`,
                callback: async () => {
                  param.name = await this.ui.prompt.input("名字")
                },
              },
              {
                name: "重置",
                callback() {
                  param.name = ""
                },
              },
            ])
          },
        },
        {
          name: "新增用户",
          callback: async () => {
            const dto: CreateUserDto & { passwordRepeat: string } = await this.ui.prompt.form([
              {
                prop: "name",
                prompt: "账号名",
                item: {
                  type: "input",
                  required: true,
                  validate: async (value: string) => {
                    if (!value) return false
                    const exist = await this.api.user.existName(value).catch(commonCatch)
                    if (exist) return "账号名不唯一"
                    return true
                  },
                },
              },
              {
                prop: "displayName",
                prompt: "显示名",
                item: { type: "input", required: true },
              },
              {
                prop: "password",
                prompt: "密码",
                item: { type: "inputPassword", required: false },
              },
              {
                prop: "passwordRepeat",
                prompt: "确认密码",
                item: {
                  type: "inputPassword",
                  validate: (value, form) => {
                    if (!form.password) return true
                    if (form.password !== value) return "密码不一致"
                    return true
                  },
                },
              },
            ])
            if (dto.password) dto.password = await this.shared.encrypt.encrypt(dto.password)
            await this.api.user
              .save(dto)
              .catch(commonCatch)
              .then(() => this.ui.message.successAndWait("创建成功"))
          },
        },
        {
          name: "删除用户",
          callback: async () => {
            const id = await this.ui.prompt.select(
              "选择删除的用户",
              tableData.content.map((i) => ({ name: i.displayName, value: i.id })),
            )
            await this.api.user
              .delete(id + "")
              .then(() => this.ui.message.successAndWait("删除成功"))
              .catch(commonCatch)
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
