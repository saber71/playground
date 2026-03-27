package spring.terminal.console;

import spring.terminal.websocket.TerminalWebSocketHandler;

import java.util.Scanner;

public class ConsoleStringReader implements ConsoleReader<String> {

  private final TerminalWebSocketHandler.SessionContext webSocketContext;

  public ConsoleStringReader() {
    this.webSocketContext = null;
  }

  public ConsoleStringReader(TerminalWebSocketHandler.SessionContext webSocketContext) {
    this.webSocketContext = webSocketContext;
  }

  @Override
  public String read(String prompt) {
    if (webSocketContext != null) {
      webSocketContext.sendOutput(prompt);
      return webSocketContext.readLine();
    }

    while (true) {
      System.out.print(prompt);
      System.out.flush();
      try (Scanner scanner = new Scanner(System.in)) {
        String result = scanner.nextLine();
        if (!result.isEmpty()) {
          return result;
        }
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

    if (webSocketContext != null) {
      webSocketContext.sendOutput(fullPrompt);
      String input = webSocketContext.readLine();
      return (input == null || input.isEmpty()) ? defaultValue : input;
    }

    System.out.print(fullPrompt);
    System.out.flush();
    try (Scanner scanner = new Scanner(System.in)) {
      String input = scanner.nextLine();
      return (input == null || input.isEmpty()) ? defaultValue : input;
    }
  }
}
