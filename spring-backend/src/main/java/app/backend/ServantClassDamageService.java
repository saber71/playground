package app.backend;

import org.springframework.stereotype.Service;

@Service
public class ServantClassDamageService {

  private final ServantClassDamageRatioRepository servantClassDamageRatioRepository;

  public ServantClassDamageService(
      ServantClassDamageRatioRepository servantClassDamageRatioRepository) {
    this.servantClassDamageRatioRepository = servantClassDamageRatioRepository;
  }

  /** 软删除克制关系（支持批量删除） */
  public void delete(java.util.List<Long> ids) {
    int deletedCount = servantClassDamageRatioRepository.softDeleteByIds(ids);
    if (deletedCount != ids.size()) {
      throw new RuntimeException("部分记录不存在或已被删除");
    }
  }

  /** 根据攻击者和防御者 ID 查询克制关系 */
  public ServantClassDamageRatio findByAttackerAndDefender(Long attackerId, Long defenderId) {
    return servantClassDamageRatioRepository
        .getFirstByAttackerIdAndDefenderId(attackerId, defenderId)
        .orElse(null);
  }

  /** 根据 ID 查询克制关系 */
  public ServantClassDamageRatio findById(Long id) {
    return servantClassDamageRatioRepository.findById(id).orElse(null);
  }

  /** 获取克制倍率 */
  public Double getRatio(Long attackerId, Long defenderId) {
    return servantClassDamageRatioRepository
        .getFirstByAttackerIdAndDefenderId(attackerId, defenderId)
        .map(ServantClassDamageRatio::getParam)
        .orElse(1d);
  }

  /** 恢复已删除的克制关系（支持批量恢复） */
  public void restore(java.util.List<Long> ids) {
    int restoredCount = servantClassDamageRatioRepository.restoreByIds(ids);
    if (restoredCount != ids.size()) {
      throw new RuntimeException("部分记录不存在或未被删除");
    }
  }

  /** 保存克制关系 */
  public ServantClassDamageRatio save(ServantClassDamageRatio entity) {
    return servantClassDamageRatioRepository.save(entity);
  }

  /**
   * 保存或更新克制关系（包含名称信息）
   *
   * @param attackerId 攻击者 ID
   * @param attackerName 攻击者名称
   * @param defenderId 防御者 ID
   * @param defenderName 防御者名称
   * @param param 克制倍率
   * @return 保存后的实体
   */
  public ServantClassDamageRatio saveOrUpdate(
      Long attackerId, String attackerName, Long defenderId, String defenderName, double param) {
    var existing =
        servantClassDamageRatioRepository.getFirstByAttackerIdAndDefenderId(attackerId, defenderId);

    if (existing.isPresent()) {
      // 更新已有记录
      var toUpdate = existing.get();
      toUpdate.setAttackerName(attackerName);
      toUpdate.setDefenderName(defenderName);
      toUpdate.setParam(param);
      return servantClassDamageRatioRepository.save(toUpdate);
    } else {
      // 创建新记录
      var entity = new ServantClassDamageRatio();
      entity.setAttackerId(attackerId);
      entity.setAttackerName(attackerName);
      entity.setDefenderId(defenderId);
      entity.setDefenderName(defenderName);
      entity.setParam(param);
      return servantClassDamageRatioRepository.save(entity);
    }
  }

  /** 更新克制关系 */
  public ServantClassDamageRatio update(Long id, ServantClassDamageRatio entity) {
    var existing = servantClassDamageRatioRepository.findById(id);
    if (existing.isEmpty()) {
      throw new RuntimeException("克制关系不存在或已被删除");
    }
    var toUpdate = existing.get();
    toUpdate.setAttackerId(entity.getAttackerId());
    toUpdate.setAttackerName(entity.getAttackerName());
    toUpdate.setDefenderId(entity.getDefenderId());
    toUpdate.setDefenderName(entity.getDefenderName());
    toUpdate.setParam(entity.getParam());
    return servantClassDamageRatioRepository.save(toUpdate);
  }
}
