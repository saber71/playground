import { Injectable } from "@nestjs/common";
import { ApiService } from "../api/api.service";
import { User } from "../api/model/user.entity";
import { SharedService } from "../shared/shared.service";
import { UIService } from "../ui/ui.service";
import { GameStateService } from "./game-state.service";
import { SceneManagerService } from "./scenes/scene-manager.service";
import { IRoute } from "./scenes/scene.interface";

@Injectable()
export class StartupController {
  constructor(
    readonly api: ApiService,
    readonly sceneManager: SceneManagerService,
    readonly shared: SharedService,
    readonly ui: UIService,
    readonly gameState: GameStateService,
  ) {}

  async start() {
    const initRoutes: IRoute[] = [{ name: "startup" }];
    await this.api.user
      .info()
      .then(async (user: User) => {
        this.gameState.applyPlayer(user);
      })
      .catch(
        this.shared.common.commonAxiosCatch(this.ui, {
          getRoute<T>(): IRoute<T> {
            return {} as any;
          },
          next() {
            initRoutes.push({ name: "login" });
          },
        } as any),
      );
    return this.sceneManager.run(...initRoutes);
    // this.table.renderKeyValue(
    //   {
    //     HP: '^Y90^A/200',
    //     MP: 30,
    //     等级: 30,
    //   },
    //   '角色状态',
    // );
    // this.table.renderObjectList([
    //   {
    //     HP: '^Y90^A/200',
    //     MP: 30,
    //     等级: 30,
    //   },
    //   {
    //     HP: '^R20^A/110',
    //     MP: 30,
    //     等级: 30,
    //   },
    //   {
    //     HP: '230^A/300',
    //     MP: 30,
    //     等级: 30,
    //   },
    // ]);
    // this.table.renderComparison(
    //   {
    //     HP: '^Y90^A/200',
    //     MP: 30,
    //     等级: 30,
    //   },
    //   {
    //     HP: '^R20^A/110',
    //     MP: 30,
    //     等级: 30,
    //   },
    //   ['Left', 'Right'],
    // );
  }
}
