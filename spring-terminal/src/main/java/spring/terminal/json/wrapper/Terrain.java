package spring.terminal.json.wrapper;

import lombok.Getter;
import spring.terminal.json.JsonEntity;
import spring.terminal.json.JsonEntityKeyFactory;
import spring.terminal.json.JsonEntityWrapper;

public class Terrain extends JsonEntityWrapper {
  public final JsonEntity.Attribute<String> biome;
  public final JsonEntity.Attribute<String> climate;
  public final JsonEntity.Attribute<Integer> dangerLevel;
  public final JsonEntity.Attribute<Double> defenseBonus;
  public final JsonEntity.Attribute<Integer> developmentLevel;
  public final JsonEntity.Attribute<Double> farm;
  public final JsonEntity.Attribute<Double> farmIncome;
  public final JsonEntity.Attribute<Integer> fertility;
  public final JsonEntity.Attribute<Double> gems;
  public final JsonEntity.Attribute<Double> gold;
  public final JsonEntity.Attribute<String> improvement;
  public final JsonEntity.Attribute<Double> iron;
  public final JsonEntity.Attribute<Double> ironIncome;
  public final JsonEntity.Attribute<Long> liegeId;
  public final JsonEntity.Attribute<Integer> moveCost;
  public final JsonEntity.Attribute<String> name;
  public final JsonEntity.Attribute<Integer> population;
  public final JsonEntity.Attribute<String> resource;
  public final JsonEntity.Attribute<Double> spices;
  public final JsonEntity.Attribute<Double> stone;
  public final JsonEntity.Attribute<Double> stoneIncome;
  public final JsonEntity.Attribute<Double> timber;
  public final JsonEntity.Attribute<Double> timberIncome;
  public final JsonEntity.Attribute<Double> trade;
  public final JsonEntity.Attribute<Double> tradeIncome;
  public final JsonEntity.Attribute<Integer> volcanicEruption;

  public Terrain(JsonEntity jsonEntity) {
    super(jsonEntity);
    var factory = new JsonEntityKeyFactory(jsonEntity);
    var resourceFactory = factory.resourceFactory();
    var resourceIncomeFactory = factory.resourceIncomeFactory();
    name = factory.name();
    farmIncome = resourceIncomeFactory.farmIncome();
    farm = resourceFactory.farm();
    tradeIncome = resourceIncomeFactory.tradeIncome();
    trade = resourceFactory.trade();
    stoneIncome = resourceIncomeFactory.stoneIncome();
    stone = resourceFactory.stone();
    timberIncome = resourceIncomeFactory.timberIncome();
    timber = resourceFactory.timber();
    gems = resourceFactory.gems();
    gold = resourceFactory.gold();
    ironIncome = resourceIncomeFactory.ironIncome();
    spices = resourceFactory.spices();
    iron = resourceFactory.iron();
    biome = factory.biome();
    climate = factory.climate();
    dangerLevel = factory.dangerLevel();
    developmentLevel = factory.developmentLevel();
    improvement = factory.improvement();
    moveCost = factory.moveCost();
    resource = factory.resource();
    volcanicEruption = factory.volcanicEruption();
    liegeId = factory.liegeId();
    defenseBonus = factory.defenseBonus();
    fertility = factory.fertility();
    population = factory.population();
  }

  @Getter
  public enum Biome {
    /* 农业发展的最佳选择，农业收入加成高，易于建设。 */
    PLAIN("平原"),
    /* 提供木材资源，初期农业产出低，但可以发展为伐木场或特殊建筑。 */
    FOREST("森林"),
    /* 资源极其丰富但开发难度大，可能伴有疾病或野兽风险。 */
    JUNGLE("丛林"),
    /* 农业产出极低，可能产出特殊药材，但会降低人口健康度。 */
    MARSH("沼泽"),
    /* 适合放牧，农业产出中等，可能提供少量食物或金币。 */
    GRASSLAND("草原"),
    /* 农业和商业几乎为零，但提供极高的防御加成，可能产出矿石。 */
    MOUNTAIN("山脉"),
    /* 介于平原和山脉之间，防御略有加成，农业产出中等。 */
    HILL("丘陵"),
    /* 视野开阔，适合建立要塞或特殊城市，气候可能较寒冷。 */
    PLATEAU("高原"),
    /* 高风险高回报，周围土地可能异常肥沃，但有喷发毁灭地块的风险。 */
    VOLCANO("火山"),
    /* 极度贫瘠，农业无法进行，但可能埋藏着古代遗迹或石油（后期资源）。*/
    DESERT("沙漠"),
    /* 商业发展的关键，沿河地块 comm_income 大幅提升，利于运输 */
    RIVER("河流"),
    /* 允许建立港口，开启远洋贸易，是商业收入的主要来源地 */
    COAST("海岸"),
    /* 沙漠中的宝地，农业和商业产出都很高，是战略必争之地 */
    OASIS("绿洲"),
    /* 可能隐藏着宝藏或怪物，适合作为特殊副本或避难所 */
    CAVE("洞穴"),
    /* 非自然地形，探索后可能获得科技、金币或触发诅咒 */
    RUINS("废墟");

