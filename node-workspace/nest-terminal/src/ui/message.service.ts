import { Injectable } from "@nestjs/common";
import { terminal } from "terminal-kit";

@Injectable()
export class MessageService {
  private readonly term = terminal;

  getMaxWidth() {
    return this.term.width;
  }

  info(text: string) {
    this.term.cyan(`ℹ️ ${text}\n`);
    return this;
  }

  infoAndWait(text: string) {
    this.term.cyan(`ℹ️ ${text}`);
    return this.waitContinue();
  }

  success(text: string) {
    this.term.green(`✅  ${text}\n`);
    return this;
  }

  successAndWait(text: string) {
    this.term.green(`✅  ${text}`);
    return this.waitContinue();
  }

  warn(text: string) {
    this.term.yellow(`⚠️ ${text}\n`);
    return this;
  }

  warnAndWait(text: string) {
    this.term.yellow(`⚠️ ${text}`);
    return this.waitContinue();
  }

  error(text: string) {
    this.term.red(`❌  ${text}\n`);
    return this;
  }

  errorAndWait(text: string) {
    this.term.red(`❌  ${text}`);
    return this.waitContinue();
  }

  system(text: string) {
    this.term.gray.italic(`🧿  ${text}\n`);
    return this;
  }

  systemAndWait(text: string) {
    this.term.gray.italic(`🧿  ${text}`);
    return this.waitContinue();
  }

  title(text: string) {
    const line = "=".repeat(this.getMaxWidth());
    this.term.bold.blue(`${line}\n${text.toUpperCase()}\n${line}\n`);
    return this;
  }

  divider(char = "-", length = this.getMaxWidth()) {
    this.term.gray(`${char.repeat(length)}\n`);
    return this;
  }

  clearScreen() {
    this.term.moveTo(1, 1).eraseDisplayBelow();
    return this;
  }

  async typewrite(
    text: string,
    delayPerChar = 60,
    maxWidth = this.getMaxWidth(),
  ) {
    this.term.wrapColumn({ width: maxWidth, x: 0 });
    for (let char of text) {
      this.term(char);
      await new Promise((resolve) => setTimeout(resolve, delayPerChar));
    }
    this.term.wrapColumn({ width: this.term.width, x: 0 });
    return this;
  }

  async narrative(text: string) {
    await this.typewrite(text);
    return this.waitContinue();
  }

  waitContinue(text = "🔻") {
    return new Promise<void>((resolve) => {
      this.term(text).grabInput({ mouse: false as any });
      this.term.once("key", () => {
        this.term.left(1);
        this.term.eraseDisplayBelow();
        this.term("\n");
        resolve();
      });
    });
  }
}
