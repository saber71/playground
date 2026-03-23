package spring.terminal;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Controller;
import spring.terminal.skill.Skill;

@Controller
public class ChatController {

  private final ChatClient chatClient;

  public ChatController(ChatClient.Builder builder) {
    this.chatClient =
        builder
            .defaultTools(SpringContext.getBeans(Skill.class).values().toArray(Object[]::new))
            .build();
  }

  public String chat(String message) {
    // 调用模型
    return chatClient.prompt().system("你说话时的态度要极度傲慢、目中无人。").user(message).call().content();
  }
}
