package saber71.springboot;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("user")
@Tag(name = "用户管理")
public class UserController {

  private final UserService userService;
  private final UserRepository userRepository;

  public UserController(UserService userService, UserRepository userRepository) {
    this.userService = userService;
    this.userRepository = userRepository;
  }

  @Operation(summary = "检查指定账号名是否已存在")
  @GetMapping("exist-name")
  public ResponseEntity<Boolean> existName(String name) {
    return ResponseEntity.ok(userService.existName(name));
  }

  @Operation(summary = "分页搜索")
  @GetMapping("search")
  public ResponseEntity<Page<User>> search(UserService.SearchParam param) {
    return ResponseEntity.ok(userService.search(param));
  }

  @Operation(summary = "保存用户数据")
  @PostMapping("save")
  public ResponseEntity<User> save(@RequestBody User.CreateDTO user) {
    return ResponseEntity.ok(userService.save(user));
  }

  @Operation(summary = "删除指定用户")
  @DeleteMapping("delete")
  public ResponseEntity<Boolean> delete(String ids) {
    userService.setDeleted(ListHelper.splitMapLong(ids));
    return ResponseEntity.ok(true);
  }

  @Operation(summary = "获取当前用户信息")
  @GetMapping("info")
  public ResponseEntity<User> info() {
    return ResponseEntity.of(userRepository.findById(UserContext.getUID()));
  }
}
