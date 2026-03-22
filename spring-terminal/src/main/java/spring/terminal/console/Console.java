package spring.terminal.console;

import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Stream;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import spring.terminal.SpringContext;

@Service
public class Console {
  private final Scanner inputScanner = new Scanner(System.in);

  private @NonNull String _join(@NonNull Stream<Object> stream) {
    var strings = stream.map(Object::toString).toArray(String[]::new);
    return String.join(" ", strings);
  }

  public Console enter() {
    return this.write("\n");
  }

  public Console error(Object... arg) {
    System.err.print(_join(Arrays.stream(arg)));
    System.err.flush();
    return this;
  }

  public Console errorAndWait(Object arg) {
    return this.error(arg).waitEnter();
  }

  public ConsoleForm form() {
    return SpringContext.getBean(ConsoleForm.class);
  }

  public Boolean readBoolean(String prompt, Boolean defaultValue) {
    return readBoolean(prompt, defaultValue, "：");
  }

  public Boolean readBoolean(String prompt, Boolean defaultValue, String separate) {
    if (defaultValue == null) return readBoolean(prompt + separate);
    return readBoolean(prompt + "(" + (defaultValue ? "Y/n" : "y/N") + ")" + separate);
  }

  public Boolean readBoolean(String prompt) {
    var result = readLine(prompt);
    if (result.equalsIgnoreCase("y") || result.equalsIgnoreCase("yes")) return true;
    if (result.equalsIgnoreCase("n") || result.equalsIgnoreCase("no")) return true;
    return null;
  }

  public Double readDouble(String prompt, Double defaultValue) {
    return readDouble(prompt, defaultValue, "：");
  }

  public Double readDouble(String prompt, Double defaultValue, String separate) {
    if (defaultValue == null) return readDouble(prompt + separate);
    return readDouble(prompt + "(" + defaultValue + ")" + separate);
  }

  public Double readDouble(String prompt) {
    var result = readLine(prompt);
    try {
      return Double.valueOf(result);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  public Integer readInt(String prompt, Integer defaultValue) {
    return readInt(prompt, defaultValue, "：");
  }

  public Integer readInt(String prompt, Integer defaultValue, String separate) {
    if (defaultValue == null) return readInt(prompt + separate);
    return readInt(prompt + "(" + defaultValue + ")" + separate);
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

  public Console waitEnter() {
    System.out.print("🔻");
    System.out.flush();
    inputScanner.nextLine();
    return this;
  }

  public Console write(Object... args) {
    System.out.print(_join(Arrays.stream(args)));
    return this;
  }

  public Console write(@NonNull List<Object> args) {
    System.out.print(_join(args.stream()));
    return this;
  }
}
