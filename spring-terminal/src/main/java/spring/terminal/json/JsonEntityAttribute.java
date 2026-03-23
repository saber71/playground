package spring.terminal.json;

public class JsonEntityAttribute<T> implements JsonEntity.Attribute<T> {
  private final JsonEntity jsonEntity;
  private final String name;

  public JsonEntityAttribute(JsonEntity jsonEntity, String name) {
    this.jsonEntity = jsonEntity;
    this.name = name;
  }

  @Override
  public T get() {
    if (jsonEntity.getData().containsKey(getName()))
      // noinspection unchecked
      return (T) jsonEntity.getData().get(getName());
    return null;
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
          data.remove(getName());
        }
      }
    }
  }
}
