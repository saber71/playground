import { Injectable } from "@nestjs/common";
import { ApiService } from "../../api/api.service";
import { LoginDto } from "../../api/model/login.dto";
import { SharedService } from "../../shared/shared.service";
import { UIService } from "../../ui/ui.service";
import { Scene } from "./decorators";
import { ForWhile, IRouter, IScene } from "./scene.interface";

@Injectable()
@Scene("login")
export class LoginScene implements IScene {
  constructor(
    readonly api: ApiService,
    readonly shared: SharedService,
    readonly ui: UIService,
  ) {}

  async enter(router: IRouter, forWhile: ForWhile): Promise<void> {
    this.ui.message.clearScreen().title("登录");
    return forWhile(async (breakWhile, commonCatch) => {
      const dto = await this.ui.prompt.form<LoginDto>([
        { prompt: "请输入用户名", prop: "name", item: { type: "input" } },
        {
          prompt: "请输入密码",
          prop: "password",
          item: { type: "inputPassword", required: false },
        },
      ]);
      const encrypted = await this.shared.encrypt.encrypt(dto.password);
      if (!encrypted) {
        await this.ui.message.errorAndWait("密码加密失败");
        return;
      }
      dto.password = encrypted;
      await this.api.auth
        .login(dto)
        .then(async (token) => {
          this.shared.config.setToken(token);
          await this.ui.message.success("登录成功").waitContinue();
          router.back();
          breakWhile();
        })
        .catch(commonCatch);
    });
  }
}
