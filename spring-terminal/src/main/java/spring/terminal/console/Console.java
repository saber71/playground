package spring.terminal.console;

import java.io.IOException;
import org.jline.reader.LineReader;
import org.jline.reader.LineReaderBuilder;
import org.jline.reader.impl.DefaultParser;
import org.jline.terminal.TerminalBuilder;
import org.springframework.stereotype.Service;

@Service
public class Console {
  private final LineReader reader;

  public Console() {
    try {
      var terminal = TerminalBuilder.builder().system(true).build();
      reader = LineReaderBuilder.builder().terminal(terminal).parser(new DefaultParser()).build();
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public ConsoleReader<Boolean> booleanReader() {
    return new ConsoleBooleanReader(reader);
  }

  public ConsoleReader<Double> doubleReader() {
    return new ConsoleDoubleReader(reader);
  }

  public ConsoleWriter error() {
    return new ConsoleWriterImpl(System.err);
  }

  public ConsoleReader<Integer> integerReader() {
    return new ConsoleIntegerReader(reader);
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

  public ConsoleReader<String> stringReader() {
    return new ConsoleStringReader(reader);
  }

  public ConsoleWriter writer() {
    return new ConsoleWriterImpl(System.out);
  }
}
