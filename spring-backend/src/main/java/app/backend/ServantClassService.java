package app.backend;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ServantClassService {

  private final Helper helper;
  private final ServantClassRepository servantClassRepository;

  public ServantClassService(ServantClassRepository servantClassRepository, Helper helper) {
    this.servantClassRepository = servantClassRepository;
    this.helper = helper;
  }

  /** 软删除从者职介（支持批量删除） */
  public void delete(List<Long> ids) {
    int deletedCount = servantClassRepository.softDeleteByIds(ids);
    if (deletedCount != ids.size()) {
      throw new RuntimeException("部分记录不存在或已被删除");
    }
  }

  /** 查询所有未删除的从者职介 */
  public List<ServantClass> findAll() {
    return servantClassRepository.findAllNotDeleted();
  }

  /** 根据 ID 查询从者职介 */
  public ServantClass findById(Long id) {
    return servantClassRepository.findByIdAndNotDeleted(id);
  }

  /** 恢复已删除的从者职介（支持批量恢复） */
  public void restore(List<Long> ids) {
    int restoredCount = servantClassRepository.restoreByIds(ids);
    if (restoredCount != ids.size()) {
      throw new RuntimeException("部分记录不存在或未被删除");
    }
  }

  /** 保存从者职介 */
  public ServantClass save(ServantClass.DTO dto) {
    var entity = helper.assign(new ServantClass(), dto);
    return servantClassRepository.save(entity);
  }

  /** 更新从者职介信息 */
  public ServantClass update(Long id, ServantClass.DTO dto) {
    var existing = servantClassRepository.findByIdAndNotDeleted(id);
    if (existing == null) {
      throw new RuntimeException("从者职介不存在或已被删除");
    }
    helper.assign(existing, dto);
    return servantClassRepository.save(existing);
  }
}
