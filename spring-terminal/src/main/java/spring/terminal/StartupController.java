package spring.terminal;

import org.springframework.stereotype.Service;

@Service
public class StartupController {

  private final Console console;
  private final ServantClassRepository servantClassRepository;

  public StartupController(Console console, ServantClassRepository servantClassRepository) {
    this.console = console;
    this.servantClassRepository = servantClassRepository;
  }

  public void run() {
    console.writeln("Servant表单");
    var servantClass = new ServantClass();
    servantClass.setName(console.readLine("职介名："));
    servantClass.setEnName(console.readLine("职介英文名："));
    servantClassRepository.save(servantClass);
    console.writeln("Servant创建成功");
  }
}
