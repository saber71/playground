import { Injectable } from "@nestjs/common";
import type { AxiosError } from "axios";
import type { IRouter } from "../../game/scenes/scene.interface";
import type { UIService } from "../../ui/ui.service";

@Injectable()
export class CommonService {
  commonAxiosCatch(ui: UIService, router: IRouter) {
    return async (error: AxiosError<string>) => {
      if (error.status === 401) {
        if (router.getRoute().name !== "login") {
          await ui.message.warnAndWait("token已失效，请重新登录。");
          router.next("login");
        } else {
          await ui.message.errorAndWait(error.response?.data || "登录失败");
        }
      } else if (error.code === "ECONNREFUSED") {
        await ui.message.errorAndWait("无法连接到服务器");
      } else {
        await ui.message.errorAndWait("操作失败，请稍后重试。");
      }
    };
  }
}
