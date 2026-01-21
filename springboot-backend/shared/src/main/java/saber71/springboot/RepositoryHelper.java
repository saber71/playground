package saber71.springboot;

import java.util.*;
import org.jetbrains.annotations.Nullable;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

/** 仓库操作辅助类，提供通用的数据库操作方法 */
public class RepositoryHelper {
  /**
   * 根据ID查找实体对象
   *
   * @param repository JPA仓库实例，用于执行查询操作
   * @param id 要查找的实体ID，可为null
   * @param <T> 实体类型
   * @return 包含查找到的实体的Optional对象，如果ID为null或未找到则返回empty
   */
  public static <T> Optional<T> findById(JpaRepository<T, Long> repository, @Nullable Long id) {
    if (id == null) return Optional.empty();
    return repository.findById(id);
  }

  /**
   * 批量设置记录为已删除状态
   *
   * @param tableName 表名，不包含schema前缀
   * @param ids 要删除的记录ID列表
   */
  public static void setDeleted(String tableName, List<Long> ids) {
    setDeleted(tableName, WhereClause.in("id", ids));
  }

  public static void setDeleted(String tableName, WhereClause @NonNull ... clauses) {
    // 获取JDBC模板和环境配置
    var jdbc = SpringContext.getBean(NamedParameterJdbcTemplate.class);
    var environment = SpringContext.getEnvironment();
    var defaultSchema = environment.getProperty("spring.jpa.properties.hibernate.default_schema");

    // 构建软删除SQL语句
    var sql =
        "update %s.%s set deleted=true, delete_at=now() , delete_by=:uid"
            .formatted(defaultSchema, tableName);
    if (clauses.length > 1) {
      sql +=
          " where " + String.join(" and ", Arrays.stream(clauses).map(WhereClause::build).toList());
    }
    var params = new HashMap<String, Object>();
    params.put("uid", UserContext.getUID());
    for (WhereClause clause : clauses) {
      params.put(clause.field(), clause.value());
    }
    jdbc.update(sql, params);
  }
}
