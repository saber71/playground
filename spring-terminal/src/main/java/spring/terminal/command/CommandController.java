package spring.terminal.command;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import spring.terminal.SpringContext;
import spring.terminal.console.Console;

@Service
public class CommandController {
  private final Map<String, ICommand> cmdMap = new HashMap<>();
  private final Console console;

  public CommandController(Console console) {
    this.console = console;
  }

  @Contract(" -> new")
  public static CommandController create() {
    return new CommandController(SpringContext.getBean(Console.class));
  }

  /**
   * 解析命令行字符串，支持引号、转义字符等复杂情况
   *
   * @param input 输入的命令行字符串
   * @return 解析后的参数数组
   */
  private List<String> parseCommandLine(String input) {
    List<String> args = new ArrayList<>();
    StringBuilder currentArg = new StringBuilder();
    boolean inQuotes = false;
    char quoteChar = 0;
    boolean escaped = false;
    boolean inArg = false;

    for (int i = 0; i < input.length(); i++) {
      char c = input.charAt(i);

      if (escaped) {
        currentArg.append(c);
        escaped = false;
        continue;
      }

      if (c == '\\') {
        escaped = true;
        continue;
      }

      if ((c == '"' || c == '\'') && !inQuotes) {
        inQuotes = true;
        quoteChar = c;
        inArg = true;
        continue;
      }

      if (c == quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = 0;
        continue;
      }

      if (Character.isWhitespace(c) && !inQuotes) {
        if (inArg) {
          args.add(currentArg.toString());
          currentArg.setLength(0);
          inArg = false;
        }
        continue;
      }

      currentArg.append(c);
      inArg = true;
    }

    if (!currentArg.isEmpty()) {
      args.add(currentArg.toString());
    }

    return args;
  }

  /**
   * 运行交互式命令行循环，持续读取用户输入并执行对应命令
   *
   * <p>支持多级命令匹配，会尝试从输入中匹配最长的命令路径
   *
   * @param prompt 命令行提示符字符串，用于引导用户输入
   */
  public void run(String prompt) {
    while (true) {
      var input = console.stringReader().read(prompt);
      if (input.equalsIgnoreCase("q")) break;
      if (input.equalsIgnoreCase("quit")) break;
      var args = parseCommandLine(input);
      List<Data> commands = new ArrayList<>();
      StringBuilder command = new StringBuilder();
      boolean found = false;
      for (int i = 0; i < args.size(); i++) {
        command.append(" ").append(args.get(i));
        var cmdString = command.toString().trim();
        if (cmdMap.containsKey(cmdString)) {
          found = true;
          cmdMap.get(command.toString());
          commands.add(new Data(cmdMap.get(cmdString), args.subList(i + 1, args.size())));
        } else if (found) break;
      }
      if (!found) console.error().write("找不到命令：" + input);
      else {
        var data = commands.removeLast();
        data.cmd.execute(data.args);
      }
    }
  }

  /**
   * 运行交互式命令行循环，使用默认提示符
   *
   * <p>调用带自定义提示符的 run 方法，提示符为"shell>> "
   */
  public void run() {
    run("shell>> ");
  }

  /**
   * 注册所有命令到命令映射表
   *
   * <p>从 Spring 容器中获取带有@Command 注解的 Bean，并将其转换为 ICommand 接口类型
   *
   * @param cmdMap 命令映射表，key 为 Bean 名称，value 为 Bean 实例（必须实现 ICommand 接口）
   */
  public void setCommands(@NotNull Map<String, Object> cmdMap) {
    cmdMap.forEach(
        (name, bean) -> {
          this.cmdMap.put(name, (ICommand) bean);
        });
  }

  record Data(ICommand cmd, List<String> args) {}
}
