package spring.terminal.console;

public interface ConsoleReader<T> {
  T read(String prompt);

  T read(String prompt, T defaultValue);

  T read(String prompt, T defaultValue, String separator);
}
