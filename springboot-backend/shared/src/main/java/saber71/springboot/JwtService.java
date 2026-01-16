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

@Service
public class JwtService {

  private final JwtProperties jwtProperties;
  private final SecretKey secretKey;

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

  public String generateToken() {
    return generateToken(jwtProperties.getExpire());
  }

  public String generateToken(long expire) {
    return Jwts.builder()
        .expiration(new Date(System.currentTimeMillis() + expire))
        .signWith(secretKey)
        .issuedAt(new Date())
        .compact();
  }
}
