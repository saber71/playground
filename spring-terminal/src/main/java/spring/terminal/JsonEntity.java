package spring.terminal;

import jakarta.persistence.*;
import java.util.Map;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** JSON实体类，用于存储JSON格式的数据 支持通过Map访问和操作JSON数据，并提供保存和删除的便捷方法 */
@Entity
@Data
public class JsonEntity {
  /** 存储JSON数据的Map，映射到数据库的jsonb类型字段 支持存储任意结构的JSON数据 */
  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  private Map<String, Object> data;

  /** 实体的唯一标识ID，主键字段 自动生成策略为AUTO */
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  /** 标记实体是否已更新的临时字段（不持久化到数据库） 用于优化保存操作，避免不必要的数据库写入 */
  @Transient private boolean updated = false;

  /** 从数据库中删除当前实体 使用SpringContext获取JsonEntityRepository实例执行删除操作 */
  public void delete() {
    SpringContext.getBean(JsonEntityRepository.class).delete(this);
  }

  /**
   * 保存当前实体到数据库 如果是新实体(id为null)或已标记为更新，则执行保存操作 否则直接返回当前实例，避免不必要的数据库操作
   *
   * @return 保存后的实体实例
   */
  public JsonEntity save() {
    if (id == null) updated = true;
    if (updated) {
      updated = false;
      return SpringContext.getBean(JsonEntityRepository.class).save(this);
    }
    return this;
  }

  /**
   * 属性接口，用于定义对泛型类型T的属性操作 提供获取、设置值以及获取属性名称的方法
   *
   * @param <T> 属性值的类型
   */
  public interface Attribute<T> {
    /**
     * 获取属性的当前值
     *
     * @return 属性值
     */
    T get();

    /**
     * 获取属性的名称
     *
     * @return 属性名称
     */
    String getName();

    /**
     * 设置属性的新值
     *
     * @param value 要设置的新值
     */
    void set(T value);
  }

  /** 包装器接口，定义了删除和保存操作 为实体提供统一的操作契约 */
  public interface Wrapper {
    /** 删除操作 */
    void delete();

    /* 获取id */
    Long getId();

    /** 保存操作 */
    void save();
  }
}
