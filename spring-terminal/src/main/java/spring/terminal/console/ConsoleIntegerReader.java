package spring.terminal.console;

import java.util.Scanner;

class ConsoleIntegerReader implements ConsoleReader<Integer> {
  @Override
  public Integer read(String prompt) {
    try (Scanner scanner = new Scanner(System.in)) {
      while (true) {
        System.out.print(prompt);
        var result = scanner.nextLine();
        try {
          return Integer.valueOf(result);
        } catch (RuntimeException _) {
        }
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
    try (Scanner scanner = new Scanner(System.in)) {
      System.out.print(prompt);
      var result = scanner.nextLine();
      try {
        return Integer.valueOf(result);
      } catch (RuntimeException _) {
        return defaultValue;
      }
    }
  }
}
