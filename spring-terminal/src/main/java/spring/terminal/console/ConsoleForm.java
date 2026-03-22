package spring.terminal.console;

import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import spring.terminal.JsonEntity;

@Service
public class ConsoleForm {

  private final Console console;

  public ConsoleForm(Console console) {
    this.console = console;
  }

  public ConsoleForm inputBoolean(JsonEntity.@NonNull Attribute<Boolean> attribute) {
    attribute.set(console.readBoolean(attribute.getName(), attribute.get()));
    return this;
  }

  public ConsoleForm inputDouble(JsonEntity.@NonNull Attribute<Double> attribute) {
    attribute.set(console.readDouble(attribute.getName(), attribute.get()));
    return this;
  }

  public ConsoleForm inputInt(JsonEntity.@NonNull Attribute<Integer> attribute) {
    attribute.set(console.readInt(attribute.getName(), attribute.get()));
    return this;
  }

  public ConsoleForm inputString(JsonEntity.@NonNull Attribute<String> attribute) {
    attribute.set(console.readLine(attribute.getName(), attribute.get()));
    return this;
  }
}
