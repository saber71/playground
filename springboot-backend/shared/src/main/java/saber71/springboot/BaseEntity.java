package saber71.springboot;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@MappedSuperclass
public class BaseEntity {
  @Column(nullable = false, updatable = false)
  private LocalDateTime createAt;

  @Column(updatable = false)
  private Long createBy = UserContext.getUID();

  @Column(nullable = false)
  private LocalDateTime updateAt;

  @Column
  private Boolean deleted = false;

  @Column(insertable = false)
  private LocalDateTime deleteAt;

  @Column(insertable = false)
  private Long deleteBy;

  @PrePersist
  protected void onCreate() {
    createAt = LocalDateTime.now();
    updateAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updateAt = LocalDateTime.now();
  }
}
