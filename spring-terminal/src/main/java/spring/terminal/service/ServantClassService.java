package spring.terminal.service;

import org.springframework.stereotype.Service;
import spring.terminal.entity.ServantClass;
import spring.terminal.repository.ServantClassRepository;

@Service
public class ServantClassService extends BaseEntityService<ServantClass, Long> {

  private final ServantClassRepository servantClassRepository;

  public ServantClassService(ServantClassRepository servantClassRepository) {
    super(servantClassRepository);
    this.servantClassRepository = servantClassRepository;
  }
}
