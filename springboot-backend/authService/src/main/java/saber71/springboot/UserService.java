package saber71.springboot;

import java.util.List;
import java.util.Optional;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/** 用户服务类，提供用户相关的业务操作 */
@Slf4j
@Service
public class UserService {

  private final UserRepository userRepository;
  private final RsaService rsaService;

  /**
   * 构造函数，初始化用户服务
   *
   * @param userRepository 用户仓库，用于数据库操作
   * @param rsaService RSA加密解密服务
   */
  public UserService(UserRepository userRepository, RsaService rsaService) {
    this.userRepository = userRepository;
    this.rsaService = rsaService;
  }

  /**
   * 保存用户信息 如果用户存在则更新，不存在则创建新用户 密码会经过RSA解密后使用BCrypt进行加密存储
   *
   * @param dto 用户创建数据传输对象，不能为空
   * @return 保存后的用户对象
   */
  public User save(User.@NonNull CreateDTO dto) {
    // 根据ID查找现有用户，如果不存在则创建新用户
    var user = RepositoryHelper.findById(userRepository, dto.getId()).orElse(new User());
    ObjectHelper.assign(user, dto);
    if (user.getId() == null) {
      // 获取密码，如果为空则默认使用"123456"并加密
      var password = Optional.ofNullable(dto.getPassword()).orElse(rsaService.encrypt("123456"));
      // 解密获取明文密码
      var plain = rsaService.decrypt(password);
      // 使用BCrypt对明文密码进行加密后设置到用户对象
      user.setPassword(new BCryptPasswordEncoder().encode(plain));
    }
    return userRepository.save(user);
  }

  /**
   * 根据用户名和加密密码获取用户信息
   *
   * @param name 用户名，不能为空
   * @param encryptedPassword 加密后的密码，可以为空
   * @return 返回Optional包装的User对象，如果用户不存在或密码验证失败则返回空
   */
  public Optional<User> getUser(@NonNull String name, @Nullable String encryptedPassword) {
    // 查询用户并进行密码验证
    return userRepository
        .findUserByName(name)
        .map(
            user -> {
              if (encryptedPassword == null || encryptedPassword.isEmpty()) return user;
              log.info("user {}", user.getDeleted());
              if (user.getDeleted()) return null;
              // 解密密码并验证
              var password = rsaService.decrypt(encryptedPassword);
              if (new BCryptPasswordEncoder().matches(password, user.getPassword())) return user;
              return null;
            });
  }

  /**
   * 将指定用户ID列表的用户标记为已删除状态
   *
   * @param uids 用户ID列表
   */
  public boolean setDeleted(List<Long> uids) {
    RepositoryHelper.setDeleted("user", uids);
    return true;
  }

  /**
   * 根据搜索参数查询用户分页数据
   *
   * @param param 搜索参数，不能为空
   * @return 用户分页结果
   */
  public Page<User> search(@NonNull SearchParam param) {
    return userRepository.search(param.name, param.getPageable());
  }

  /**
   * 检查指定名称的用户是否存在
   *
   * @param name 用户名称，用于查询用户是否存在
   * @return 如果用户存在返回true，否则返回false
   */
  public boolean existName(String name) {
    var optionalUser = getUser(name, null);
    return optionalUser.isPresent();
  }

  /** 用户搜索参数类，继承基础分页参数 */
  @EqualsAndHashCode(callSuper = true)
  @Data
  public static class SearchParam extends BasePageableParam {
    private String name;
  }
}
