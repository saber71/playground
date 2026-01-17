package saber71.springboot.properties;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "interceptor")
@Data
public class InterceptorProperties {
  private List<String> includePaths = new ArrayList<>();
  private List<String> excludePaths = new ArrayList<>();
}
