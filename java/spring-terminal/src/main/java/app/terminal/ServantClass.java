package app.terminal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class ServantClass extends BaseEntity {
  @Id
  @GeneratedValue
  private Long id;

  private String name;

  private String enName;
}
