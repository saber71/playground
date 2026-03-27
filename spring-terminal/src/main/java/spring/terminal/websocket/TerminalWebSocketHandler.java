package spring.terminal.websocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import spring.terminal.command.CommandController;

@Slf4j
@Component
public class TerminalWebSocketHandler extends TextWebSocketHandler {

  private final CommandController commandController;
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final ConcurrentHashMap<String, SessionContext> sessionContexts =
      new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

  public TerminalWebSocketHandler(CommandController commandController) {
    this.commandController = commandController;
  }

  @Override
  public void afterConnectionClosed(
      @NotNull WebSocketSession session, @NotNull CloseStatus status) {
    sessions.remove(session.getId());
    SessionContext context = sessionContexts.remove(session.getId());
    if (context != null) {
      context.close();
    }
    log.info("终端连接关闭：{} - {}", session.getId(), status);
  }

  @Override
  public void afterConnectionEstablished(@NotNull WebSocketSession session) {
    sessions.put(session.getId(), session);

    SessionContext context = new SessionContext(session);
    sessionContexts.put(session.getId(), context);

    log.info("新终端连接：{}", session.getId());

    sendMessage(session, "\r\n\u001B[32m✓ 已连接到 Spring 终端服务\u001B[0m\r\n");
    sendMessage(session, "\u001B[33m提示：输入 'help' 查看可用命令\u001B[0m\r\n\r\n");

    showPrompt(session);
  }

  public void broadcastOutput(String text) {
    sessions
        .values()
        .forEach(
            session -> {
              try {
                sendMessage(session, text);
              } catch (Exception e) {
                log.error("广播消息失败", e);
              }
            });
  }

  private void handleInput(@NotNull WebSocketSession session, String input) {
    SessionContext context = sessionContexts.get(session.getId());
    if (context != null) {
      context.handleInput(input);
    }
  }

  private void handleResize(@NotNull WebSocketSession session, int cols, int rows) {
    SessionContext context = sessionContexts.get(session.getId());
    if (context != null) {
      context.resize(cols, rows);
    }
    log.info("终端尺寸调整：{} - {}x{}", session.getId(), cols, rows);
  }

  @Override
  protected void handleTextMessage(@NotNull WebSocketSession session, @NotNull TextMessage message)
      throws Exception {
    String payload = message.getPayload();
    JsonNode jsonNode = objectMapper.readTree(payload);

    String type = jsonNode.get("type").asText();

    if ("input".equals(type)) {
      String data = jsonNode.get("data").asText();
      handleInput(session, data);
    } else if ("resize".equals(type)) {
      int cols = jsonNode.get("cols").asInt();
      int rows = jsonNode.get("rows").asInt();
      handleResize(session, cols, rows);
    }
  }

  @Override
  public void handleTransportError(
      @NotNull WebSocketSession session, @NotNull Throwable exception) {
    log.error("WebSocket 传输错误：{}", session.getId(), exception);
  }

  private void sendMessage(WebSocketSession session, String text) {
    try {
      ObjectNode response = objectMapper.createObjectNode().put("type", "output").put("data", text);
      session.sendMessage(new TextMessage(response.toString()));
    } catch (Exception e) {
      log.error("发送消息失败：{}", session.getId(), e);
    }
  }

  private void showPrompt(WebSocketSession session) {
    sendMessage(session, "\u001B[32mspring-terminal>\u001B[0m ");
  }

  public class SessionContext {
    @Getter private int cols = 80;
    private StringBuilder currentCommand = new StringBuilder();
    private int cursorPosition = 0;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Getter private int rows = 24;
    private final WebSocketSession session;

    public SessionContext(WebSocketSession session) {
      this.session = session;
    }

    public void close() {
      currentCommand = null;
    }

    private void executeCommand() {
      String commandLine = currentCommand.toString().trim();
      sendOutput("\r\n");

      if (!commandLine.isEmpty()) {
        try {
          ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
          PrintStream printStream = new PrintStream(outputStream);
          PrintStream oldOut = System.out;
          System.setOut(printStream);

          commandController.execute(commandLine);

          System.setOut(oldOut);
          String result = outputStream.toString();
          sendOutput(result);
        } catch (Exception e) {
          sendOutput("\u001B[31m错误：" + e.getMessage() + "\u001B[0m\r\n");
          log.error("执行命令失败：{}", commandLine, e);
        }
      }

      currentCommand = new StringBuilder();
      cursorPosition = 0;
      showPrompt();
    }

    private void handleBackspace() {
      if (cursorPosition > 0) {
        currentCommand.deleteCharAt(--cursorPosition);
        sendOutput("\b \b");
      }
    }

    public void handleInput(@NotNull String input) {
      for (char c : input.toCharArray()) {
        switch (c) {
          case '\n', '\r' -> executeCommand();
          case '\b', (char) 127 -> handleBackspace();
          case (char) 3 -> handleInterrupt();
          default -> {
            currentCommand.insert(cursorPosition++, c);
            sendOutput(String.valueOf(c));
          }
        }
      }
    }

    private void handleInterrupt() {
      currentCommand = new StringBuilder();
      cursorPosition = 0;
      sendOutput("^C\r\n");
      showPrompt();
    }

    public void resize(int cols, int rows) {
      this.cols = cols;
      this.rows = rows;
    }

    public void sendOutput(String text) {
      try {
        ObjectNode response =
            objectMapper.createObjectNode().put("type", "output").put("data", text);
        session.sendMessage(new TextMessage(response.toString()));
      } catch (Exception e) {
        log.error("发送输出失败", e);
      }
    }

    private void showPrompt() {
      sendOutput("\u001B[32mspring-terminal>\u001B[0m ");
    }
  }
}
