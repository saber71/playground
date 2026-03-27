package spring.terminal.skill;

import java.util.List;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.dao.DataIntegrityViolationException;
import spring.terminal.entity.ServantClass;
import spring.terminal.entity.ServantClassDamageRatio;
import spring.terminal.service.ServantClassDamageRatioService;
import spring.terminal.service.ServantClassService;

@Skill
public class ServantClassSkill {

  private final ServantClassDamageRatioService servantClassDamageRatioService;
  private final ServantClassService servantClassService;

  public ServantClassSkill(
      ServantClassService servantClassService,
      ServantClassDamageRatioService servantClassDamageRatioService) {
    this.servantClassService = servantClassService;
    this.servantClassDamageRatioService = servantClassDamageRatioService;
  }

  @Tool(description = "查询所有已创建的从者职介列表。在创建新职介前必须调用此工具检查是否已存在同名职介，也可用于回答用户关于职介的查询问题")
  public List<ServantClass> getAllServantClass() {
    return servantClassService.findAll();
  }

  @Tool(
      description =
          "查询指定的攻击者职介对所有其他职介的攻击倍率。用于分析职阶克制关系，例如 Saber 对 Lancer 有 2.0 倍克制，对 Archer 只有 0.5 倍被克制。返回包含所有防御方职介的倍率数据")
  public List<ServantClassDamageRatio> getAllServantClassDamageRatio(
      @ToolParam(description = "攻击者职介中文名") String attackerName) {
    return servantClassDamageRatioService.findAllByAttackerName(attackerName);
  }

  @Tool(description = "保存从者职介数据。需要提供名字、介绍文本和是否为基础七职介")
  public String saveServantClass(
      @ToolParam(description = "从者职介名，必须唯一，不能与已有职介重复") String name,
      @ToolParam(description = "从者职介的介绍文本，说明该职介的特点") String description,
      @ToolParam(
              description =
                  "是否为基础七职介（Saber/Archer/Lancer/Rider/Caster/Assassin/Berserker 为 true，其他特殊职介为 false）")
          boolean isBasicClass) {
    try {
      var entity = servantClassService.findByName(name);
      if (entity == null) entity = new ServantClass();
      entity.setName(name);
      entity.setIsBasicClass(isBasicClass);
      entity.setDescription(description);
      servantClassService.save(entity);
      return "成功保存从者职介：" + name;
    } catch (DataIntegrityViolationException e) {
      return "保存失败：已存在名为'" + name + "'的职介，请创建不同的职介";
    } catch (Exception e) {
      return "保存失败：" + e.getMessage();
    }
  }

  @Tool(
      description =
          "设置或更新两个职介之间的攻击伤害倍率。用于定义职阶克制关系，默认倍率为 1.0（正常伤害），>1.0 表示克制（最高 2.0），<1.0 表示被克制（最低 0.5）。调用前需确保攻击者和防御者职介 ID 均存在")
  public String saveServantClassDamageRatio(
      @ToolParam(description = "攻击者职介的数据库 ID") Long attackerId,
      @ToolParam(description = "攻击者职介的名称，用于结果提示") String attackerName,
      @ToolParam(description = "防御者职介的数据库 ID") Long defenderId,
      @ToolParam(description = "防御者职介的名称，用于结果提示") String defenderName,
      @ToolParam(
              description =
                  "攻击伤害倍率，建议范围 0.5-2.0。1.0 为正常伤害，2.0 为最大克制，0.5 为最小克制。例如：Saber 对 Lancer 设为 2.0，对 Archer 设为 0.5")
          Double ratio) {
    if (!servantClassService.existById(attackerId)) return "失败：不存在的攻击者职介id " + attackerId;
    if (!servantClassService.existById(defenderId)) return "失败：不存在的防御者职介id " + defenderId;
    var entity =
        servantClassDamageRatioService.findByAttackerIdAndDefenderId(attackerId, defenderId);
    if (entity == null) entity = new ServantClassDamageRatio();
    entity.setRatio(ratio);
    entity.setAttackerId(attackerId);
    entity.setDefenderId(defenderId);
    entity.setAttackerName(attackerName);
    entity.setDefenderName(defenderName);
    servantClassDamageRatioService.save(entity);
    return String.format("成功保存%s对%s的攻击倍率", attackerName, defenderName);
  }
}
