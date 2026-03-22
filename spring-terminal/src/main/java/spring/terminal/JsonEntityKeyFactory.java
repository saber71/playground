package spring.terminal;

import org.jetbrains.annotations.Contract;
import org.jspecify.annotations.NonNull;

public class JsonEntityKeyFactory {
  @Contract(value = "_ -> new", pure = true)
  public static JsonEntity.@NonNull Attribute<Double> damageRatio(JsonEntity entity) {
    return new JsonEntityAttribute<>(entity, "伤害倍率");
  }

  @Contract(value = "_ -> new", pure = true)
  public static JsonEntity.@NonNull Attribute<String> enName(JsonEntity entity) {
    return new JsonEntityAttribute<>(entity, "英文名");
  }

  @Contract(value = "_ -> new", pure = true)
  public static JsonEntity.@NonNull Attribute<String> entityType(JsonEntity entity) {
    return new JsonEntityAttribute<>(entity, "实体名称");
  }

  @Contract(value = "_ -> new", pure = true)
  public static JsonEntity.@NonNull Attribute<String> name(JsonEntity entity) {
    return new JsonEntityAttribute<>(entity, "名称");
  }
}
