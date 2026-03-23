package spring.terminal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import spring.terminal.command.Command;
import spring.terminal.command.CommandController;

@SpringBootApplication
public class SpringTerminalApplication {

  static void main(String[] args) {
    SpringApplication.run(SpringTerminalApplication.class, args);
    var commandController = CommandController.create();
    var beans = SpringContext.getBeans(Command.class);
    commandController.setCommands(beans);
    commandController.run();
  }
}
