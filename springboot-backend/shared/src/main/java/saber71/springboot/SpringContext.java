package saber71.springboot;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/** Spring上下文工具类，实现ApplicationContextAware接口以获取Spring应用上下文 提供静态方法访问Spring容器中的Bean */
@Component
public class SpringContext implements ApplicationContextAware {
  /** Spring应用上下文静态实例 */
  private static ApplicationContext context;

  /**
   * 设置Spring应用上下文 该方法由Spring容器自动调用，用于注入ApplicationContext
   *
   * @param applicationContext Spring应用上下文实例，不能为空
   * @throws BeansException 当获取Bean过程中发生异常时抛出
   */
  @Override
  public void setApplicationContext(@NonNull ApplicationContext applicationContext)
      throws BeansException {
    context = applicationContext;
  }

  /**
   * 根据类型获取Spring容器中的Bean实例
   *
   * @param clazz Bean的Class类型
   * @param <T> Bean的泛型类型
   * @return 指定类型的Bean实例
   */
  public static <T> T getBean(Class<T> clazz) {
    return context.getBean(clazz);
  }

  /**
   * 获取RedisTemplate实例 从Spring容器中获取RedisTemplate类型的Bean
   *
   * @return RedisTemplate实例，键类型为String，值类型为Object
   */
  public static RedisTemplate<String, Object> getRedisTemplate() {
    return context.getBean("redisTemplate", RedisTemplate.class);
  }

  /**
   * 获取环境配置对象
   *
   * @return 返回Environment类型的环境配置对象
   */
  public static Environment getEnvironment() {
    return getBean(Environment.class);
  }
}
