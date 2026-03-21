package app.backend;

/** 用户上下文工具类，提供基于 ThreadLocal 的线程隔离用户 ID 存储功能 */
public class UserContext {
  /** 线程本地变量，用于存储当前线程的用户 ID */
  private static final ThreadLocal<Long> context = new ThreadLocal<>();

  static {
    setUID(1L);
  }

  /** 清除当前线程的用户上下文信息 */
  public static void clear() {
    context.remove();
  }

  /**
   * 获取当前线程的用户 ID
   *
   * @return 当前线程的用户 ID
   */
  public static Long getUID() {
    return context.get();
  }

  /**
   * 设置当前线程的用户 ID
   *
   * @param uid 要设置的用户 ID
   */
  public static void setUID(Long uid) {
    context.set(uid);
  }
}
