package saber71.springboot;

import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class TaskVO extends Task{
  private List<Long> labelIds;

  private List<String> labels;
}
