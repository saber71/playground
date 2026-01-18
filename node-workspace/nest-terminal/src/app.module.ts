import { Module } from "@nestjs/common"
import { ApiService } from "./api/api.service"
import { GameApiClient } from "./api/client/game-api.client"
import { AuthService } from "./api/services/auth.service"
import { UserService } from "./api/services/user.service"
import { AppService } from "./app.service"
import { GameStateService } from "./game/game-state.service"
import { LoginScene } from "./game/scenes/login.scene"
import { SceneManagerService } from "./game/scenes/scene-manager.service"
import { StartupScene } from "./game/scenes/startup.scene"
import { UserManagerScene } from "./game/scenes/user-manager.scene"
import { StartupController } from "./game/startup.controller"
import { LocalConfigService } from "./shared/configs/local-config.service"
import { SharedService } from "./shared/shared.service"
import { CommonService } from "./shared/utils/common.service"
import { EncryptService } from "./shared/utils/encrypt.service"
import { MessageService } from "./ui/message.service"
import { PromptService } from "./ui/prompt.service"
import { TableRenderService } from "./ui/table-render.service"
import { UIService } from "./ui/ui.service"

@Module({
  providers: [
    AppService,
    // shared
    LocalConfigService,
    EncryptService,
    CommonService,
    SharedService,
    // api
    GameApiClient,
    AuthService,
    UserService,
    ApiService,
    // ui
    MessageService,
    TableRenderService,
    PromptService,
    UIService,
    // game
    StartupController,
    GameStateService,
    SceneManagerService,
    // game/scenes
    LoginScene,
    StartupScene,
    UserManagerScene,
  ],
})
export class AppModule {}
