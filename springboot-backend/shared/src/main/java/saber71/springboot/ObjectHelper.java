package saber71.springboot;

import java.lang.reflect.Field;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.BeanUtils;

public class ObjectHelper {
  private static final Map<Class<?>, List<Field>> classMapFields = new HashMap<>();

  public static @NotNull List<Field> getAllFields(Class<?> clazz) {
    var fields = classMapFields.get(clazz);
    if (fields == null) {
      fields = new ArrayList<>();
      while (clazz != null && clazz != Objects.class) {
        var fs = clazz.getDeclaredFields();
        for (Field field : fs) {
          if (!field.isSynthetic()) {
            field.setAccessible(true);
            fields.add(field);
          }
        }
        clazz = clazz.getSuperclass();
      }
      classMapFields.put(clazz, fields);
    }
    return fields;
  }

  public static @Nullable Field getField(Class<?> clazz, String name) {
    var list = getAllFields(clazz).stream().filter(f -> f.getName().equals(name)).toList();
    if (!list.isEmpty()) return list.getFirst();
    return null;
  }

  @Contract("_, _ -> param1")
  public static <T> T assign(@NotNull T dst, Object @NonNull ... src) {
    for (Object item : src) {
      if (item instanceof Map<?, ?>) {
        ((Map<?, ?>) item)
            .forEach(
                (key, value) -> {
                  if (value == null) return;
                  try {
                    var name = toCamelCase((String) key);
                    var field = getField(dst.getClass(), name);
                    if (field == null) return;
                    field.setAccessible(true);
                    Object val;
                    if (value instanceof Long[]) val = Arrays.stream((Long[]) value).toList();
                    else if (value instanceof String[])
                      val = Arrays.stream((String[]) value).toList();
                    else val = value;
                    if (field.getType().equals(LocalDateTime.class)
                        && val.getClass().equals(String.class)) {
                      field.set(
                          dst,
                          LocalDateTime.ofInstant(Instant.parse((String) val), ZoneOffset.UTC));
                    } else if (field.getType().isEnum() && val instanceof Short) {
                      field.set(dst, field.getType().getEnumConstants()[(short) val]);
                    } else {
                      field.set(dst, val);
                    }
                  } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                  }
                });
      } else {
        BeanUtils.copyProperties(item, dst);
      }
    }
    return dst;
  }

  public static String toCamelCase(String snakeCase) {
    if (snakeCase == null || snakeCase.isEmpty()) {
      return snakeCase;
    }

    StringBuilder result = new StringBuilder();
    boolean nextUpperCase = false;

    for (int i = 0; i < snakeCase.length(); i++) {
      char c = snakeCase.charAt(i);

      if (c == '_') {
        nextUpperCase = true; // 下一个非下划线字符要大写
      } else {
        if (nextUpperCase) {
          result.append(Character.toUpperCase(c));
          nextUpperCase = false;
        } else {
          // 首字符保持原样（通常是小写）
          result.append(Character.toLowerCase(c));
        }
      }
    }

    return result.toString();
  }
}
