package spring.terminal;

import java.util.Arrays;
import java.util.Scanner;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

@Service
public class Console {
  private final Scanner inputScanner = new Scanner(System.in);

  public Console errorAndWait(Object arg) {
    System.err.print(arg);
    return this.waitInput();
  }

  public Boolean readBoolean(String prompt) {
    var result = readLine(prompt);
    if (result.equalsIgnoreCase("y") || result.equalsIgnoreCase("yes")) return true;
    if (result.equalsIgnoreCase("n") || result.equalsIgnoreCase("no")) return true;
    return null;
  }

  public Integer readInt(String prompt) {
    var result = readLine(prompt);
    try {
      return Integer.valueOf(result);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  public String readLine(@NonNull String prompt) {
    if (!prompt.isEmpty()) System.out.print(prompt);
    return inputScanner.nextLine();
  }

  public String readLine(String prompt, String defaultValue, String separate) {
    if (defaultValue == null || defaultValue.isEmpty()) return readLine(prompt + separate);
    return readLine(
        prompt
            + "("
            + defaultValue.substring(0, Math.min(7, defaultValue.length()))
            + ")"
            + separate);
  }

  public String readLine(String prompt, String defaultValue) {
    return readLine(prompt, defaultValue, "：");
  }

  private Console waitInput() {
    System.out.print("🔻");
    inputScanner.nextLine();
    return this;
  }

  public Console write(Object... args) {
    var strings = Arrays.stream(args).map(Object::toString).toArray(String[]::new);
    System.out.print(String.join(" ", strings));
    return this;
  }

  public Console writeAndWait(Object... args) {
    return this.write(args).waitInput();
  }

  public Console writeln(Object... args) {
    var strings = Arrays.stream(args).map(Object::toString).toArray(String[]::new);
    System.out.println(String.join(" ", strings));
    return this;
  }
}
