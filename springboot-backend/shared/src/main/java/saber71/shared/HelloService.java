package saber71.shared;

import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;

@Service
public class HelloService {
  public String hello(@Nullable String name) {
    return "hello " + name;
  }
}
