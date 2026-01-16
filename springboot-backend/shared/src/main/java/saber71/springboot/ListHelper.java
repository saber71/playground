package saber71.springboot;

import java.util.Arrays;
import java.util.List;
import org.jetbrains.annotations.Unmodifiable;
import org.jspecify.annotations.NonNull;

/** 提供字符串分割转换为列表等的工具方法 */
public class ListHelper {

  /**
   * 将逗号分隔的字符串转换为不可修改的Long类型列表
   *
   * @param str 输入的逗号分隔字符串，不能为null
   * @return 转换后的不可修改Long类型列表，不为null
   * @throws NumberFormatException 当字符串中包含无法解析为Long的数值时抛出
   */
  public static @NonNull @Unmodifiable List<Long> splitMapLong(@NonNull String str) {
    return Arrays.stream(str.split(",")).map(Long::parseLong).toList();
  }

  /**
   * 将逗号分隔的字符串转换为不可修改的Integer类型列表
   *
   * @param str 输入的逗号分隔字符串，不能为null
   * @return 转换后的不可修改Integer类型列表，不为null
   * @throws NumberFormatException 当字符串中包含无法解析为Integer的数值时抛出
   */
  public static @NonNull @Unmodifiable List<Integer> splitMapInt(@NonNull String str) {
    return Arrays.stream(str.split(",")).map(Integer::parseInt).toList();
  }
}
