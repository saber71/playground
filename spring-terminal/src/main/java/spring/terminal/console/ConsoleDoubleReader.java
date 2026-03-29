package spring.terminal.console;

import org.jline.reader.LineReader;

class ConsoleDoubleReader implements ConsoleReader<Double> {

  private final LineReader reader;

  public ConsoleDoubleReader(LineReader reader) {
    this.reader = reader;
  }

  @Override
  public Double read(String prompt) {
    while (true) {
      var result = reader.readLine(prompt);
      try {
        return Double.valueOf(result);
      } catch (RuntimeException _) {
      }
    }
  }

  @Override
  public Double read(String prompt, Double defaultValue) {
    return read(prompt, defaultValue, "：");
  }

  @Override
  public Double read(String prompt, Double defaultValue, String separator) {
    if (defaultValue == null) return read(prompt + separator);
    var result = reader.readLine(prompt + "(" + defaultValue + ")" + separator);
    try {
      return Double.valueOf(result);
    } catch (RuntimeException _) {
      return defaultValue;
    }
  }
}
