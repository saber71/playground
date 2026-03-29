package spring.terminal.console;

import java.io.PrintStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;

@Slf4j
class ConsoleWriterImpl implements ConsoleWriter {

  private final PrintStream printStream;

  public ConsoleWriterImpl(PrintStream printStream) {
    this.printStream = printStream;
  }

  private void doWrite(String text) {
    printStream.print(text);
    printStream.flush();
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
    doWrite(text + "\n\r");
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
