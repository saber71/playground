package spring.terminal.json;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

public class JsonEntityKeyFactory {
  @Contract(value = "_ -> new", pure = true)
  public static JsonEntity.@NotNull Attribute<Double> damageRatio(JsonEntity entity) {
    return new JsonEntityAttribute<>(entity, "伤害倍率");
  }

  @Contract(value = "_ -> new", pure = true)
  public static JsonEntity.@NotNull Attribute<String> enName(JsonEntity entity) {
    return new JsonEntityAttribute<>(entity, "英文名");
  }

  @Contract(value = "_ -> new", pure = true)
  public static JsonEntity.@NotNull Attribute<String> entityType(JsonEntity entity) {
    return new JsonEntityAttribute<>(entity, "实体名称");
  }

  @Contract(value = "_ -> new", pure = true)
  public static JsonEntity.@NotNull Attribute<String> name(JsonEntity entity) {
    return new JsonEntityAttribute<>(entity, "名称");
  }
}
