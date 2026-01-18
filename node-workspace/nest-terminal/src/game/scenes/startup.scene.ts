import { Injectable } from "@nestjs/common";
import { ApiService } from "../../api/api.service";
import { SharedService } from "../../shared/shared.service";
import { UIService } from "../../ui/ui.service";
import { Scene } from "./decorators";
import { ForWhile, IRouter, IScene } from "./scene.interface";

@Injectable()
@Scene("startup")
export class StartupScene implements IScene {
  constructor(
    readonly api: ApiService,
    readonly ui: UIService,
    readonly shared: SharedService,
  ) {}

  enter(router: IRouter, forWhile: ForWhile): Promise<void> | void {
    // this.ui.message.clearScreen();
    return this.ui.prompt.menuList("你想要做什么？", [
      { name: "新建用户", callback: () => {} },
      {
        name: "注销登录",
        callback: async () => {
          await this.api.auth.logout();
          await this.ui.message.successAndWait("注销成功");
          this.shared.config.setToken("");
          router.next("login");
        },
      },
    ]);
  }
}
