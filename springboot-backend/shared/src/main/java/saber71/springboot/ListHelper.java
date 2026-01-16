package saber71.springboot;

import java.util.Arrays;
import java.util.List;
import org.jetbrains.annotations.Unmodifiable;
import org.jspecify.annotations.NonNull;

public class ListHelper {
  public static @NonNull @Unmodifiable List<Long> splitMapLong(@NonNull String str) {
    return Arrays.stream(str.split(",")).map(Long::parseLong).toList();
  }

  public static @NonNull @Unmodifiable List<Integer> splitMapInt(@NonNull String str) {
    return Arrays.stream(str.split(",")).map(Integer::parseInt).toList();
  }
}
