package app.terminal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class ServantClassDamageRatio extends BaseEntity{
  @Id
  @GeneratedValue
  private Long id;

  private Long attackerId;

  private String attackerName;

  private Long defenderId;

  private String defenderName;

  private double param;
}
