package saber71.springboot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户初始化器
 * 在应用启动完成后自动创建默认的游客和管理员用户
 */
@Slf4j
@Component
public class UserInitializer {

  private final UserService userService;

  public UserInitializer(UserService userService) {
    this.userService = userService;
  }

  /**
   * 应用准备就绪事件监听器
   * 当Spring Boot应用完全启动后执行此方法，用于初始化系统默认用户
   */
  @Transactional
  @EventListener(ApplicationReadyEvent.class)
  public void onApplicationReady() {
    var guestName = "guest";
    var adminName = "admin";
    var guest = userService.getUser(guestName, null);
    var admin = userService.getUser(adminName, null);

    // 检查并创建游客用户
    if (guest.isEmpty()) {
      var dto = new User.CreateDTO();
      dto.setName(guestName);
      dto.setDisplayName("匿名游客");
      userService.save(dto);
    }

    // 检查并创建管理员用户
    if (admin.isEmpty()) {
      var dto = new User.CreateDTO();
      dto.setName(adminName);
      dto.setDisplayName("超级管理员");
      userService.save(dto);
    }

    log.info("用户初始化完成");
  }
}
