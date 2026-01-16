package saber71.springboot;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.concurrent.TimeUnit;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import saber71.springboot.properties.JwtProperties;

@Component
public class AuthInterceptor implements HandlerInterceptor {

  private final RedisTemplate<String,Object> redisTemplate;
  private final JwtProperties jwtProperties;

  public AuthInterceptor(RedisTemplate<String,Object> redisTemplate, JwtProperties jwtProperties) {
    this.redisTemplate = redisTemplate;
    this.jwtProperties = jwtProperties;
  }

  @Override
  public boolean preHandle(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull Object handler)
      throws Exception {
    var authorization = request.getHeader("Authorization");
    if (authorization == null) {
      response.setStatus(401);
      response.setContentType("text/plain;charset=UTF-8");
      response.getWriter().write("尚未登录!!");
      return false;
    }
    var uid = redisTemplate.opsForValue().get(authorization);
    if (uid == null) {
      response.setStatus(401);
      response.setContentType("text/plain;charset=UTF-8");
      response.getWriter().write("凭证已过期，请重新登录!!");
      return false;
    }
    redisTemplate.expire(authorization, jwtProperties.getExpire(), TimeUnit.MILLISECONDS);
    UserContext.setUID((Long) uid);
    return false;
  }

  @Override
  public void afterCompletion(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull Object handler,
      @Nullable Exception ex) {
    UserContext.clear();
  }
}
