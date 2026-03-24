package spring.terminal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.LocalDateTime;
import lombok.Data;
import org.hibernate.annotations.SQLRestriction;
import spring.terminal.UserContext;

@Data
@MappedSuperclass
@SQLRestriction("deleted = false")
public class BaseEntity {
  @Column(nullable = false, updatable = false)
  private LocalDateTime createAt;

  @Column(updatable = false)
  private Long createBy = UserContext.getUID();

  @Column(insertable = false)
  private LocalDateTime deleteAt;

  @Column(insertable = false)
  private Long deleteBy;

  @Column private Boolean deleted = false;

  @Column(nullable = false)
  private LocalDateTime updateAt;

  @PrePersist
  protected void onCreate() {
    createAt = LocalDateTime.now();
    updateAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updateAt = LocalDateTime.now();
  }

  public void setSoftDelete() {
    deleteAt = LocalDateTime.now();
    deleted = true;
    deleteBy = UserContext.getUID();
  }
}
