package spring.terminal.console;

import java.util.List;
import java.util.stream.Stream;

public interface ConsoleWriter {
  ConsoleWriter write(List<Object> args);

  ConsoleWriter write(Stream<Object> stream);

  ConsoleWriter write(Object... args);

  ConsoleWriter writeln(List<Object> args);

  ConsoleWriter writeln(Stream<Object> stream);

  ConsoleWriter writeln(Object... args);
}
