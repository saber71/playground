package spring.terminal.json;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

public class JsonEntityAttribute<T> implements JsonEntity.Attribute<T> {
  private final T defaultValue;
  private final JsonEntity jsonEntity;
  private final String name;

  public JsonEntityAttribute(JsonEntity jsonEntity, String name, T defaultValue) {
    this.jsonEntity = jsonEntity;
    this.name = name;
    this.defaultValue = defaultValue;
  }

  @Contract(value = "_, _ -> new", pure = true)
  public static @NotNull JsonEntityAttribute<Double> doubles(JsonEntity jsonEntity, String name) {
    return new JsonEntityAttribute<>(jsonEntity, name, 0.0);
  }

  @Contract(value = "_, _ -> new", pure = true)
  public static @NotNull JsonEntityAttribute<Integer> integer(JsonEntity jsonEntity, String name) {
    return new JsonEntityAttribute<>(jsonEntity, name, 0);
  }

  @Contract(value = "_, _ -> new", pure = true)
  public static @NotNull JsonEntityAttribute<Long> longs(JsonEntity jsonEntity, String name) {
    return new JsonEntityAttribute<>(jsonEntity, name, 0L);
  }

  @Contract(value = "_, _ -> new", pure = true)
  public static @NotNull JsonEntityAttribute<String> string(JsonEntity jsonEntity, String name) {
    return new JsonEntityAttribute<>(jsonEntity, name, "");
  }

  @Override
  public T get() {
    if (jsonEntity.getData().containsKey(getName()))
      // noinspection unchecked
      return (T) jsonEntity.getData().get(getName());
    return defaultValue;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public void set(T value) {
    var data = jsonEntity.getData();
    if (data.containsKey(getName())) {
      var oldVal = get();
      if (oldVal == null) {
        if (value == null) return;
        jsonEntity.setUpdated(true);
        data.put(getName(), value);
      } else {
        if (value == null || !value.equals(oldVal)) {
          jsonEntity.setUpdated(true);
          if (defaultValue != null) data.put(getName(), defaultValue);
          else data.remove(getName());
        }
      }
    }
  }
}
