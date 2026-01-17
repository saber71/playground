package saber71.springboot;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@Tag(name = "授权服务")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @Operation(summary = "登录")
  @PostMapping("login")
  public ResponseEntity<String> login(@RequestBody LoginDTO value) {
    return authService.login(value.name(), value.password());
  }

  @Operation(summary = "退出登录")
  @PostMapping("logout")
  public ResponseEntity<String> logout(HttpServletRequest httpServletRequest) {
    return authService.logout(httpServletRequest);
  }

  @Operation(summary = "获取公钥")
  @GetMapping("public-key")
  public ResponseEntity<String> getPublicKey() {
    return authService.getPublicKey();
  }

  public record LoginDTO(String name, @Nullable String password) {}
}
