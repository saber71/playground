package app.backend;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ServantClassDamageRatioRepository
    extends JpaRepository<ServantClassDamageRatio, Long> {

  @Query("SELECT s FROM ServantClassDamageRatio s WHERE s.id = :id AND s.deleted = false")
  Optional<ServantClassDamageRatio> findByIdAndNotDeleted(@Param("id") Long id);

  Optional<ServantClassDamageRatio> getFirstByAttackerIdAndDefenderId(
      Long attackerId, Long defenderId);

  @Modifying
  @Transactional
  @Query("UPDATE ServantClassDamageRatio s SET s.deleted = false WHERE s.id IN :ids")
  int restoreByIds(@Param("ids") List<Long> ids);

  @Modifying
  @Transactional
  @Query("UPDATE ServantClassDamageRatio s SET s.deleted = true WHERE s.id IN :ids")
  int softDeleteByIds(@Param("ids") List<Long> ids);
}
