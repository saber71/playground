package spring.terminal.console;

import java.util.Scanner;

class ConsoleBooleanReader implements ConsoleReader<Boolean> {
  @Override
  public Boolean read(String prompt) {
    try (Scanner scanner = new Scanner(System.in)) {
      while (true) {
        System.out.print(prompt);
        var result = scanner.nextLine();
        if (result.equalsIgnoreCase("y") || result.equalsIgnoreCase("yes")) return true;
        if (result.equalsIgnoreCase("n") || result.equalsIgnoreCase("no")) return true;
      }
    }
  }

  @Override
  public Boolean read(String prompt, Boolean defaultValue) {
    return read(prompt, defaultValue, "：");
  }

  @Override
  public Boolean read(String prompt, Boolean defaultValue, String separator) {
    if (defaultValue == null) return read(prompt + separator);
    try (Scanner scanner = new Scanner(System.in)) {
      System.out.print(prompt + "(" + (defaultValue ? "Y/n" : "y/N") + ")" + separator);
      var result = scanner.nextLine();
      if (result.equalsIgnoreCase("y") || result.equalsIgnoreCase("yes")) return true;
      if (result.equalsIgnoreCase("n") || result.equalsIgnoreCase("no")) return true;
      return defaultValue;
    }
  }
}
