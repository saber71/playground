package app.backend;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/servant-class")
public class ServantClassController {

  private final ServantClassDamageService servantClassDamageService;
  private final ServantClassService servantClassService;

  public ServantClassController(
      ServantClassService servantClassService,
      ServantClassDamageService servantClassDamageService) {
    this.servantClassService = servantClassService;
    this.servantClassDamageService = servantClassDamageService;
  }

  /** 创建从者职介 */
  @PostMapping
  public ServantClass create(@RequestBody ServantClass.DTO dto) {
    return servantClassService.save(dto);
  }

  /** 删除从者职介（支持批量删除） 请求体格式：[1, 2, 3] */
  @DeleteMapping
  public void delete(@RequestBody List<Long> ids) {
    servantClassService.delete(ids);
  }

  /** 软删除克制关系（支持批量删除）请求体格式：[1, 2, 3] */
  @DeleteMapping("/damage-ratio")
  public void deleteDamageRatio(@RequestBody List<Long> ids) {
    servantClassDamageService.delete(ids);
  }

  /** 查询所有从者职介 */
  @GetMapping
  public List<ServantClass> findAll() {
    return servantClassService.findAll();
  }

  /** 根据 ID 查询从者职介 */
  @GetMapping("/{id}")
  public ServantClass findById(@PathVariable Long id) {
    return servantClassService.findById(id);
  }

  /** 根据攻击者和防御者 ID 查询克制关系 */
  @GetMapping("/damage-ratio")
  public ServantClassDamageRatio findDamageRatioByAttackerAndDefender(
      @RequestParam Long attackerId, @RequestParam Long defenderId) {
    return servantClassDamageService.findByAttackerAndDefender(attackerId, defenderId);
  }

  /** 根据 ID 查询克制关系 */
  @GetMapping("/damage-ratio/{id}")
  public ServantClassDamageRatio findDamageRatioById(@PathVariable Long id) {
    return servantClassDamageService.findById(id);
  }

  /** 获取克制倍率 */
  @GetMapping("/damage-ratio/ratio")
  public Double getDamageRatio(@RequestParam Long attackerId, @RequestParam Long defenderId) {
    return servantClassDamageService.getRatio(attackerId, defenderId);
  }

  /** 恢复已删除的从者职介（支持批量恢复） 请求体格式：[1, 2, 3] */
  @PostMapping("/restore")
  public void restore(@RequestBody List<Long> ids) {
    servantClassService.restore(ids);
  }

  /** 恢复已删除的克制关系（支持批量恢复）请求体格式：[1, 2, 3] */
  @PostMapping("/damage-ratio/restore")
  public void restoreDamageRatio(@RequestBody List<Long> ids) {
    servantClassDamageService.restore(ids);
  }

  /** 保存或更新克制关系 */
  @PostMapping("/damage-ratio")
  public ServantClassDamageRatio saveDamageRatio(@RequestBody DamageRatioDTO dto) {
    return servantClassDamageService.saveOrUpdate(
        dto.attackerId(), dto.attackerName(), dto.defenderId(), dto.defenderName(), dto.param());
  }

  /** 更新从者职介 */
  @PutMapping("/{id}")
  public ServantClass update(@PathVariable Long id, @RequestBody ServantClass.DTO dto) {
    return servantClassService.update(id, dto);
  }

  /** 更新克制关系 */
  @PutMapping("/damage-ratio/{id}")
  public ServantClassDamageRatio updateDamageRatio(
      @PathVariable Long id, @RequestBody ServantClassDamageRatio entity) {
    return servantClassDamageService.update(id, entity);
  }

  /** 克制关系数据传输对象 */
  public record DamageRatioDTO(
      Long attackerId, String attackerName, Long defenderId, String defenderName, double param) {}
}
