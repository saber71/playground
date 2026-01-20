package saber71.springboot;

import jakarta.servlet.http.HttpServletRequest;
import org.jetbrains.annotations.Nullable;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserService userService;
  private final JwtService jwtService;
  private final RsaService rsaService;

  public AuthService(UserService userService, JwtService jwtService, RsaService rsaService) {
    this.userService = userService;
    this.jwtService = jwtService;
    this.rsaService = rsaService;
  }

  public ResponseEntity<String> login(String name, @Nullable String encryptedPassword) {
    var optionalUser = userService.getUser(name, encryptedPassword);
    if (optionalUser.isEmpty()) return ResponseEntity.status(401).body("用户不存在或密码错误");
    var user = optionalUser.get();
    var token = jwtService.generateToken();
    SpringContext.getRedisTemplate().opsForValue().set(token, user.getId());
    return ResponseEntity.ok(token);
  }

  public ResponseEntity<Boolean> logout(@NonNull HttpServletRequest request) {
    var authorization = request.getHeader("Authorization");
    SpringContext.getRedisTemplate().delete(authorization);
    return ResponseEntity.ok(true);
  }

  public ResponseEntity<String> getPublicKey() {
    return ResponseEntity.ok(rsaService.getPublicKey());
  }
}
