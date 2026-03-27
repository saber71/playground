package spring.terminal.service;

import java.util.Arrays;
import java.util.List;
import org.jetbrains.annotations.NotNull;
import spring.terminal.entity.BaseEntity;
import spring.terminal.entity.repository.BaseEntityRepository;

public class BaseEntityService<Entity extends BaseEntity, ID> {

  private final BaseEntityRepository<Entity, ID> entityRepository;

  public BaseEntityService(BaseEntityRepository<Entity, ID> entityRepository) {
    this.entityRepository = entityRepository;
  }

  public void delete(Entity @NotNull ... entities) {
    for (Entity entity : entities) {
      entity.setSoftDelete();
    }
    entityRepository.saveAll(Arrays.asList(entities));
  }

  public boolean existById(ID id) {
    return entityRepository.existsById(id);
  }

  public List<Entity> findAll() {
    return entityRepository.findAll();
  }

  public Long getTotalCount() {
    return entityRepository.count();
  }

  public void save(Entity... entities) {
    entityRepository.saveAll(Arrays.asList(entities));
  }
}
