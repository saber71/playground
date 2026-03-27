package spring.terminal.console;

import java.io.PrintStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import spring.terminal.websocket.TerminalWebSocketHandler;

@Slf4j
class ConsoleWriterImpl implements ConsoleWriter {

  private final PrintStream printStream;
  private final TerminalWebSocketHandler.SessionContext webSocketContext;

  public ConsoleWriterImpl(PrintStream printStream) {
    this.printStream = printStream;
    this.webSocketContext = null;
  }

  public ConsoleWriterImpl(TerminalWebSocketHandler.SessionContext webSocketContext) {
    this.printStream = null;
    this.webSocketContext = webSocketContext;
  }

  private void doWrite(String text) {
    if (webSocketContext != null) {
      webSocketContext.sendOutput(text);
    } else if (printStream != null) {
      printStream.print(text);
      printStream.flush();
    }
  }

  @Override
  public ConsoleWriter write(@NotNull Stream<Object> stream) {
    String text = String.join(" ", stream.map(Object::toString).toArray(String[]::new));
    doWrite(text);
    return this;
  }

  @Override
  public ConsoleWriter write(Object... args) {
    return write(Arrays.stream(args));
  }

  @Override
  public ConsoleWriter write(@NotNull List<Object> args) {
    return write(args.stream());
  }

  @Override
  public ConsoleWriter writeln(@NotNull Stream<Object> stream) {
    String text = String.join(" ", stream.map(Object::toString).toArray(String[]::new));
    doWrite(text + "\r\n");
    return this;
  }

  @Override
  public ConsoleWriter writeln(Object... args) {
    return writeln(Arrays.stream(args));
  }

  @Override
  public ConsoleWriter writeln(@NotNull List<Object> args) {
    return writeln(args.stream());
  }
}
