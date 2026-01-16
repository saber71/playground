package saber71.springboot.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rsa")
@Data
public class RsaProperties {
  private String publicKey;
  private String privateKey;
}
