package saber71.springboot;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import saber71.springboot.properties.JwtProperties;

/** JWT服务类，用于生成和管理JWT令牌 */
@Service
public class JwtService {

  private final JwtProperties jwtProperties;
  private final SecretKey secretKey;

  /**
   * 构造函数，初始化JWT服务
   *
   * @param jwtProperties JWT配置属性对象
   */
  public JwtService(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
    var bytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
    if (bytes.length < 32) {
      try {
        // 如果secret太短就用哈希算法扩展成固定的32字节
        bytes = MessageDigest.getInstance("SHA-256").digest(bytes);
      } catch (NoSuchAlgorithmException e) {
        throw new RuntimeException(e);
      }
    }
    secretKey = Keys.hmacShaKeyFor(bytes);
  }

  /**
   * 生成JWT令牌，使用默认过期时间
   *
   * @return 生成的JWT令牌字符串
   */
  public String generateToken() {
    return generateToken(jwtProperties.getExpire());
  }

  /**
   * 生成JWT令牌，指定过期时间
   *
   * @param expire 过期时间（毫秒）
   * @return 生成的JWT令牌字符串
   */
  public String generateToken(long expire) {
    return Jwts.builder()
        .expiration(new Date(System.currentTimeMillis() + expire))
        .signWith(secretKey)
        .issuedAt(new Date())
        .compact();
  }
}
