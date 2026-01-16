package saber71.springboot;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.BeanUtils;

public class ObjectHelper {
  @Contract("_, _ -> param1")
  public static <T> T assign(@NotNull T dst, Object @NonNull ... src) {
    for (Object item : src) {
      BeanUtils.copyProperties(item, dst);
    }
    return dst;
  }
}
