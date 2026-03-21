package app.backend;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServantClassRepository extends JpaRepository<ServantClass, Long> {

  /**
   * 查找未删除的从者职介
   */
  @Query("SELECT s FROM ServantClass s WHERE s.deleted = false")
  List<ServantClass> findAllNotDeleted();

  /**
   * 根据 ID 查找未删除的从者职介
   */
  @Query("SELECT s FROM ServantClass s WHERE s.id = :id AND s.deleted = false")
  ServantClass findByIdAndNotDeleted(@Param("id") Long id);

  /**
   * 恢复已删除的从者职介
   * @param ids 要恢复的 ID 列表
   * @return 被恢复的记录数
   */
  @Modifying
  @Transactional
  @Query("UPDATE ServantClass s SET s.deleted = false WHERE s.id IN :ids")
  int restoreByIds(@Param("ids") List<Long> ids);

  /**
   * 软删除 - 逻辑删除
   * @param ids 要删除的 ID 列表
   * @return 被删除的记录数
   */
  @Modifying
  @Transactional
  @Query("UPDATE ServantClass s SET s.deleted = true WHERE s.id IN :ids")
  int softDeleteByIds(@Param("ids") List<Long> ids);
}
