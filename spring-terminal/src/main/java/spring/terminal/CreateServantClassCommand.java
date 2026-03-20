package spring.terminal;

import java.util.List;

@Command("create servant")
public class CreateServantClassCommand implements ICommand {

  private final Console console;
  private final ServantClassRepository servantClassRepository;

  public CreateServantClassCommand(Console console, ServantClassRepository servantClassRepository) {
    this.console = console;
    this.servantClassRepository = servantClassRepository;
  }

  public void execute(List<String> args) {
    var servantClass = new ServantClass();
    servantClass.setName(console.readLine("职介名："));
    servantClass.setEnName(console.readLine("职介英文名："));
    servantClassRepository.save(servantClass);
    console.writeAndWait("创建ServantClass成功！");
  }
}
