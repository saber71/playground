package saber71.springboot;

import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
public class BasePageableParam {
  @Min(value = 1)
  private int page = 1;

  @Min(value = 1)
  private int size = 10;

  public int getPage() {
    return page - 1;
  }

  public Pageable getPageable() {
    return getPageable(Sort.by(Sort.Direction.DESC, "createAt"));
  }

  public Pageable getPageable(Sort order) {
    return PageRequest.of(getPage(), getSize(), order);
  }
}
