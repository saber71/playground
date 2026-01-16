package saber71.springboot;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import saber71.springboot.properties.InterceptorProperties;
import saber71.springboot.properties.WebConfigProperties;

/** Web MVC配置类，用于配置路径匹配规则和拦截器 实现WebMvcConfigurer接口来自定义Spring MVC配置 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
  private final WebConfigProperties webConfigProperties;
  private final InterceptorProperties interceptorProperties;
  private final AuthInterceptor authInterceptor;

  public WebMvcConfig(
      WebConfigProperties webConfigProperties,
      InterceptorProperties interceptorProperties,
      AuthInterceptor authInterceptor) {
    this.webConfigProperties = webConfigProperties;
    this.interceptorProperties = interceptorProperties;
    this.authInterceptor = authInterceptor;
  }

  /**
   * 配置路径匹配规则，在API路径前添加统一前缀
   *
   * @param configurer 路径匹配配置器，用于配置路径匹配相关的设置
   */
  @Override
  public void configurePathMatch(@NonNull PathMatchConfigurer configurer) {
    // 为所有标记了@RestController注解的控制器类添加API前缀
    configurer.addPathPrefix(
        webConfigProperties.getApiPrefix(), c -> c.isAnnotationPresent(RestController.class));
  }

  /**
   * 添加拦截器配置 该方法用于注册认证拦截器，并配置其应用路径和排除路径
   *
   * @param registry 拦截器注册表，用于注册和配置拦截器
   */
  @Override
  public void addInterceptors(@NonNull InterceptorRegistry registry) {
    // 注册认证拦截器并配置路径模式
    registry
        .addInterceptor(authInterceptor)
        .addPathPatterns(interceptorProperties.getIncludePaths())
        .excludePathPatterns(interceptorProperties.getExcludePaths());
  }
}
