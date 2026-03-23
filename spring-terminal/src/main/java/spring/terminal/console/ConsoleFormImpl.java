package spring.terminal.console;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import spring.terminal.JsonEntity;

@Service
class ConsoleFormImpl implements ConsoleForm {

  private final Console console;

  public ConsoleFormImpl(Console console) {
    this.console = console;
  }

  public ConsoleFormImpl inputBoolean(JsonEntity.@NotNull Attribute<Boolean> attribute) {
    attribute.set(console.readBoolean(attribute.getName(), attribute.get()));
    return this;
  }

  public ConsoleFormImpl inputDouble(JsonEntity.@NotNull Attribute<Double> attribute) {
    attribute.set(console.readDouble(attribute.getName(), attribute.get()));
    return this;
  }

  public ConsoleFormImpl inputInt(JsonEntity.@NotNull Attribute<Integer> attribute) {
    attribute.set(console.readInt(attribute.getName(), attribute.get()));
    return this;
  }

  public ConsoleFormImpl inputString(JsonEntity.@NotNull Attribute<String> attribute) {
    attribute.set(console.readLine(attribute.getName(), attribute.get()));
    return this;
  }
}
