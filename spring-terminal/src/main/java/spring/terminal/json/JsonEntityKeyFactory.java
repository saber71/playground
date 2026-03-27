package spring.terminal.json;

import org.jetbrains.annotations.NotNull;

public class JsonEntityKeyFactory {
  private final JsonEntity entity;

  public JsonEntityKeyFactory(JsonEntity entity) {
    this.entity = entity;
  }

  public JsonEntity.@NotNull Attribute<String> biome() {
    return JsonEntityAttribute.string(entity, "地形");
  }

  public JsonEntity.@NotNull Attribute<String> climate() {
    return JsonEntityAttribute.string(entity, "气候类型");
  }

  public JsonEntity.@NotNull Attribute<Double> damageRatio() {
    return JsonEntityAttribute.doubles(entity, "伤害倍率");
  }

  public JsonEntity.@NotNull Attribute<Integer> dangerLevel() {
    return JsonEntityAttribute.integer(entity, "危险等级");
  }

  public JsonEntity.@NotNull Attribute<Double> defenseBonus() {
    return JsonEntityAttribute.doubles(entity, "防御加成");
  }

  public JsonEntity.@NotNull Attribute<Integer> developmentLevel() {
    return JsonEntityAttribute.integer(entity, "开发度");
  }

  public JsonEntity.@NotNull Attribute<String> entityType() {
    return JsonEntityAttribute.string(entity, "实体类型");
  }

  public JsonEntity.@NotNull Attribute<Integer> fertility() {
    return JsonEntityAttribute.integer(entity, "肥沃度");
  }

  public JsonEntity.@NotNull Attribute<String> improvement() {
    return JsonEntityAttribute.string(entity, "改良设施");
  }

  public JsonEntity.@NotNull Attribute<Long> liegeId() {
    return JsonEntityAttribute.longs(entity, "领主ID");
  }

  public JsonEntity.@NotNull Attribute<Integer> moveCost() {
    return JsonEntityAttribute.integer(entity, "移动消耗");
  }

  public JsonEntity.@NotNull Attribute<String> name() {
    return JsonEntityAttribute.string(entity, "名称");
  }

  public JsonEntity.@NotNull Attribute<Integer> population() {
    return JsonEntityAttribute.integer(entity, "人口");
  }

  public JsonEntity.@NotNull Attribute<String> resource() {
    return JsonEntityAttribute.string(entity, "特产资源");
  }

  public Resource resourceFactory() {
    return new Resource(entity);
  }

  public ResourceIncome resourceIncomeFactory() {
    return new ResourceIncome(entity);
  }

  public JsonEntity.@NotNull Attribute<Integer> volcanicEruption() {
    return JsonEntityAttribute.integer(entity, "火山喷发影响计时");
  }

  public static class Resource {

    private final JsonEntity entity;

    public Resource(JsonEntity entity) {
      this.entity = entity;
    }

    public JsonEntity.@NotNull Attribute<Double> farm() {
      return JsonEntityAttribute.doubles(entity, "农业");
    }

    public JsonEntity.@NotNull Attribute<Double> gems() {
      return JsonEntityAttribute.doubles(entity, "宝石");
    }

    public JsonEntity.@NotNull Attribute<Double> gold() {
      return JsonEntityAttribute.doubles(entity, "金矿");
    }

    public JsonEntity.@NotNull Attribute<Integer> horse() {
      return JsonEntityAttribute.integer(entity, "马");
    }

    public JsonEntity.@NotNull Attribute<Double> iron() {
      return JsonEntityAttribute.doubles(entity, "铁矿");
    }

    public JsonEntity.@NotNull Attribute<Integer> money() {
      return JsonEntityAttribute.integer(entity, "金钱");
    }

    public JsonEntity.@NotNull Attribute<Double> oil() {
      return JsonEntityAttribute.doubles(entity, "石油");
    }

    public JsonEntity.@NotNull Attribute<Double> spices() {
      return JsonEntityAttribute.doubles(entity, "香料");
    }

    public JsonEntity.@NotNull Attribute<Double> stone() {
      return JsonEntityAttribute.doubles(entity, "石材");
    }

    public JsonEntity.@NotNull Attribute<Double> timber() {
      return JsonEntityAttribute.doubles(entity, "木材");
    }

    public JsonEntity.@NotNull Attribute<Double> trade() {
      return JsonEntityAttribute.doubles(entity, "商业");
    }
  }

  public static class ResourceIncome {

    private final JsonEntity entity;

    public ResourceIncome(JsonEntity entity) {
      this.entity = entity;
    }

    public JsonEntity.@NotNull Attribute<Double> farmIncome() {
      return JsonEntityAttribute.doubles(entity, "农业收入");
    }

    public JsonEntity.@NotNull Attribute<Integer> horseIncome() {
      return JsonEntityAttribute.integer(entity, "马收入");
    }

    public JsonEntity.@NotNull Attribute<Double> ironIncome() {
      return JsonEntityAttribute.doubles(entity, "铁矿收入");
    }

    public JsonEntity.@NotNull Attribute<Double> oilIncome() {
      return JsonEntityAttribute.doubles(entity, "石油收入");
    }

    public JsonEntity.@NotNull Attribute<Double> stoneIncome() {
      return JsonEntityAttribute.doubles(entity, "石材收入");
    }

    public JsonEntity.@NotNull Attribute<Double> timberIncome() {
      return JsonEntityAttribute.doubles(entity, "木材收入");
    }

    public JsonEntity.@NotNull Attribute<Double> tradeIncome() {
      return JsonEntityAttribute.doubles(entity, "商业收入");
    }
  }
}
