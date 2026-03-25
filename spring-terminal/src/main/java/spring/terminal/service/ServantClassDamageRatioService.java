package spring.terminal.service;

import org.springframework.stereotype.Service;
import spring.terminal.entity.ServantClassDamageRatio;
import spring.terminal.repository.ServantClassDamageRatioRepository;

@Service
public class ServantClassDamageRatioService
    extends BaseEntityService<ServantClassDamageRatio, Long> {

  private final ServantClassDamageRatioRepository
      servantClassDamageRatioRepository;

  public ServantClassDamageRatioService(
      ServantClassDamageRatioRepository servantClassDamageRatioRepository) {
    super(servantClassDamageRatioRepository);
    this.servantClassDamageRatioRepository = servantClassDamageRatioRepository;
  }
}
