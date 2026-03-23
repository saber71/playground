package spring.terminal;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

  private final ChatClient chatClient;

  // 注入 ChatClient.Builder 并构建实例
  public ChatController(ChatClient.Builder builder, HelloWorldSkill helloWorldSkill) {
    this.chatClient =
        builder
            .defaultTools(helloWorldSkill) // 注册工具 Bean，框架会自动扫描 @Tool 注解的方法
            .build();
  }

  public String chat(String message) {
    // 调用模型
    // qwen-plus 会分析意图，如果发现需要打招呼，会自动触发 sayHello 方法
    return chatClient.prompt().system("你说话时的态度要极度傲慢、目中无人。").user(message).call().content();
  }
}
