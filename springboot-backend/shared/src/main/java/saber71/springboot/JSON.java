package saber71.springboot;

import tools.jackson.databind.ObjectMapper;

public class JSON {
  private static final ObjectMapper objectMapper = new ObjectMapper();

  public static String stringify(Object value) {
    return objectMapper.writeValueAsString(value);
  }

  public static <T> T parse(String value, Class<T> cls) {
    return objectMapper.readValue(value, cls);
  }
}
