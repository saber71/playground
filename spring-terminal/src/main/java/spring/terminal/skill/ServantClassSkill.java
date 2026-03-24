package spring.terminal.skill;

import java.util.List;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.dao.DataIntegrityViolationException;
import spring.terminal.entity.ServantClass;
import spring.terminal.repository.ServantClassRepository;

@Skill
public class ServantClassSkill {

  private final ServantClassRepository servantClassRepository;

  public ServantClassSkill(ServantClassRepository servantClassRepository) {
    this.servantClassRepository = servantClassRepository;
  }

  @Tool(description = "创建新的从者职介。在调用前必须先调用 getAllServantClass 检查是否已存在同名职介。需要提供中文名、英文名、介绍文本和是否为基础七职介")
  public String createServantClass(
      @ToolParam(description = "新从者职介中文名，必须唯一，不能与已有职介重复") String name,
      @ToolParam(description = "新从者职介的英文名") String enName,
      @ToolParam(description = "新从者职介的介绍文本，说明该职介的特点") String description,
      @ToolParam(
              description =
                  "是否为基础七职介（Saber/Archer/Lancer/Rider/Caster/Assassin/Berserker 为 true，其他特殊职介为 false）")
          boolean isBasicClass) {
    try {
      var entity = new ServantClass();
      entity.setName(name);
      entity.setEnName(enName);
      entity.setIsBasicClass(isBasicClass);
      entity.setDescription(description);
      servantClassRepository.save(entity);
      return "成功创建从者职介：" + name + " (" + enName + ")";
    } catch (DataIntegrityViolationException e) {
      return "创建失败：已存在名为'" + name + "'的职介，请创建不同的职介";
    } catch (Exception e) {
      return "创建失败：" + e.getMessage();
    }
  }

  @Tool(description = "查询所有已创建的从者职介列表。在创建新职介前必须调用此工具检查是否已存在同名职介，也可用于回答用户关于职介的查询问题")
  public List<ServantClass> getAllServantClass() {
    return servantClassRepository.findAll();
  }
}
