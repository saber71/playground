package saber71.springboot;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.jetbrains.annotations.Nullable;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class User extends BaseEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String name;

  @Column private String displayName;

  @Column @JsonIgnore private String password;

  @Data
  public static class CreateDTO {
    @Nullable
    private Long id;

    private String name;

    private String displayName;

    @Nullable
    private String password;
  }
}
