import { Injectable } from "@nestjs/common";
import { terminal } from "terminal-kit";
import { MessageService } from "./message.service";

export interface TableOption {
  title?: string;
  hasHeader?: boolean;
  textAttr?: any;
  firstColumnTextAttr?: any;
}

@Injectable()
export class TableRenderService {
  private readonly term = terminal;

  constructor(readonly messageService: MessageService) {}

  renderKeyValue(data: Record<string, any>, title?: string) {
    const rows = Object.entries(data).map((e) => [e[0], String(e[1])]);
    this._renderTable([["属性", "值"], ...rows], {
      title,
      hasHeader: true,
      firstColumnTextAttr: { bold: true },
    });
  }

  renderObjectList<T extends Record<string, any>>(
    items: T[],
    columns?: Array<keyof T>,
    title?: string,
  ) {
    if (!items.length) {
      this.messageService.info("空");
      return;
    }
    const headers: any = columns ? columns : Object.keys(items[0]);
    const rows = items.map((i) => headers.map((k) => String(i[k])));
    this._renderTable([headers, ...rows], { title, hasHeader: true });
  }

  renderComparison(
    left: Record<string, any>,
    right: Record<string, any>,
    labels: [string, string],
    title?: string,
  ) {
    const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])];
    const rows = keys.map((k) => [
      k,
      String(left[k] ?? "-"),
      String(right[k] ?? "-"),
    ]);
    this._renderTable([["", labels[0], labels[1]], ...rows], {
      hasHeader: true,
      title,
      firstColumnTextAttr: { bold: true },
    });
  }

  private _renderTable(data: string[][], options: TableOption = {}) {
    const { title, hasHeader, textAttr = {}, firstColumnTextAttr } = options;

    const config: any = {
      width: this.messageService.getMaxWidth(),
      fit: true,
      textAttr,
      hasBorder: true,
      contentHasMarkup: true,
      borderAttr: { color: "cyan" },
      borderChars: "lightRounded",
      firstColumnTextAttr,
      // paddingLeft: 1,
      // paddingRight: 1,
    };
    if (hasHeader) {
      config.firstRowTextAttr = { bold: true };
    }

    if (firstColumnTextAttr && data.length) {
      if (!hasHeader) {
        data = data.map((row) =>
          row.map((cell, i) => (i === 0 ? `^B${cell}` : cell)),
        );
      } else {
        data = data.map((row, rowIndex) =>
          rowIndex ? row.map((cell, i) => (i === 0 ? `^B${cell}` : cell)) : row,
        );
      }
    }

    if (title) this.messageService.title(title);

    this.term.table(data, config);
  }
}
