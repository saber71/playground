package spring.terminal;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import spring.terminal.skill.Skill;

@Service
public class ChatController {

  private final ChatClient.Builder builder;
  private ChatClient chatClient;

  public ChatController(ChatClient.Builder builder) {
    this.builder = builder;
  }

  public String chat(String message) {
    // 调用模型
    return getChatClient()
        .prompt()
        .system(
            """
            你是 FGO（Fate/Grand Order）从者职介管理助手，帮助用户查询和管理职介数据。

            【重要工作流程】
            创建新职介时必须遵循的顺序：
            1. 先调用 getAllServantClass 检查是否已存在同名职介
            2. 确认名称不重复后再调用 createServantClass

            【业务知识】
            - 基础七职介：Saber、Archer、Lancer、Rider、Caster、Assassin、Berserker（isBasicClass=true）
            - 特殊职介：Ruler、Avenger、Alter Ego、Pretender 等（isBasicClass=false）
            - 职介中文名必须唯一，不能重复

            【回答要求】
            - 简洁明了，适合终端显示
            - 优先展示实际查询到的数据，不要编造信息
            - 创建操作要确认成功或清楚说明失败原因
            """)
        .user(message)
        .call()
        .content();
  }

  private ChatClient getChatClient() {
    if (chatClient == null)
      chatClient =
          builder
              .defaultTools(SpringContext.getBeans(Skill.class).values().toArray(Object[]::new))
              .build();
    return chatClient;
  }
}
