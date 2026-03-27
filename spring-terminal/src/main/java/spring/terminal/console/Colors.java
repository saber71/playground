package spring.terminal.console;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

/** ANSI 样式工具类，提供快捷的样式生成方法 */
public class Colors {

  /** 蓝色背景 */
  public static String bgBlue(String text) {
    return new AnsiStyle(text).bgColor(AnsiStyle.Color.BLUE).toString();
  }

  /** 绿色背景 */
  public static String bgGreen(String text) {
    return new AnsiStyle(text).bgColor(AnsiStyle.Color.GREEN).toString();
  }

  /** 红色背景 */
  public static String bgRed(String text) {
    return new AnsiStyle(text).bgColor(AnsiStyle.Color.RED).toString();
  }

  /** 自定义背景色 */
  public static String bgRgb(int r, int g, int b, String text) {
    return new AnsiStyle(text).bgColor(r, g, b).toString();
  }

  /** 黄色背景 */
  public static String bgYellow(String text) {
    return new AnsiStyle(text).bgColor(AnsiStyle.Color.YELLOW).toString();
  }

  /** 黑色文本 */
  public static String black(String text) {
    return new AnsiStyle(text).color(AnsiStyle.Color.BLACK).toString();
  }

  /** 闪烁 */
  public static String blink(String text) {
    return new AnsiStyle(text).blink().toString();
  }

  /** 蓝色文本 */
  public static String blue(String text) {
    return new AnsiStyle(text).color(AnsiStyle.Color.BLUE).toString();
  }

  /** 粗体 */
  public static String bold(String text) {
    return new AnsiStyle(text).bold().toString();
  }

  /** 青色文本 */
  public static String cyan(String text) {
    return new AnsiStyle(text).color(AnsiStyle.Color.CYAN).toString();
  }

  /** 绿色文本 */
  public static String green(String text) {
    return new AnsiStyle(text).color(AnsiStyle.Color.GREEN).toString();
  }

  /** 隐藏 */
  public static String hidden(String text) {
    return new AnsiStyle(text).hidden().toString();
  }

  /** 斜体 */
  public static String italic(String text) {
    return new AnsiStyle(text).italic().toString();
  }

  /** 紫色文本 */
  public static String magenta(String text) {
    return new AnsiStyle(text).color(AnsiStyle.Color.MAGENTA).toString();
  }

  /** 红色文本 */
  public static String red(String text) {
    return new AnsiStyle(text).color(AnsiStyle.Color.RED).toString();
  }

  /** 反色 */
  public static String reverse(String text) {
    return new AnsiStyle(text).reverse().toString();
  }

  /** 自定义颜色 */
  public static String rgb(int r, int g, int b, String text) {
    return new AnsiStyle(text).color(r, g, b).toString();
  }

  /** 删除线 */
  public static String strike(String text) {
    return new AnsiStyle(text).strike().toString();
  }

  /** 组合样式构建器 */
  @Contract("_ -> new")
  public static @NotNull AnsiStyle style(String text) {
    return new AnsiStyle(text);
  }

  /** 下划线 */
  public static String underline(String text) {
    return new AnsiStyle(text).underline().toString();
  }

  /** 白色文本 */
  public static String white(String text) {
    return new AnsiStyle(text).color(AnsiStyle.Color.WHITE).toString();
  }

  /** 黄色文本 */
  public static String yellow(String text) {
    return new AnsiStyle(text).color(AnsiStyle.Color.YELLOW).toString();
  }
}
