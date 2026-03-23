package spring.terminal.console;

import org.springframework.stereotype.Service;
import spring.terminal.SpringContext;

@Service
public class Console {
  public ConsoleReader<Boolean> booleanReader() {
    return new ConsoleBooleanReader();
  }

  public ConsoleReader<Double> doubleReader() {
    return new ConsoleDoubleReader();
  }

  public ConsoleWriter error() {
    return new ConsoleWriterImpl(System.err);
  }

  public ConsoleForm form() {
    return SpringContext.getBean(ConsoleForm.class);
  }

  public ConsoleReader<Integer> integerReader() {
    return new ConsoleIntegerReader();
  }

  public ConsoleReader<String> stringReader() {
    return new ConsoleStringReader();
  }

  public ConsoleWriter writer() {
    return new ConsoleWriterImpl(System.out);
  }
}
