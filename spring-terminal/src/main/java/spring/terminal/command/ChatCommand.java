package spring.terminal.command;

import java.util.List;
import spring.terminal.ChatController;
import spring.terminal.console.Console;

@Command("chat")
public class ChatCommand implements ICommand {
  private final ChatController chatController;
  private final Console console;

  public ChatCommand(Console console, ChatController chatController) {
    this.console = console;
    this.chatController = chatController;
  }

  @Override
  public void execute(List<String> args) {
    while (true) {
      var input = console.stringReader().read("char>>");
      if (input.equalsIgnoreCase("q") || input.equalsIgnoreCase("quit")) break;
      chatController.streamChat(input).doOnNext(console.writer()::write).blockLast();
      console.writer().writeln();
    }
  }
}
