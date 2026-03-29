package spring.terminal.console;

import org.jline.reader.LineReader;

class ConsoleBooleanReader implements ConsoleReader<Boolean> {

  private final LineReader reader;

  public ConsoleBooleanReader(LineReader reader) {
    this.reader = reader;
  }

  @Override
  public Boolean read(String prompt) {
    while (true) {
      var result = reader.readLine(prompt);
      if (result.equalsIgnoreCase("y") || result.equalsIgnoreCase("yes")) return true;
      if (result.equalsIgnoreCase("n") || result.equalsIgnoreCase("no")) return true;
    }
  }

  @Override
  public Boolean read(String prompt, Boolean defaultValue) {
    return read(prompt, defaultValue, "：");
  }

  @Override
  public Boolean read(String prompt, Boolean defaultValue, String separator) {
    if (defaultValue == null) return read(prompt + separator);
    var result = reader.readLine(prompt + "(" + (defaultValue ? "Y/n" : "y/N") + ")" + separator);
    if (result.equalsIgnoreCase("y") || result.equalsIgnoreCase("yes")) return true;
    if (result.equalsIgnoreCase("n") || result.equalsIgnoreCase("no")) return true;
    return defaultValue;
  }
}
