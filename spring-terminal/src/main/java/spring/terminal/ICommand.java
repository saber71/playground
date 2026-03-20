package spring.terminal;

import java.util.List;

public interface ICommand {
  void execute(List<String> args);
}
