package spring.terminal.console;

import org.jline.reader.LineReader;

class ConsoleIntegerReader implements ConsoleReader<Integer> {

  private final LineReader reader;

  public ConsoleIntegerReader(LineReader reader) {
    this.reader = reader;
  }

  @Override
  public Integer read(String prompt) {
    while (true) {
      var result = reader.readLine(prompt);
      try {
        return Integer.valueOf(result);
      } catch (RuntimeException _) {
      }
    }
  }

  @Override
  public Integer read(String prompt, Integer defaultValue) {
    return read(prompt, defaultValue, "：");
  }

  @Override
  public Integer read(String prompt, Integer defaultValue, String separator) {
    if (defaultValue == null) return read(prompt + separator);
    var result = reader.readLine(prompt + "(" + defaultValue + ")" + separator);
    try {
      return Integer.valueOf(result);
    } catch (RuntimeException _) {
      return defaultValue;
    }
  }
}
