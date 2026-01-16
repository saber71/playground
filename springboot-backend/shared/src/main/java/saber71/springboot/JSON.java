package saber71.springboot;

import tools.jackson.databind.ObjectMapper;

/** JSON工具类，提供JSON字符串与Java对象之间的相互转换功能 */
public class JSON {
  private static final ObjectMapper objectMapper = new ObjectMapper();

  /**
   * 将Java对象转换为JSON字符串
   *
   * @param value 待转换的Java对象
   * @return 转换后的JSON字符串，如果转换失败则返回null
   */
  public static String stringify(Object value) {
    return objectMapper.writeValueAsString(value);
  }

  /**
   * 将JSON字符串解析为指定类型的Java对象
   *
   * @param value 待解析的JSON字符串
   * @param cls 目标对象的Class类型
   * @param <T> 目标对象的泛型类型
   * @return 解析后的Java对象，如果解析失败则返回null
   */
  public static <T> T parse(String value, Class<T> cls) {
    return objectMapper.readValue(value, cls);
  }
}
