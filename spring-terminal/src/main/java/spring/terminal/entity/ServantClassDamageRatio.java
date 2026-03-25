package spring.terminal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class ServantClassDamageRatio extends BaseEntity {
  /* 攻击方职介id */
  @Column private Long attackerId;

  /* 攻击方职介名 */
  private String attackerName;

  /* 防御方职介id */
  private Long defenderId;

  /* 防御方职介名 */
  private String defenderName;

  /* 伤害倍率 */
  private Double ratio;
}
