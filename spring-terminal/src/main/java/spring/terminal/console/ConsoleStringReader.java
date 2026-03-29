package spring.terminal.console;

import org.jline.reader.LineReader;

public class ConsoleStringReader implements ConsoleReader<String> {

  private final LineReader reader;

  public ConsoleStringReader(LineReader reader) {
    this.reader = reader;
  }

  @Override
  public String read(String prompt) {
    while (true) {
      String result = reader.readLine(prompt);
      if (!result.isEmpty()) {
        return result;
      }
    }
  }

  @Override
  public String read(String prompt, String defaultValue) {
    return read(prompt, defaultValue, ": ");
  }

  @Override
  public String read(String prompt, String defaultValue, String separator) {
    if (defaultValue == null) {
      return read(prompt + separator);
    }

    String displayDefault =
        defaultValue.length() >= 7 ? defaultValue.substring(0, 7) + "…" : defaultValue;

    String fullPrompt = prompt + "(" + displayDefault + ")" + separator;
    String input = reader.readLine(fullPrompt);
    return (input == null || input.isEmpty()) ? defaultValue : input;
  }
}
