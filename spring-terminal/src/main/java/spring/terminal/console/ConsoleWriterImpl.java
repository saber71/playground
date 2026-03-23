package spring.terminal.console;

import java.io.PrintStream;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Stream;
import org.jetbrains.annotations.NotNull;

class ConsoleWriterImpl implements ConsoleWriter {
  private final PrintStream printStream;

  public ConsoleWriterImpl(PrintStream printStream) {
    this.printStream = printStream;
  }

  @Override
  public ConsoleWriter waitEnter() {
    printStream.print("🔻");
    printStream.flush();
    try (Scanner scanner = new Scanner(System.in)) {
      scanner.nextLine();
    }
    return this;
  }

  @Override
  public ConsoleWriter write(@NotNull List<Object> args) {
    return write(args.stream());
  }

  @Override
  public ConsoleWriter write(@NotNull Stream<Object> stream) {
    printStream.print(String.join(" ", stream.map(Object::toString).toArray(String[]::new)));
    printStream.flush();
    return this;
  }

  @Override
  public ConsoleWriter write(Object... args) {
    return write(Arrays.stream(args));
  }

  @Override
  public ConsoleWriter writeln(@NotNull List<Object> args) {
    return writeln(args.stream());
  }

  @Override
  public ConsoleWriter writeln(@NotNull Stream<Object> stream) {
    printStream.println(String.join(" ", stream.map(Object::toString).toArray(String[]::new)));
    printStream.flush();
    return this;
  }

  @Override
  public ConsoleWriter writeln(Object... args) {
    return writeln(Arrays.stream(args));
  }
}
