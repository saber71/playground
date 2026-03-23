package spring.terminal;

import java.util.List;
import org.jetbrains.annotations.NotNull;
import spring.terminal.command.Command;
import spring.terminal.command.ICommand;
import spring.terminal.console.Console;

@Command("servant-class")
public class ServantClassCommand implements ICommand {

  private final Console console;

  public ServantClassCommand(Console console) {
    this.console = console;
  }

  public void execute(@NotNull List<String> args) {}
}
