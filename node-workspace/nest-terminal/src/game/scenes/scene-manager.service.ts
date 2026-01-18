import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { SharedService } from "../../shared/shared.service";
import { UIService } from "../../ui/ui.service";
import { SceneManagerAbstract } from "./scene-manager.abstract";

@Injectable()
export class SceneManagerService extends SceneManagerAbstract {
  constructor(
    readonly module: ModuleRef,
    readonly ui: UIService,
    readonly shared: SharedService,
  ) {
    super(module, ui, shared);
  }
}
