package saber71.springboot.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "web-config")
@Data
public class WebConfigProperties {
  private String apiPrefix = "/api";
}
