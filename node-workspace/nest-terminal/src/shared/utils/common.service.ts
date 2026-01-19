import { Injectable } from "@nestjs/common"
import { AxiosError, AxiosResponse } from "axios"
import { BasePageSearchDto } from "../../api/model/base-page-search.dto"
import { PageVo } from "../../api/model/page.vo"
import type { IRouter } from "../../game/scenes/scene.interface"
import type { UIService } from "../../ui/ui.service"
import { MenuItem } from "../types/class.type"

@Injectable()
export class CommonService {
  commonCatch(ui: UIService, router: IRouter) {
    return async (error: any) => {
      if (error instanceof AxiosError) return this.commonAxiosCatch(ui, router)
      try {
        await ui.message.errorAndWait(
          typeof error === "object" && error ? JSON.stringify(error) : error,
        )
      } catch (e) {
        const res: AxiosResponse = error
        await ui.message.errorAndWait(
          typeof res.data === "object" && res.data ? JSON.stringify(res.data) : res.data,
        )
      }
    }
  }

  commonAxiosCatch(ui: UIService, router: IRouter) {
    return async (error: AxiosError<string>) => {
      if (error.status === 401) {
        if (router.getRoute().name !== "login") {
          await ui.message.warnAndWait("token已失效，请重新登录。")
          router.next("login")
        } else {
          await ui.message.errorAndWait(error.response?.data || "登录失败")
        }
      } else if (error.code === "ECONNREFUSED") {
        await ui.message.errorAndWait("无法连接到服务器")
      } else {
        await ui.message.errorAndWait("操作失败，请稍后重试。")
      }
    }
  }

  commonPageableMenuItem(ui: UIService, param: BasePageSearchDto, pageVO: PageVo<any>): MenuItem {
    return {
      name: "分页管理",
      callback: async () => {
        await ui.prompt.menuList("", [
          {
            name: "下一页",
            callback: () => {
              param.page++
            },
            isDisabled: () => param.page >= pageVO.page.totalPages,
          },
          {
            name: "上一页",
            callback: () => {
              param.page--
            },
            isDisabled: () => param.page <= 1,
          },
          {
            name: "设置页码",
            callback: async () => {
              param.page =
                (await ui.prompt.inputNumber("页码", { min: 1, max: pageVO.page.totalPages })) ?? 1
            },
            isDisabled: () => pageVO.page.totalPages <= 1,
          },
        ])
      },
      isDisabled: () => pageVO.page.totalPages <= 1 && param.page === 1,
    }
  }

  commonPageableInfo<T extends BasePageSearchDto>(
    param: T,
    pageVO: PageVo<any>,
    nameMap: Partial<Record<keyof T, string>>,
  ) {
    const keys = Object.keys(param).filter((key) => key in nameMap)
    const fields = keys.map((key) => `${nameMap[key]}[${param[key]}]`)
    return `[${param.page} / ${pageVO.page.totalPages}]  ${param.size}/页  ${fields.join(" ")}`
  }

  commonAfterDelete(param: BasePageSearchDto, pageVO: PageVo<any>) {
    if (pageVO.content.length === 1 && param.page > 1) param.page--
  }

  isEmpty(arg: any) {
    return arg === null || arg === undefined || arg === ""
  }
}
