import { Injectable } from "@nestjs/common";
import { LocalConfigService } from "./configs/local-config.service";
import { CommonService } from "./utils/common.service";
import { EncryptService } from "./utils/encrypt.service";

@Injectable()
export class SharedService {
  constructor(
    readonly encrypt: EncryptService,
    readonly config: LocalConfigService,
    readonly common: CommonService,
  ) {}
}
