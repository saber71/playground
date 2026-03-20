package spring.terminal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class ServantClass extends BaseEntity {
  /* 从者职介英文名 */
  private String enName;

  /* 唯一标识符 */
  @Id @GeneratedValue private Long id;

  /* 从者职介中文名 */
  private String name;
}
