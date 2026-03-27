package spring.terminal.service;

import java.util.List;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;
import spring.terminal.entity.ServantClassDamageRatio;
import spring.terminal.entity.repository.ServantClassDamageRatioRepository;

@Service
public class ServantClassDamageRatioService
    extends BaseEntityService<ServantClassDamageRatio, Long> {

  private final ServantClassDamageRatioRepository servantClassDamageRatioRepository;

  public ServantClassDamageRatioService(
      ServantClassDamageRatioRepository servantClassDamageRatioRepository) {
    super(servantClassDamageRatioRepository);
    this.servantClassDamageRatioRepository = servantClassDamageRatioRepository;
  }

  public List<ServantClassDamageRatio> findAllByAttackerName(String attackerName) {
    return servantClassDamageRatioRepository.findAll(
        builder -> builder.eq("attackerName", attackerName));
  }

  public @Nullable ServantClassDamageRatio findByAttackerIdAndDefenderId(
      Long attackerId, Long defenderId) {
    return servantClassDamageRatioRepository.findFirst(
        b -> b.eq("attackerId", attackerId).eq("defenderId", defenderId));
  }
}
