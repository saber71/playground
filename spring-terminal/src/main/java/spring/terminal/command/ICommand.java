package spring.terminal.command;

import java.util.List;

public interface ICommand {
  void execute(List<String> args);
}
