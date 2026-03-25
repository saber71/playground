package spring.terminal;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import spring.terminal.skill.Skill;

@Service
public class ChatController {

  private final ChatClient.Builder builder;
  private ChatClient chatClient;
  private final ChatMemory chatMemory = MessageWindowChatMemory.builder().maxMessages(10).build();

  public ChatController(ChatClient.Builder builder) {
    this.builder = builder;
  }

  public String chat(String message) {
    // 调用模型
    return getChatClient().prompt().user(message).call().content();
  }

  private ChatClient getChatClient() {
    if (chatClient == null)
      chatClient =
          builder
              .defaultTools(SpringContext.getBeans(Skill.class).values().toArray(Object[]::new))
              .defaultSystem(
                  """
        【回答要求】
        - 简洁明了，适合终端显示
        - 优先展示实际查询到的数据，不要编造信息
        - 收到指令进行操作时马上执行不需要再进行确认
        - 操作后反馈结果，如果失败了请清楚说明失败原因
        """)
              .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
              .build();
    return chatClient;
  }

  public Flux<String> streamChat(String message) {
    return getChatClient().prompt().user(message).stream().content();
  }
}
