import { Injectable } from '@nestjs/common';
import { MessageService } from './message.service';
import { PromptService } from './prompt.service';
import { TableRenderService } from './table-render.service';

@Injectable()
export class UIService {
  constructor(
    readonly message: MessageService,
    readonly prompt: PromptService,
    readonly tableRender: TableRenderService,
  ) {}
}
