package app.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class ServantClassDamageRatio extends BaseEntity {
  private Long attackerId;

  private String attackerName;

  private Long defenderId;

  private String defenderName;

  @Id @GeneratedValue private Long id;

  private double param;
}
