package saber71.springboot;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.jetbrains.annotations.Nullable;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class Project extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String description;

  private Boolean archive = false;

  private Status status;

  public enum Status {
    RUNNING,
    PAUSE,
    COMPLETED
  }

  @EqualsAndHashCode(callSuper = true)
  @Data
  public static class SearchParam extends BasePageableParam{
    private String name;
    @Nullable private Boolean archive;
    @Nullable private Status status;
  }
}
