package spring.terminal;

public class ServantClass extends JsonEntityWrapper {
  public final JsonEntity.Attribute<String> enName;
  public final JsonEntity.Attribute<String> name;

  public ServantClass(JsonEntity jsonEntity) {
    super(jsonEntity);
    name = JsonEntityKeyFactory.name(jsonEntity);
    enName = JsonEntityKeyFactory.enName(jsonEntity);
  }
}
