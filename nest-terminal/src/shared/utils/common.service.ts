import { Injectable } from "@nestjs/common";
import type { AxiosError } from "axios";
import type { IRouter } from "../../game/scenes/scene.interface";
import type { UIService } from "../../ui/ui.service";

@Injectable()
export class CommonService {
  commonCatch(ui: UIService, router: IRouter) {
    return async (error: AxiosError) => {
      if (error.status === 401) {
        await ui.message.warnAndWait("token已失效，请重新登录。");
        router.forward("login");
      } else if (error.code === "ECONNREFUSED") {
        await ui.message.errorAndWait("无法连接到服务器");
      } else {
        await ui.message.errorAndWait("操作失败，请稍后重试。");
      }
    };
  }
}