    private final String value;

    Biome(String value) {
      this.value = value;
    }
  }

  @Getter
  public enum Climate {
    /* 最平衡的气候。四季分明，对农业和人口没有惩罚，是文明发展的理想环境。 */
    TEMPERATURE("温带气候"),
    /* 极度缺水。所有地块的 fertility 减半，人口增长缓慢，但 Gold 和 Oil 的出现率提高。 */
    DESERT("干旱气候"),
    /* 高温多雨。fertility 很高，但 danger_level 也会提升（疾病、野兽），森林再生速度加快。 */
    TROPICAL("热带气候"),
    /* 温差巨大。夏季农业产出高，但冬季可能面临“冻土”惩罚，agri_income 大幅下降。 */
    CONTINENTAL("大陆性气候"),
    /* 终年严寒。农业几乎不可能，人口稀少，但可能产出独特的资源如“皮毛 (Furs)”或“鲸油 (Whale Oil)”。 */
    TUNDRA("极低气候"),
    /* 夏季干热，冬季温和。非常适合种植葡萄、橄榄等经济作物，能产生特殊的 Wine (酒) 或 Olive (橄榄) 资源，大幅提升商业收入。 */
    MEDITERRANEAN("地中海气候");

    private final String value;

    Climate(String value) {
      this.value = value;
    }
  }

  public enum Improvement {
    /* 建在 Plain 或 Grassland 上，将 fertility 转化为实际的粮食和 farm_income。 */
    FARM("农场"),
    /* 建在有 Timber 的地块上，持续产出木材和金币，但可能会降低地块的 fertility。 */
    LUMBER_MILL("伐木场"),
    /* 建在有 Iron, Gold, Stone 的地块上，开采出对应的战略或经济资源。 */
    MINE("矿场"),
    /* 专门用于开采 Stone 的设施，是建造高级建筑的先决条件。 */
    QUARRY("采石场"),
    /* 建在 Grassland 上，提供食物和用于骑兵单位的“马匹”资源。 */
    PASTURE("牧场"),
    /* 建在 Coast 上，大幅提升 comm_income，并允许进行远洋贸易和建造海军。 */
    PORT("港口"),
    /* 建在边境或战略要地，提供巨额的 defense_bonus，并可能威慑周围的 danger_level。 */
    FORT("要塞"),
    /* 建在丘陵或平原。在温带/地中海气候下提供高额商业收入；在寒冷气候下无法产出。 */
    VINEYARD("葡萄园"),
    /* 建在丘陵或平原。在地中海/干旱气候下提供稳定的商业和农业产出；是沙漠文明的经济支柱。 */
    OLIVE_GROVE("橄榄园"),
    /* 建在海岸或海洋。提供极高的商业收入 */
    WHALING_STATION("捕鲸站"),
    /* 建在森林或苔原。在寒冷气候下提供商业收入，并抵消部分因严寒导致的人口惩罚*/
    HUNTING_LODGE("狩猎小屋");

    @Getter private final String value;

    Improvement(String value) {
      this.value = value;
    }
  }

  @Getter
  public enum Resource {
    /* Forest (森林), Jungle (丛林)，基础建设资源，用于建造道路、船只和房屋 */
    TIMBER("木材"),
    /* Hill (丘陵), Mountain (山脉)，用于建造城墙、城堡等防御工事，提升 defense_bonus */
    STONE("石材"),
    /* Mountain (山脉), Volcano (火山)，战略资源，用于打造高级兵种（如骑士、剑士）和武器 */
    IRON("铁矿"),
    /* Mountain (山脉), Desert (沙漠)，直接增加 trade_income，是硬通货，可用于外交和购买 */
    GOLD("金矿"),
    /* Plain (平原), River (河流)，大幅提升 fertility 值，是农业发展的核心，增加粮食产出。 */
    FERTILE_SOIL("沃土"),
    /* Jungle (丛林), Oasis (绿洲)，高价值奢侈品和商品，能极大提升 trade_income 和人口满意度 */
    SPICES("香料"),
    /* River (河流), Coast (海岸)，提供稳定的食物来源，增加人口增长速度和 farm_income */
    FISH("渔业"),
    /* Desert (沙漠), Ocean (海洋），后期/高科技资源，用于驱动高级单位或建筑，带来巨额收入 */
    OIL("石油"),
    /* Mountain (山脉), Cave (洞穴），稀有奢侈品和商品，用于完成特殊任务、外交赠礼或换取大量金币 */
    GEMS("宝石");

    private final String value;

    Resource(String value) {
      this.value = value;
    }
  }
}
