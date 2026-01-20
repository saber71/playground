package saber71.springboot;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.jetbrains.annotations.Nullable;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Task extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String description;

  private Status status;

  private Priority priority;

  private LocalDateTime expectedEndTime;

  private LocalDateTime realEndTime;

  public enum Status {
    TODO,
    RUNNING,
    COMPLETED,
    CANCELED
  }

  public enum Priority{
    LOW,
    MEDIUM,
    HIGH
  }

  @EqualsAndHashCode(callSuper = true)
  @Data
  public static class SearchParam extends BasePageableParam{
    @Nullable
    private String name;

    @Nullable
    private Status status;

    @Nullable
    private Priority priority;

    @Nullable
    private List<Long> labels;

    @Nullable
    private Long projectId;
  }

  @EqualsAndHashCode(callSuper = true)
  @Data
  public static class VO extends Task{
  }
}
