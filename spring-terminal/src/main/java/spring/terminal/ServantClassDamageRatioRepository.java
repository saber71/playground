package spring.terminal;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServantClassDamageRatioRepository
    extends JpaRepository<ServantClassDamageRatio, Long> {

  Optional<Long> getFirstByAttackerIdAndDefenderId(Long attackerId, Long defenderId);
}
