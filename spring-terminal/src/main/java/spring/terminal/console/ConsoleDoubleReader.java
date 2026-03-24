package spring.terminal.console;

import java.util.Scanner;

class ConsoleDoubleReader implements ConsoleReader<Double> {
  @Override
  public Double read(String prompt) {
    Scanner scanner = new Scanner(System.in);
    while (true) {
      System.out.print(prompt);
      var result = scanner.nextLine();
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
    Scanner scanner = new Scanner(System.in);
    System.out.print(prompt);
    var result = scanner.nextLine();
    try {
      return Double.valueOf(result);
    } catch (RuntimeException _) {
      return defaultValue;
    }
  }
}
