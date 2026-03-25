package spring.terminal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/* 从者职介表 */
@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class ServantClass extends BaseEntity {
  /* 职介说明描述 */
  @Column private String description;

  /* 是否为基础七职介 */
  private Boolean isBasicClass = false;

  /* 从者职介中文名 */
  @Column(unique = true)
  private String name;
}
