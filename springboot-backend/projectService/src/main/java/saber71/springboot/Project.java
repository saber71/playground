package saber71.springboot;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

  @Data
  public static class CreateDTO {
    @Nullable private Long id;
    private String name;
    private String description;
    private Status status;
  }

  @EqualsAndHashCode(callSuper = true)
  @Data
  public static class SearchParam extends BasePageableParam{
    private String name;
    @Nullable private Boolean archive;
    @Nullable private Status status;
  }
}
