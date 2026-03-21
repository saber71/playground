package spring.terminal;

import java.util.List;
import org.jspecify.annotations.NonNull;

@Command("servant-class")
public class ServantClassCommand implements ICommand {

  private final Console console;
  private final ServantClassRepository servantClassRepository;

  public ServantClassCommand(Console console, ServantClassRepository servantClassRepository) {
    this.console = console;
    this.servantClassRepository = servantClassRepository;
  }

  public void execute(@NonNull List<String> args) {
    if (args.isEmpty()) console.errorAndWait("缺少指令");
    else if (args.getFirst().equalsIgnoreCase("add")) {
      var servantClass = new ServantClass();
      servantClass.setName(console.readLine("职介名", servantClass.getName()));
      servantClass.setEnName(console.readLine("职介英文名", servantClass.getEnName()));
      servantClassRepository.save(servantClass);
      console.writeAndWait("创建ServantClass成功！");
    } else if (args.getFirst().equalsIgnoreCase("edit")) {
      var servantClassOption = servantClassRepository.findById(Long.valueOf(args.getFirst()));
      if (servantClassOption.isPresent()) {
        var servantClass = servantClassOption.get();
        servantClass.setName(console.readLine("职介名", servantClass.getName()));
        servantClass.setEnName(console.readLine("职介英文名", servantClass.getEnName()));
        servantClassRepository.save(servantClass);
        console.writeAndWait("修改ServantClass成功！");
      } else console.errorAndWait("找不到数据");
    }
  }
}
