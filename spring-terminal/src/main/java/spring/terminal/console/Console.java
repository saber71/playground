package spring.terminal.console;

import org.springframework.stereotype.Service;
import spring.terminal.SpringContext;
import spring.terminal.websocket.TerminalWebSocketHandler;

@Service
public class Console {

  private static final ThreadLocal<TerminalWebSocketHandler.SessionContext> WEBSOCKET_CONTEXT =
      new ThreadLocal<>();

  public ConsoleReader<Boolean> booleanReader() {
    TerminalWebSocketHandler.SessionContext context = WEBSOCKET_CONTEXT.get();
    return context != null ? new ConsoleBooleanReader(context) : new ConsoleBooleanReader();
  }

  /** 清屏（仅在本地模式有效） */
  public void clearScreen() {
    if (!isWebSocketMode()) {
      System.out.print("\033[H\033[2J");
      System.out.flush();
    }
  }

  /** 清除当前线程的 WebSocket 上下文 */
  public void clearWebSocketContext() {
    WEBSOCKET_CONTEXT.remove();
  }

  public ConsoleReader<Double> doubleReader() {
    TerminalWebSocketHandler.SessionContext context = WEBSOCKET_CONTEXT.get();
    return context != null ? new ConsoleDoubleReader(context) : new ConsoleDoubleReader();
  }

  public ConsoleWriter error() {
    TerminalWebSocketHandler.SessionContext context = WEBSOCKET_CONTEXT.get();
    return context != null ? new ConsoleWriterImpl(context) : new ConsoleWriterImpl(System.err);
  }

  public ConsoleForm form() {
    return SpringContext.getBean(ConsoleForm.class);
  }

  /** 获取终端高度 */
  public int getHeight() {
    TerminalWebSocketHandler.SessionContext context = WEBSOCKET_CONTEXT.get();
    if (context != null) {
      return context.getRows();
    }
    return 24;
  }

  /** 获取终端宽度 */
  public int getWidth() {
    TerminalWebSocketHandler.SessionContext context = WEBSOCKET_CONTEXT.get();
    if (context != null) {
      return context.getCols();
    }
    return 80;
  }

  public ConsoleReader<Integer> integerReader() {
    TerminalWebSocketHandler.SessionContext context = WEBSOCKET_CONTEXT.get();
    return context != null ? new ConsoleIntegerReader(context) : new ConsoleIntegerReader();
  }

  /** 检查当前是否在 WebSocket 环境中 */
  public boolean isWebSocketMode() {
    return WEBSOCKET_CONTEXT.get() != null;
  }

  /** 输出错误信息 */
  public void printError(String text) {
    error().writeln(Colors.red(text));
  }

  /** 输出彩色信息 */
  public void printInfo(String text) {
    writer().writeln(Colors.blue(text));
  }

  /** 输出成功信息 */
  public void printSuccess(String text) {
    writer().writeln(Colors.green(text));
  }

  /** 输出警告信息 */
  public void printWarning(String text) {
    writer().writeln(Colors.yellow(text));
  }

  /** 设置当前线程的 WebSocket 上下文 */
  public void setWebSocketContext(TerminalWebSocketHandler.SessionContext context) {
    if (context == null) {
      WEBSOCKET_CONTEXT.remove();
    } else {
      WEBSOCKET_CONTEXT.set(context);
    }
  }

  public ConsoleReader<String> stringReader() {
    TerminalWebSocketHandler.SessionContext context = WEBSOCKET_CONTEXT.get();
    return context != null ? new ConsoleStringReader(context) : new ConsoleStringReader();
  }

  public ConsoleWriter writer() {
    TerminalWebSocketHandler.SessionContext context = WEBSOCKET_CONTEXT.get();
    return context != null ? new ConsoleWriterImpl(context) : new ConsoleWriterImpl(System.out);
  }
}
