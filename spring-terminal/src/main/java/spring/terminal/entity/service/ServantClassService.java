package spring.terminal.entity.service;

import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;
import spring.terminal.entity.ServantClass;
import spring.terminal.entity.repository.ServantClassRepository;

@Service
public class ServantClassService extends BaseEntityService<ServantClass, Long> {

  private final ServantClassRepository servantClassRepository;

  public ServantClassService(ServantClassRepository servantClassRepository) {
    super(servantClassRepository);
    this.servantClassRepository = servantClassRepository;
  }

  public @Nullable ServantClass findByName(String name) {
    return servantClassRepository.findFirst(b -> b.eq("name", name));
  }
}
