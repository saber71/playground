package spring.terminal;

import org.springframework.stereotype.Service;

@Service
public class ServantClassDamageService {

  private final ServantClassDamageRatioRepository servantClassDamageRatioRepository;

  public ServantClassDamageService(
      ServantClassDamageRatioRepository servantClassDamageRatioRepository) {
    this.servantClassDamageRatioRepository = servantClassDamageRatioRepository;
  }

  public Long getRatio(Long attackerId, Long defenderId) {
    return servantClassDamageRatioRepository
        .getFirstByAttackerIdAndDefenderId(attackerId, defenderId)
        .orElse(1L);
  }
}
