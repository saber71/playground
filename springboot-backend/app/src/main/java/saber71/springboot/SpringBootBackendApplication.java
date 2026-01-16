package saber71.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
@ConfigurationPropertiesScan("saber71.springboot")
public class SpringBootBackendApplication {

  static void main(String[] args) {
    SpringApplication.run(SpringBootBackendApplication.class, args);
  }
}
