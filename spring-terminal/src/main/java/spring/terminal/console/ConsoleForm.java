package spring.terminal.console;

import org.jetbrains.annotations.NotNull;
import spring.terminal.json.JsonEntity;

public interface ConsoleForm {
  ConsoleFormImpl inputBoolean(JsonEntity.@NotNull Attribute<Boolean> attribute);

  ConsoleFormImpl inputDouble(JsonEntity.@NotNull Attribute<Double> attribute);

  ConsoleFormImpl inputInt(JsonEntity.@NotNull Attribute<Integer> attribute);

  ConsoleFormImpl inputString(JsonEntity.@NotNull Attribute<String> attribute);
}
