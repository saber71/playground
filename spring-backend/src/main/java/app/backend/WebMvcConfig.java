package app.backend;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Web MVC配置类，用于配置路径匹配规则和拦截器 实现WebMvcConfigurer接口来自定义Spring MVC配置 */
@Slf4j
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

  /**
   * 配置路径匹配规则，在API路径前添加统一前缀
   *
   * @param configurer 路径匹配配置器，用于配置路径匹配相关的设置
   */
  @Override
  public void configurePathMatch(@NonNull PathMatchConfigurer configurer) {
    // 为所有标记了@RestController注解的控制器类添加API前缀
    configurer.addPathPrefix("/api", c -> c.isAnnotationPresent(RestController.class));
  }
}
