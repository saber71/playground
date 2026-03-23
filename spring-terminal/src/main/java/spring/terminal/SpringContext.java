package spring.terminal;

import java.lang.annotation.Annotation;
import java.util.Map;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/** Spring上下文工具类，实现ApplicationContextAware接口以获取Spring应用上下文 提供静态方法访问Spring容器中的Bean */
@Component
public class SpringContext implements ApplicationContextAware {
  /** Spring应用上下文静态实例 */
  private static ApplicationContext context;

  /**
   * 根据类型获取Spring容器中的Bean实例
   *
   * @param clazz Bean的Class类型
   * @param <T> Bean的泛型类型
   * @return 指定类型的Bean实例
   */
  public static <T> @NotNull T getBean(Class<T> clazz) {
    return context.getBean(clazz);
  }

  /**
   * 获取所有被指定注解标注的 Bean 实例
   *
   * @param annotationType 注解类型，用于筛选带有该注解的所有 Bean
   * @return Map<String, Object>，key 为 Bean 名称，value 为 Bean 实例，不会为 null
   */
  public static @NotNull Map<String, Object> getBeans(Class<? extends Annotation> annotationType) {
    return context.getBeansWithAnnotation(annotationType);
  }

  /**
   * 设置Spring应用上下文 该方法由Spring容器自动调用，用于注入ApplicationContext
   *
   * @param applicationContext Spring应用上下文实例，不能为空
   * @throws BeansException 当获取Bean过程中发生异常时抛出
   */
  @Override
  public void setApplicationContext(@NotNull ApplicationContext applicationContext)
      throws BeansException {
    context = applicationContext;
  }
}
