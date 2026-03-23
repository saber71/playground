package spring.terminal.console;

import java.util.Scanner;

class ConsoleStringReader implements ConsoleReader<String> {
  @Override
  public String read(String prompt) {
    try (Scanner scanner = new Scanner(System.in)) {
      while (true) {
        System.out.print(prompt);
        var result = scanner.nextLine();
        if (result.isEmpty()) continue;
        return result;
      }
    }
  }

  @Override
  public String read(String prompt, String defaultValue) {
    return read(prompt, defaultValue, "：");
  }

  @Override
  public String read(String prompt, String defaultValue, String separator) {
    if (defaultValue == null) return read(prompt + separator);
    if (defaultValue.length() >= 7) defaultValue = defaultValue.substring(0, 7) + "…";
    try (Scanner scanner = new Scanner(System.in)) {
      System.out.print(prompt + "(" + defaultValue + ")" + separator);
      var input = scanner.nextLine();
      if (input.isEmpty()) return defaultValue;
      return input;
    }
  }
}
