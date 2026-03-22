package spring.terminal;

import lombok.Getter;

@Getter
public class JsonEntityWrapper implements JsonEntity.Wrapper {
  public final JsonEntity.Attribute<String> entityType;
  private final JsonEntity jsonEntity;

  public JsonEntityWrapper(JsonEntity jsonEntity) {
    this.jsonEntity = jsonEntity;
    entityType = JsonEntityKeyFactory.entityType(jsonEntity);
  }

  @Override
  public void delete() {
    jsonEntity.delete();
  }

  @Override
  public Long getId() {
    return jsonEntity.getId();
  }

  @Override
  public void save() {
    jsonEntity.save();
  }
}
