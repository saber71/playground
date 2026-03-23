package spring.terminal;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Service;

@Service
public class HelloWorldSkill {

  /**
   * 一个简单的 Hello World 技能
   *
   * @param name 需要打招呼的名字
   * @return 返回问候语
   */
  @Tool(description = "当用户需要打招呼或说你好时调用此工具，返回标准的问候语。")
  public String sayHello(@ToolParam(description = "用户的名字") String name) {
    System.out.println("sayHello " + name);
    if (name == null || name.trim().isEmpty()) {
      name = "World";
    }
    return "Hello, " + name + "! This is a response from the Qwen-Plus Skill.";
  }
}
