package saber71.springboot;

import java.util.Objects;
import org.jetbrains.annotations.Contract;
import org.jspecify.annotations.NonNull;

public record WhereClause(String field, String comparator, Object value) {

  @Contract("_, _ -> new")
  public static @NonNull WhereClause equal(String field, Object value) {
    return new WhereClause(field, "=", value);
  }

  @Contract("_, _ -> new")
  public static @NonNull WhereClause in(String field, Object value) {
    return new WhereClause(field, "=", value);
  }

  @Contract(pure = true)
  public @NonNull String build() {
    if (Objects.equals(comparator, "in")) return "%s in (:%s)".formatted(field, field);
    return "%s %s :%s".formatted(field, comparator, field);
  }
}
