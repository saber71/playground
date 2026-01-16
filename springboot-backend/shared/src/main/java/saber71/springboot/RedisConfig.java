package saber71.springboot;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis配置类，用于配置RedisTemplate的相关设置
 */
@Configuration
public class RedisConfig {
  /**
   * 创建并配置RedisTemplate实例
   *
   * @param factory Redis连接工厂，用于建立与Redis服务器的连接
   * @return 配置好的RedisTemplate实例，键值类型分别为String和Object
   */
  @Bean
  @SuppressWarnings("all")
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
    var template = new RedisTemplate<String, Object>();
    template.setConnectionFactory(factory);
    // 设置哈希类型的键和值序列化器为字符串序列化器
    template.setHashKeySerializer(new StringRedisSerializer());
    template.setHashValueSerializer(new StringRedisSerializer());
    template.afterPropertiesSet();
    return template;
  }
}
