package spring.terminal.console;

import java.util.ArrayList;
import java.util.List;
import org.jetbrains.annotations.NotNull;

/** ANSI 样式封装类，支持链式调用设置各种终端样式 */
public class AnsiStyle {

  private final List<String> codes = new ArrayList<>();
  private String text;

  public AnsiStyle() {}

  public AnsiStyle(String text) {
    this.text = text;
  }

  /** 应用样式到指定文本（静态方法，快速使用） */
  public static String apply(String text, @NotNull StyleBuilder builder) {
    AnsiStyle ansiStyle = new AnsiStyle(text);
    builder.build(ansiStyle);
    return ansiStyle.toString();
  }

  /** 设置背景色（标准颜色） */
  public AnsiStyle bgColor(@NotNull Color color) {
    codes.add(color.backgroundCode);
    return this;
  }

  /** 设置背景色（RGB） */
  public AnsiStyle bgColor(int r, int g, int b) {
    codes.add("48;2;" + r + ";" + g + ";" + b);
    return this;
  }

  /** 闪烁 */
  public AnsiStyle blink() {
    codes.add("5");
    return this;
  }

  /** 粗体 */
  public AnsiStyle bold() {
    codes.add("1");
    return this;
  }

  /** 高亮背景色 */
  public AnsiStyle brightBgColor(@NotNull Color color) {
    codes.add(color.brightBackgroundCode);
    return this;
  }

  /** 高亮前景色 */
  public AnsiStyle brightColor(@NotNull Color color) {
    codes.add(color.brightForegroundCode);
    return this;
  }

  /** 设置前景色（标准颜色） */
  public AnsiStyle color(@NotNull Color color) {
    codes.add(color.foregroundCode);
    return this;
  }

  /** 设置前景色（RGB） */
  public AnsiStyle color(int r, int g, int b) {
    codes.add("38;2;" + r + ";" + g + ";" + b);
    return this;
  }

  /** 隐藏（适合打印密码） */
  public AnsiStyle hidden() {
    codes.add("8");
    return this;
  }

  /** 斜体 */
  public AnsiStyle italic() {
    codes.add("3");
    return this;
  }

  /** 细体/正常强度 */
  public AnsiStyle normal() {
    codes.add("2");
    return this;
  }

  /** 快速闪烁 */
  public AnsiStyle rapidBlink() {
    codes.add("6");
    return this;
  }

  /** 重置所有样式 */
  public AnsiStyle reset() {
    codes.add("0");
    return this;
  }

  /** 反色（前景色和背景色交换） */
  public AnsiStyle reverse() {
    codes.add("7");
    return this;
  }

  /** 删除线 */
  public AnsiStyle strike() {
    codes.add("9");
    return this;
  }

  /** 设置要格式化的文本 */
  public AnsiStyle text(String text) {
    this.text = text;
    return this;
  }

  /** 获取不带重置码的 ANSI 字符串（用于连续样式） */
  public String toAnsiCodes() {
    if (codes.isEmpty()) {
      return "";
    }

    return "\u001B[" + String.join(";", codes) + "m";
  }

  /** 生成 ANSI 转义字符串 */
  @Override
  public String toString() {
    if (text == null || text.isEmpty()) {
      return "";
    }

    if (codes.isEmpty()) {
      return text;
    }

    return "\u001B[" + String.join(";", codes) + "m" + text + "\u001B[0m";
  }

  /** 下划线 */
  public AnsiStyle underline() {
    codes.add("4");
    return this;
  }

  /** 标准颜色枚举 */
  public enum Color {
    BLACK("30", "40", "90", "100"),
    RED("31", "41", "91", "101"),
    GREEN("32", "42", "92", "102"),
    YELLOW("33", "43", "93", "103"),
    BLUE("34", "44", "94", "104"),
    MAGENTA("35", "45", "95", "105"),
    CYAN("36", "46", "96", "106"),
    WHITE("37", "47", "97", "107");

    private final String backgroundCode;
    private final String brightBackgroundCode;
    private final String brightForegroundCode;
    private final String foregroundCode;

    Color(
        String foregroundCode,
        String backgroundCode,
        String brightForegroundCode,
        String brightBackgroundCode) {
      this.foregroundCode = foregroundCode;
      this.backgroundCode = backgroundCode;
      this.brightForegroundCode = brightForegroundCode;
      this.brightBackgroundCode = brightBackgroundCode;
    }
  }

  /** 函数式接口，用于构建样式 */
  @FunctionalInterface
  public interface StyleBuilder {
    void build(AnsiStyle style);
  }
}
